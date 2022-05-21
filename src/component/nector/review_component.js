/* eslint-disable no-unused-vars */
//from system
import React from "react";
import prop_types from "prop-types";
// import random_gradient from "random-gradient";
import * as react_material_icons from "react-icons/md";
import StackGrid from "react-stack-grid";
import { withSize } from "react-sizeme";

import ReviewCreateForm from "../../component_form/nector/review/create_form";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";
import axios_wrapper from "../../wrapper/axios_wrapper";
import security_wrapper from "../../wrapper/security_wrapper";

import * as antd from "antd";

// NOTE: reference_product_id and product_id for backward compatibiltiy

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,
	reviews: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,

	// from sizeme
	size: prop_types.object
};

//from app
class ReviewComponent extends React.Component {
	constructor(props) {
		super(props);

		const search_params = collection_helper.process_url_params(this.props.location.search);

		this.state = {
			loading: false,

			page: search_params.get("page") ? Number(search_params.get("page")) : 1,
			limit: search_params.get("limit") ? Number(search_params.get("limit")) : 6,
			sort: "created_at",
			sort_op: "DESC",

			review_submitting: false,
			review_form_active_key: null
		};

		this.api_merchant_create_triggeractivities = this.api_merchant_create_triggeractivities.bind(this);
		this.api_merchant_list_reviews = this.api_merchant_list_reviews.bind(this);
		this.api_merchant_get_reviews = this.api_merchant_get_reviews.bind(this);

		this.process_review_item = this.process_review_item.bind(this);
		this.toggle_review_form = this.toggle_review_form.bind(this);
		this.on_page_change = this.on_page_change.bind(this);
		this.on_sort_change = this.on_sort_change.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		// eslint-disable-next-line no-undef
		this.api_merchant_list_reviews({ page: this.state.page, limit: this.state.limit });
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	// unmount
	componentWillUnmount() {
		const opts = {
			event: constant_helper.get_app_constant().INTERNAL_DISPATCH,
			append_data: false,
			attributes: {
				key: "coupon",
				value: {}
			}
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.internal_generic_dispatch(opts, (result) => {

		});
	}

	async api_merchant_create_triggeractivities(values, form) {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);

		const product_id = search_params.get("reference_product_id") || search_params.get("product_id");
		const product_source = default_search_params.identifier || null;
		const trigger_id = search_params.get("trigger_id");
		const customer_id = collection_helper.process_key_join([product_source, security_wrapper.get_wrapper().process_sha256_hash(values.email)].filter(x => x), "-");

		if (collection_helper.validate_is_null_or_undefined(product_id) || collection_helper.validate_is_null_or_undefined(product_source) || collection_helper.validate_is_null_or_undefined(trigger_id) === true) return;

		// try fetching the deal
		const reviewopts = {
			event: constant_helper.get_app_constant().API_SUCCESS_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				...axios_wrapper.get_wrapper().create({
					trigger_id: trigger_id,
					customer_id: customer_id,
					trace: {
						params_for_review: {
							reference_product_id: product_id,
							reference_product_source: product_source,
							...collection_helper.get_lodash().omitBy(collection_helper.get_lodash().omit(values, ["email"]), collection_helper.get_lodash().isNil)
						}
					},
					metadetail: {
						email: values.email
					},
					name: values.name
				}, "triggeractivity", "create")
			}
		};

		this.set_state({ review_submitting: true });
		await this.props.app_action.api_generic_post(reviewopts, (result) => {
			this.set_state({ review_submitting: false });

			if (result.data.success === true) {
				this.api_merchant_list_reviews({ page: this.state.page, limit: this.state.limit });
				this.toggle_review_form();

				form && form.resetFields();
			}
		});

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_review_create_request);
	}

	api_merchant_list_reviews(values = {}) {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);

		this.setState({ page: values.page || 1, limit: values.limit || 6, sort: values.sort || "created_at", sort_op: values.sort_op || "DESC" });

		// try fetching th coupon
		const reviewopts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_REVIEW_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				...axios_wrapper.get_wrapper().fetch({
					page: values.page || 1,
					limit: values.limit || 6,
					sort: values.sort || "created_at",
					sort_op: values.sort_op || "DESC",
				}, "review")
			},
		};

		if (collection_helper.validate_not_null_or_undefined(search_params.get("reference_product_id"))) reviewopts.attributes.params.reference_product_id = search_params.get("reference_product_id");
		else if (collection_helper.validate_not_null_or_undefined(search_params.get("product_id"))) reviewopts.attributes.params.reference_product_id = search_params.get("product_id");

		if (collection_helper.validate_not_null_or_undefined(default_search_params.identifier)) reviewopts.attributes.params.reference_product_source = default_search_params.identifier;

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(reviewopts, (result) => { });
	}

	api_merchant_get_reviews() {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);

		if (collection_helper.validate_is_null_or_undefined(search_params.get("coupon_id")) === true) return null;

		// try fetching th coupon
		const couponopts = {
			event: constant_helper.get_app_constant().API_MERCHANT_VIEW_REVIEW_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				...axios_wrapper.get_wrapper().get(search_params.get("review_id"), "review")
			},
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(couponopts, (result) => { });
	}

	process_review_item(record) {
		const user_name = record.name;

		return (
			<antd.Card key={record.key} bodyStyle={{ padding: 15, backgroundColor: "rgb(251, 251, 251)" }}>
				<div style={{ display: "flex" }}>
					<div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
						<antd.Typography.Text style={{ display: "block", fontSize: "0.9rem", fontWeight: "bold" }} className="truncate-text">{user_name}</antd.Typography.Text>
						<div style={{ display: "flex", alignItems: "center" }}>
							<antd.Rate disabled value={record.rating} style={{ fontSize: "0.9rem" }} />
						</div>
					</div>
				</div>

				<div style={{ marginTop: 10 }}>
					<h3 className="truncate-text">{record.title}</h3>
					<antd.Typography.Text className="truncate-text" style={{ fontSize: "0.8rem", display: "block", whiteSpace: "normal" }}>{record.description}</antd.Typography.Text>
				</div>

				<div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
					<antd.Typography.Text style={{ fontSize: "0.7rem", color: "#666" }}>{collection_helper.get_moment()(record.created_at).format("LL")}</antd.Typography.Text>
				</div>

				{/* <div style={{ display: "flex", marginTop: 15 }}>
					<span><react_material_icons.MdOutlineThumbUpAlt style={{ fontSize: "18px", cursor: "pointer" }} /> <span style={{ fontSize: "0.9rem" }}>10</span></span>
					<span style={{ display: "inline-block", marginLeft: 15 }}><react_material_icons.MdOutlineThumbDownAlt style={{ fontSize: "18px", cursor: "pointer" }} /> <span style={{ fontSize: "0.9rem" }}>15</span></span>
				</div> */}
			</antd.Card>
		);
	}

	on_sort_change(value) {
		this.api_merchant_list_reviews({ page: this.state.page, limit: this.state.limit, sort: value, sort_op: "DESC" });
	}

	on_page_change(page, pageSize) {
		this.api_merchant_list_reviews({ page, limit: this.state.limit, sort: this.state.sort, sort_op: this.state.sort_op });
	}

	toggle_review_form() {
		this.setState({
			review_form_active_key: this.state.review_form_active_key ? null : "review_form"
		});

		// eslint-disable-next-line no-undef
		const review_form_container = document.getElementById("review_form_container");
		if (review_form_container && !this.state.review_form_active_key) {
			const ele_rect = review_form_container.getBoundingClientRect();
			// eslint-disable-next-line no-undef
			const window_height = window.innerHeight;

			if (ele_rect.y + 50 > window_height) {
				review_form_container.scrollIntoView({
					behavior: "smooth",
					block: "center"
				});
			}
		}
	}

	set_state(values) {
		// eslint-disable-next-line no-unused-vars
		this.setState((state, props) => ({
			...state,
			...values
		}));
	}

	render() {
		const search_params = collection_helper.process_url_params(this.props.location.search);

		const count = (this.props.reviews && this.props.reviews.count || 0);
		const dataSource = ((this.props.reviews && this.props.reviews.items) || []).map(item => ({ ...item, key: item._id }));

		const safe_reviewcount = count || 1;
		const review_stats = (this.props.reviews && this.props.reviews.stats) || [];

		const review_stat = {};
		for (const stat of review_stats) review_stat[stat.rating] = Number(stat.count || 0);
		const avg_rating = Number(Object.keys(review_stat).map(key => Number(key) * Number(review_stat[key])).reduce((a, b) => a + b, 0) / safe_reviewcount).toFixed(2);

		return (
			<div style={{ margin: 20, padding: 20, border: "1px solid rgb(230, 230, 230)", borderRadius: 6 }}>
				<antd.Typography.Title level={4} style={{ display: "block", marginBottom: 15 }}>Customer Reviews</antd.Typography.Title>

				<antd.Divider style={{ marginTop: 15 }} />

				<antd.Row>
					<antd.Col xs={24} sm={7} md={6} lg={4}>
						<antd.Typography.Title level={4} strong style={{ margin: 0 }}>{avg_rating} out of 5</antd.Typography.Title>
						<antd.Rate disabled value={avg_rating} />
						<p>Based on {count} Reviews</p>
					</antd.Col>

					<antd.Col xs={24} sm={17} md={12} lg={12}>
						<div style={{ display: "flex", alignItems: "center", marginBottom: 7 }}>
							<antd.Rate disabled style={{ flex: "1 0 auto", marginRight: 15 }} defaultValue={5} />
							<antd.Progress status="normal" percent={Number(((review_stat[5] || 0) / safe_reviewcount) * 100).toFixed(0)} />
						</div>

						<div style={{ display: "flex", alignItems: "center", marginBottom: 7 }}>
							<antd.Rate disabled style={{ flex: "1 0 auto", marginRight: 15 }} defaultValue={4} />
							<antd.Progress status="normal" percent={Number(((review_stat[4] || 0) / safe_reviewcount) * 100).toFixed(0)} />
						</div>

						<div style={{ display: "flex", alignItems: "center", marginBottom: 7 }}>
							<antd.Rate disabled style={{ flex: "1 0 auto", marginRight: 15 }} defaultValue={3} />
							<antd.Progress status="normal" percent={Number(((review_stat[3] || 0) / safe_reviewcount) * 100).toFixed(0)} />
						</div>

						<div style={{ display: "flex", alignItems: "center", marginBottom: 7 }}>
							<antd.Rate disabled style={{ flex: "1 0 auto", marginRight: 15 }} defaultValue={2} />
							<antd.Progress status="normal" percent={Number(((review_stat[2] || 0) / safe_reviewcount) * 100).toFixed(0)} />
						</div>

						<div style={{ display: "flex", alignItems: "center", marginBottom: 7 }}>
							<antd.Rate disabled style={{ flex: "1 0 auto", marginRight: 15 }} defaultValue={1} />
							<antd.Progress status="normal" percent={Number(((review_stat[1] || 0) / safe_reviewcount) * 100).toFixed(0)} />
						</div>
					</antd.Col>

					{
						(search_params.get("reference_product_id") || search_params.get("product_id")) && (<antd.Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 3, offset: 5 }} style={{ display: "flex", justifyContent: "end" }}>
							<antd.Button style={{ width: "100%" }} onClick={this.toggle_review_form}>Write A Review</antd.Button>
						</antd.Col>)
					}
				</antd.Row>

				<antd.Row>
					<antd.Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4, offset: 20 }} lg={{ span: 3, offset: 21 }} style={{ display: "flex" }}>
						<antd.Select className="reviews-sorter" value={this.state.sort} onChange={this.on_sort_change}>
							<antd.Select.Option value="created_at">Most Recent</antd.Select.Option>
							<antd.Select.Option value="rating">Top Rated</antd.Select.Option>
						</antd.Select>
					</antd.Col>
				</antd.Row>

				<antd.Collapse ghost activeKey={this.state.review_form_active_key}>
					<antd.Collapse.Panel id="review_form_container" className="hide_collapse_panel" key="review_form" showArrow={false} style={{ cursor: "unset" }} forceRender={true}>
						<div id="review_form">
							<antd.Divider />

							<antd.Typography.Title level={5}>Write A Review</antd.Typography.Title>

							<ReviewCreateForm submitting={this.state.review_submitting} api_merchant_create_triggeractivities={this.api_merchant_create_triggeractivities} />
						</div>
					</antd.Collapse.Panel>
				</antd.Collapse>

				<antd.Divider />

				<div>
					<div style={{ marginTop: 12 }}>
						<StackGrid
							columnWidth={this.props.size.width <= 550 ? "100%" : this.props.size.width <= 768 ? "48%" : "30%"}
							gutterWidth={15}
							gutterHeight={10}
						>
							{dataSource && dataSource.map(item => this.process_review_item(item))}
						</StackGrid>

						<div style={{ display: "flex", justifyContent: "end", marginTop: 15 }}>
							<antd.Pagination 
								showSizeChanger={false}
								current={this.state.page} 
								pageSize={this.state.limit}
								total={count}
								onChange={this.on_page_change} 
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

ReviewComponent.propTypes = properties;

export default withSize()(ReviewComponent);