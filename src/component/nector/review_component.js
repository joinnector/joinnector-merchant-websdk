/* eslint-disable no-unused-vars */
//from system
import React from "react";
import prop_types from "prop-types";

import * as react_material_icons from "react-icons/md";
import * as react_fa_icons from "react-icons/fa";
import StackGrid from "react-stack-grid";
import { withSize } from "react-sizeme";

import ReviewCreateForm from "../../component_form/nector/review/create_form";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";
import security_wrapper from "../../wrapper/security_wrapper";

import * as analytics from "../../analytics";

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

			parent_url: null,

			review_form_active_key: null
		};

		this.api_merchant_create_triggeractivities = this.api_merchant_create_triggeractivities.bind(this);
		this.api_merchant_list_reviews = this.api_merchant_list_reviews.bind(this);

		this.process_review_item = this.process_review_item.bind(this);
		this.toggle_review_form = this.toggle_review_form.bind(this);
		this.on_page_change = this.on_page_change.bind(this);
		this.on_sort_change = this.on_sort_change.bind(this);

		this.handle_window_message = this.handle_window_message.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		// eslint-disable-next-line no-undef
		this.api_merchant_list_reviews({ page: this.state.page, limit: this.state.limit });

		window.addEventListener("message", this.handle_window_message);
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	// unmount
	componentWillUnmount() {

		window.removeEventListener("message", this.handle_window_message);
	}

	async api_merchant_create_triggeractivities(values, form) {
		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);
		const product_id = search_params.get("reference_product_id") || search_params.get("product_id");
		const trigger_id = search_params.get("trigger_id");
		const product_source = default_search_params.identifier;

		if (collection_helper.validate_is_null_or_undefined(product_id)
			|| collection_helper.validate_is_null_or_undefined(product_source)
			|| collection_helper.validate_is_null_or_undefined(trigger_id) === true) return;

		const customer_id = collection_helper.process_key_join([product_source, security_wrapper.get_wrapper().process_sha256_hash(values.email)].filter(x => x), "-");

		const opts = {
			event: constant_helper.get_app_constant().API_SUCCESS_DISPATCH,
			url: url,
			endpoint: "api/v2/merchant/activities",
			append_data: false,
			params: {},
			attributes: {
				trigger_id: trigger_id,
				customer_id: customer_id,
				trace: {
					params_for_review: {
						reference_product_id: product_id,
						reference_product_source: product_source,
						...collection_helper.get_lodash().omitBy(collection_helper.get_lodash().omit(values, ["email", "files"]), collection_helper.get_lodash().isNil)
					}
				},
				metadetail: {
					email: values.email
				},
				name: values.name
			}
		};

		this.set_state({ loading: true });
		this.props.app_action.api_generic_post(opts, (result) => {
			this.set_state({ loading: false });
			if (result.data.success === true) {
				if (values.files && values.files.length > 0) {
					if (result.data && result.data.review_reward && result.data.review_reward.item && result.data.review_reward.item._id) {
						values.files.forEach((file, index) => {
							const opts = {
								event: constant_helper.get_app_constant().API_SUCCESS_DISPATCH,
								url: url,
								endpoint: "api/v2/merchant/uploads",
								append_data: false,
								params: {},
								attributes: {
									parent_type: "reviews",
									parent_id: result.data.review_reward.item._id
								}
							};

							opts.headers = {
								...(opts.headers || {}),
								"content-type": "multipart/form-data",
							};

							opts.attributes = {
								...opts.attributes,
								file: file.originFileObj
							};

							// eslint-disable-next-line no-unused-vars
							this.props.app_action.api_generic_post(opts, (result) => {
								if (result.meta.status === "success" && index === values.files.length - 1) {
									this.toggle_review_form();
									form && form.resetFields();
								}
							});
						});
					} else {
						collection_helper.show_message("Failed to upload images", "error");
					}
				} else {
					this.toggle_review_form();
					form && form.resetFields();
				}
			}
		});

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_review_create_request);
	}

	api_merchant_list_reviews(values = {}) {
		this.set_state({ page: values.page || 1, limit: values.limit || 6 });

		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);

		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_REVIEW_DISPATCH,
			url: url,
			endpoint: "api/v2/merchant/reviews",
			append_data: values.append_data || false,
			params: {
				page: values.page || 1,
				limit: values.limit || 6,
				sort: values.sort || "created_at",
				sort_op: values.sort_op || "DESC",
			},
		};

		// apply product id
		if (collection_helper.validate_not_null_or_undefined(search_params.get("reference_product_id"))) opts.params.reference_product_id = search_params.get("reference_product_id");
		else if (collection_helper.validate_not_null_or_undefined(search_params.get("product_id"))) opts.params.reference_product_id = search_params.get("product_id");

		// apply source
		if (collection_helper.validate_not_null_or_undefined(default_search_params.identifier)) opts.params.reference_product_source = default_search_params.identifier;

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_get(opts, (result) => {
			this.set_state({ loading: false });
		});
	}

	process_review_item(record) {
		const user_name = record.name;

		return (
			<antd.Card key={record.key} bodyStyle={{ padding: 15, backgroundColor: "rgb(251, 251, 251)" }}>
				<div style={{ display: "flex" }}>
					<div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
						<antd.Typography.Text className="nector-truncate-text nector-subtitle" style={{ display: "block" }}>{user_name}</antd.Typography.Text>
						<div style={{ display: "flex", alignItems: "center" }}>
							<antd.Rate className="nector-text" disabled value={record.rating} style={{}} />
						</div>
					</div>
				</div>

				<div style={{ marginTop: 10 }}>
					<h3 className="nector-truncate-text">{record.title}</h3>
					<antd.Typography.Text className="nector-truncate-text nector-subtext" style={{ display: "block", whiteSpace: "normal" }}>{record.description}</antd.Typography.Text>
				</div>

				{(record.uploads && record.uploads.length > 0) && <div style={{ marginTop: 10 }}>
					<antd.Space wrap={true}>
						{record.uploads.map((upload, index) => (
							<antd.Image key={upload._id} height={75} width={75} style={{ padding: 5, border: "1px solid #ddd", cursor: "pointer", objectFit: "contain", borderRadius: 3, backgroundColor: "white" }} src={upload.link} preview={{ mask: false }} />
						))}
					</antd.Space>
				</div>}

				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 10, borderTop: "1px solid #ddd" }}>
					{(this.state.parent_url) ? <div style={{ display: "flex" }}>
						<react_fa_icons.FaFacebook className="nector-subtext" title="Facebook" style={{ cursor: "pointer" }} onClick={() => this.on_review_sharefacebook(record.description, this.state.parent_url)} />
						<react_fa_icons.FaTwitter className="nector-subtext" title="Twitter" style={{ cursor: "pointer", marginLeft: 10 }} onClick={() => this.on_review_sharetwitter(record.description, this.state.parent_url)} />
					</div> : <div></div>}

					<div style={{ display: "flex", justifyContent: "flex-end" }}>
						<antd.Typography.Text className="nector-subtext" style={{ color: "#666" }}>{collection_helper.get_moment()(record.created_at).format("LL")}</antd.Typography.Text>
					</div>
				</div>


			</antd.Card>
		);
	}

	on_review_sharefacebook(description, parentUrl) {
		window.open(`https://www.facebook.com/dialog/share?app_id=${5138626756219227}&display=popup&href=${encodeURIComponent(parentUrl)}&quote=${encodeURIComponent(`Hey everyone. Checkout this product. Review: ${description}`)}`, "_blank", "popup=yes,left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0");
	}

	on_review_sharetwitter(description, parentUrl) {
		window.open(`http://twitter.com/share?url=${encodeURIComponent(parentUrl)}&text=${encodeURIComponent(`Hey everyone. Checkout this product. Review: ${description}`)}`, "_blank", "popup=yes,left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0");
	}

	on_sort_change(value) {
		this.api_merchant_list_reviews({ page: this.state.page, limit: this.state.limit, sort: value, sort_op: "DESC" });
	}

	on_page_change(page, pageSize) {
		this.api_merchant_list_reviews({ page, limit: this.state.limit, sort: this.state.sort, sort_op: this.state.sort_op });
	}

	toggle_review_form() {
		this.set_state({
			review_form_active_key: this.state.review_form_active_key ? null : "review_form"
		});

		// eslint-disable-next-line no-undef
		const nectorreviewformcontainer = document.getElementById("nector-review-form-container");
		if (nectorreviewformcontainer && !this.state.review_form_active_key) {
			const ele_rect = nectorreviewformcontainer.getBoundingClientRect();
			// eslint-disable-next-line no-undef
			const window_height = window.innerHeight;

			if (ele_rect.y + 50 > window_height) {
				nectorreviewformcontainer.scrollIntoView({
					behavior: "smooth",
					block: "center"
				});
			}
		}
	}

	handle_window_message(event) {
		try {
			const data = event.data;
			if (typeof data === "object") {
				const event_type = data.event;
				const event_payload = data.payload;

				if (event_type && event_type === constant_helper.get_app_constant().WINDOW_MESSAGE_EVENTS.PARENT_URL && event_payload && event_payload.value && !this.state.parent_url) {
					this.set_state({ parent_url: event_payload.value });
				}
			}
		} catch (error) {
			// nothing
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
					<antd.Collapse.Panel id="nector-review-form-container" className="nector-hide-collapse-panel" key="review_form" showArrow={false} style={{ cursor: "unset" }} forceRender={true}>
						<div id="review_form">
							<antd.Divider />

							<antd.Typography.Title level={5}>Write A Review</antd.Typography.Title>

							<ReviewCreateForm submitting={this.state.loading} api_merchant_create_triggeractivities={this.api_merchant_create_triggeractivities} />
						</div>
					</antd.Collapse.Panel>
				</antd.Collapse>

				<antd.Divider />

				<div style={{ display: "flex", justifyContent: "end", marginTop: 20, marginBottom: 20 }}>
					<antd.Pagination
						showSizeChanger={false}
						current={this.state.page}
						pageSize={this.state.limit}
						total={count}
						size="small"
						onChange={this.on_page_change}
					/>
				</div>

				<StackGrid
					columnWidth={this.props.size.width <= 550 ? "100%" : this.props.size.width <= 768 ? "48%" : "30%"}
					gutterWidth={15}
					gutterHeight={10}>
					{dataSource && dataSource.map(item => this.process_review_item(item))}
				</StackGrid>
			</div>
		);
	}
}

ReviewComponent.propTypes = properties;

export default withSize()(ReviewComponent);