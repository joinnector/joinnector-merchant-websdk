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

import * as antd from "antd";

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

		this.state = {
			loading: false,

			page: 1,
			limit: 6,
			sort: "created_at",
			sort_op: "DESC",

			review_submitting: false,
			review_form_active_key: null
		};

		this.api_merchant_create_reviews = this.api_merchant_create_reviews.bind(this);
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
		this.api_merchant_list_reviews({});
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

	api_merchant_create_reviews(values) {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);

		const product_id = search_params.get("product_id");
		const product_source = default_search_params.identifier || null;

		if (collection_helper.validate_is_null_or_undefined(product_id) || collection_helper.validate_is_null_or_undefined(product_source)) return;

		const payload = {
			product_id,
			product_source: product_source,
			...collection_helper.get_lodash().omitBy(values, collection_helper.get_lodash().isNil)
		};

		// try fetching the deal
		const dealopts = {
			event: constant_helper.get_app_constant().API_SUCCESS_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				...axios_wrapper.get_wrapper().create({
					...payload
				}, "review")
			}
		};

		this.set_state({ review_submitting: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(dealopts, (result) => {
			this.set_state({ review_submitting: false });
			this.api_merchant_list_reviews({});
		});
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

		if (collection_helper.validate_not_null_or_undefined(search_params.get("product_id"))) reviewopts.attributes.params.product_id = search_params.get("product_id");
		if (collection_helper.validate_not_null_or_undefined(default_search_params.identifier)) reviewopts.attributes.params.product_source = default_search_params.identifier;

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
			<antd.Card key={record.key} bodyStyle={{ padding: 15 }}>
				<div style={{ display: "flex" }}>
					<div style={{ width: "75px", height: "75px", borderRadius: "50%", fontSize: "24px", backgroundColor: "#eee" }} className="center-all">{collection_helper.get_first_letter_from_string(user_name)}</div>

					<div style={{ marginLeft: 15, display: "flex", flexDirection: "column" }}>
						<antd.Typography.Text style={{ display: "block", fontSize: "1rem" }}>{user_name}</antd.Typography.Text>
						<div style={{ display: "flex", alignItems: "center" }}>
							<antd.Typography.Text>{record.rating}</antd.Typography.Text>
							<antd.Rate disabled value={record.rating} style={{ fontSize: "1rem", marginLeft: 10 }} />
						</div>
						<antd.Typography.Text style={{ fontSize: "0.7rem" }}>{collection_helper.get_moment()(record.created_at).format("LL")}</antd.Typography.Text>
					</div>
				</div>

				<div style={{ marginTop: 15 }}>
					<h3>{record.title}</h3>
					<antd.Typography.Text style={{ fontSize: "0.8rem" }}>{record.description}</antd.Typography.Text>
				</div>

				{/* <div style={{ display: "flex", marginTop: 15 }}>
					<span><react_material_icons.MdOutlineThumbUpAlt style={{ fontSize: "18px", cursor: "pointer" }} /> <span style={{ fontSize: "0.9rem" }}>10</span></span>
					<span style={{ display: "inline-block", marginLeft: 15 }}><react_material_icons.MdOutlineThumbDownAlt style={{ fontSize: "18px", cursor: "pointer" }} /> <span style={{ fontSize: "0.9rem" }}>15</span></span>
				</div> */}
			</antd.Card>
		);
	}

	on_sort_change(value) {
		this.api_merchant_list_reviews({ sort: value, sort_op: "DESC" });
	}

	on_page_change(page, pageSize) {
		this.api_merchant_list_reviews({ page, limit: pageSize, sort: this.state.sort, sort_op: this.state.sort_op });
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

		const review_stats = ((this.props.reviews && this.props.reviews.stats) || []);
		const rating_stats = review_stats.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {});
		const avg_rating = Number((review_stats.reduce((acc, item) => acc + item._id * item.count, 0) || 0) / (count || Infinity)).toFixed(2);

		return (
			<div style={{ padding: 20 }}>
				<antd.Typography.Title level={3} style={{ display: "block" }}>Customer Reviews</antd.Typography.Title>

				<antd.Divider />

				<antd.Row>
					<antd.Col xs={24} sm={7} md={6} lg={4}>
						<antd.Typography.Title level={4} strong style={{ margin: 0 }}>{avg_rating} out of 5</antd.Typography.Title>
						<antd.Rate disabled value={avg_rating} />
						<p>Based on {count} Reviews</p>
					</antd.Col>

					<antd.Col xs={24} sm={17} md={12} lg={12}>
						<div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
							<antd.Rate disabled style={{ flex: "1 0 auto", marginRight: 15 }} defaultValue={5} />
							<antd.Progress status="normal" percent={Math.round(((rating_stats[5] || 0) / count) * 100)} />
						</div>

						<div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
							<antd.Rate disabled style={{ flex: "1 0 auto", marginRight: 15 }} defaultValue={4} />
							<antd.Progress status="normal" percent={Math.round(((rating_stats[4] || 0) / count) * 100)} />
						</div>

						<div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
							<antd.Rate disabled style={{ flex: "1 0 auto", marginRight: 15 }} defaultValue={3} />
							<antd.Progress status="normal" percent={Math.round(((rating_stats[3] || 0) / count) * 100)} />
						</div>

						<div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
							<antd.Rate disabled style={{ flex: "1 0 auto", marginRight: 15 }} defaultValue={2} />
							<antd.Progress status="normal" percent={Math.round(((rating_stats[2] || 0) / count) * 100)} />
						</div>

						<div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
							<antd.Rate disabled style={{ flex: "1 0 auto", marginRight: 15 }} defaultValue={1} />
							<antd.Progress status="normal" percent={Math.round(((rating_stats[1] || 0) / count) * 100)} />
						</div>
					</antd.Col>

					{
						search_params.get("product_id") && (<antd.Col xs={24} sm={24} md={6} lg={8} style={{ display: "flex", justifyContent: "end" }}>
							<antd.Button onClick={this.toggle_review_form}>Write A Review</antd.Button>
						</antd.Col>)
					}
				</antd.Row>

				<antd.Collapse ghost activeKey={this.state.review_form_active_key}>
					<antd.Collapse.Panel id="review_form_container" className="hide_collapse_panel" key="review_form" showArrow={false} style={{ cursor: "unset" }} forceRender={true}>
						<div id="review_form">
							<antd.Divider />

							<antd.Typography.Title level={5}>Write A Review</antd.Typography.Title>

							<ReviewCreateForm api_merchant_create_reviews={this.api_merchant_create_reviews} />
						</div>
					</antd.Collapse.Panel>
				</antd.Collapse>

				<antd.Divider />

				<div>
					<div style={{ display: "flex" }}>
						<antd.Typography.Text style={{ display: "block", fontWeight: "bold", textDecoration: "underline", paddingBottom: 10, fontSize: "1.1rem" }}>Reviews</antd.Typography.Text>

						<antd.Select style={{ width: 175, marginLeft: 20 }} value={this.state.sort} onChange={this.on_sort_change}>
							<antd.Select.Option value="created_at">Most Recent</antd.Select.Option>
							<antd.Select.Option value="rating">Top Rated</antd.Select.Option>
						</antd.Select>
					</div>

					<div style={{ marginTop: 12 }}>
						<StackGrid
							columnWidth={this.props.size.width <= 550 ? "100%" : this.props.size.width <= 768 ? "48%" : "30%"}
							gutterWidth={15}
							gutterHeight={10}
						>
							{dataSource && dataSource.map(item => this.process_review_item(item))}
						</StackGrid>

						<div style={{ display: "flex", justifyContent: "end", marginTop: 15 }}>
							<antd.Pagination current={this.state.page} pageSize={this.state.limit} total={count} onChange={this.on_page_change} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

ReviewComponent.propTypes = properties;

export default withSize()(ReviewComponent);