/* eslint-disable no-unused-vars */
//from system
import React from "react";
import ReactLinkify from "react-linkify";
import prop_types from "prop-types";
import ReactQrCode from "react-qr-code";
import copy_to_clipboard from "copy-to-clipboard";
// import random_gradient from "random-gradient";
import * as react_material_icons from "react-icons/md";
import * as react_game_icons from "react-icons/gi";
import StackGrid from "react-stack-grid";
import { withSize } from "react-sizeme";

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
			limit: 10,
			sort: "created_at",
			sort_op: "DESC",

			review_submitting: false,
			review_form_active_key: null
		};

		this.api_merchant_create_reviews = this.api_merchant_create_reviews.bind(this);
		this.api_merchant_update_reviews = this.api_merchant_update_reviews.bind(this);
		this.api_merchant_list_reviews = this.api_merchant_list_reviews.bind(this);
		this.api_merchant_get_reviews = this.api_merchant_get_reviews.bind(this);

		this.process_review_item = this.process_review_item.bind(this);
		this.toggle_review_form = this.toggle_review_form.bind(this);
		this.on_page_change = this.on_page_change.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		// const params = collection_helper.process_url_params(this.props.location.search);
		// const default_search_params = collection_helper.get_default_params(this.props.location.search);

		// const lead_id = params.get("lead_id") || null;
		// const customer_id = params.get("customer_id") && default_search_params.get("identifier") 
		// 	? collection_helper.process_key_join([default_search_params.identifier, params.get("customer_id")], "-")
		// 	: params.get("customer_id") 
		// 		? params.get("customer_id")
		// 		: null;
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
		const params = collection_helper.process_url_params(this.props.location.search);
		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		const lead_id = params.get("lead_id") || null;
		const customer_id = params.get("customer_id") && default_search_params.get("identifier") 
			? collection_helper.process_key_join([default_search_params.identifier, params.get("customer_id")], "-")
			: params.get("customer_id") 
				? params.get("customer_id")
				: null;

		const payload = {
			...collection_helper.get_lodash().omitBy(values, collection_helper.get_lodash().isNil)
		};

		if(collection_helper.validate_not_null_or_undefined(lead_id)) payload.lead_id = lead_id;
		else if(collection_helper.validate_not_null_or_undefined(customer_id)) payload.customer_id = customer_id;

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
		});
	}

	api_merchant_update_reviews(values) {
		const params = collection_helper.process_url_params(this.props.location.search);
		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		const lead_id = params.get("lead_id") || null;
		const customer_id = params.get("customer_id") && default_search_params.get("identifier") 
			? collection_helper.process_key_join([default_search_params.identifier, params.get("customer_id")], "-")
			: params.get("customer_id") 
				? params.get("customer_id")
				: null;

		const payload = {
			...collection_helper.get_lodash().omitBy(values, collection_helper.get_lodash().isNil)
		};

		if(collection_helper.validate_not_null_or_undefined(lead_id)) payload.lead_id = lead_id;
		else if(collection_helper.validate_not_null_or_undefined(customer_id)) payload.customer_id = customer_id;

		// try fetching the deal
		const dealopts = {
			event: constant_helper.get_app_constant().API_SUCCESS_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				...axios_wrapper.get_wrapper().save({
					...payload
				}, "review")
			}
		};

		this.set_state({ review_submitting: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(dealopts, (result) => {
			this.set_state({ review_submitting: false });
		});
	}

	api_merchant_list_reviews(values = {}) {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);

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
					limit: values.limit || 10,
					sort: values.sort || "created_at",
					sort_op: values.sort_op || "DESC",
					...collection_helper.get_lodash().omit(values, ["page", "limit", "sort", "sort_op"])
				}, "review")
			},
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(reviewopts, (result) => {});
	}

	api_merchant_get_reviews() {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);

		if (collection_helper.validate_is_null_or_undefined(search_params.get("coupon_id")) === true) return null;

		// try fetching th coupon
		const couponopts = {
			event: constant_helper.get_app_constant().API_MERCHANT_VIEW_COUPON_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				...axios_wrapper.get_wrapper().get(search_params.get("coupon_id"), "coupon")
			},
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(couponopts, (result) => {
			this.set_state({ loading: false });
		});
	}

	process_review_item(record) {
		return (
			<antd.Card bodyStyle={{ padding: 15 }}>
				<div style={{ display: "flex" }}>
					<div style={{ width: "75px", height: "75px", borderRadius: "50%", fontSize: "20px", backgroundColor: "#eee" }} className="center-all">S</div>

					<div style={{ marginLeft: 15, display: "flex", flexDirection: "column" }}>
						<antd.Typography.Text style={{ display: "block" }}>Yashas Reddy</antd.Typography.Text>
						<antd.Rate disabled defaultValue={5} style={{ fontSize: "1rem" }} />
						<antd.Typography.Text style={{ fontWeight: "bold", fontSize: "0.7rem" }}>February 14, 2022</antd.Typography.Text>
					</div>
				</div>

				<div style={{ marginTop: 15 }}>
					<h3>It is great!</h3>
					<antd.Typography.Text style={{ fontSize: "0.8rem" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</antd.Typography.Text>
				</div>

				<div style={{ display: "flex", marginTop: 15 }}>
					<span><react_material_icons.MdOutlineThumbUpAlt style={{ fontSize: "18px", cursor: "pointer" }} /> <span style={{ fontSize: "0.9rem" }}>10</span></span>
					<span style={{ display: "inline-block", marginLeft: 15 }}><react_material_icons.MdOutlineThumbDownAlt style={{ fontSize: "18px", cursor: "pointer" }} /> <span style={{ fontSize: "0.9rem" }}>15</span></span>
				</div>
			</antd.Card>
		);
	}

	on_page_change(page, pageSize) {
		this.setState({ page, limit: pageSize });
		this.api_merchant_list_reviews({ page, limit: pageSize });
	}

	toggle_review_form() {
		this.setState({
			review_form_active_key: this.state.review_form_active_key ? null : "review_form"
		});

		// eslint-disable-next-line no-undef
		const review_form_container = document.getElementById("review_form_container");
		if(review_form_container && !this.state.review_form_active_key) {
			const ele_rect = review_form_container.getBoundingClientRect();
			// eslint-disable-next-line no-undef
			const window_height = window.innerHeight;

			if(ele_rect.y + 50 > window_height) {
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
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		
		return (
			<div style={{ padding: 20 }}>
				<antd.Typography.Title level={3} style={{ display: "block" }}>Customer Reviews</antd.Typography.Title>

				<antd.Divider />

				<antd.Row>
					<antd.Col xs={24} sm={7} md={6} lg={4}>
						<antd.Rate disabled defaultValue={2} />
						<p>Based on 18 Reviews</p>
					</antd.Col>

					<antd.Col xs={24} sm={17} md={12} lg={12}>
						<div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
							<antd.Rate disabled style={{ flex: "1 0 auto", marginRight: 15 }} defaultValue={5} />
							<antd.Progress percent={25} />
						</div>

						<div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
							<antd.Rate disabled style={{ flex: "1 0 auto", marginRight: 15 }} defaultValue={4} />
							<antd.Progress percent={40} />
						</div>

						<div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
							<antd.Rate disabled style={{ flex: "1 0 auto", marginRight: 15 }} defaultValue={3} />
							<antd.Progress percent={15} />
						</div>

						<div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
							<antd.Rate disabled style={{ flex: "1 0 auto", marginRight: 15 }} defaultValue={2} />
							<antd.Progress percent={15} />
						</div>

						<div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
							<antd.Rate disabled style={{ flex: "1 0 auto", marginRight: 15 }} defaultValue={1} />
							<antd.Progress percent={10} />
						</div>
					</antd.Col>

					<antd.Col xs={24} sm={24} md={6} lg={8} style={{ display: "flex", justifyContent: "end" }}>
						<antd.Button onClick={this.toggle_review_form}>Write A Review</antd.Button>
					</antd.Col>
				</antd.Row>

				<antd.Collapse ghost activeKey={this.state.review_form_active_key}>
					<antd.Collapse.Panel id="review_form_container" className="hide_collapse_panel" key="review_form" showArrow={false} style={{ cursor: "unset" }} forceRender={true}>
						<div id="review_form">
							<antd.Divider />

							<antd.Typography.Title level={5}>Write A Review</antd.Typography.Title>

							<antd.Form onFinish={this.api_merchant_create_reviews}>
								{/* Name and email only for guest users maybe */}
								<antd.Form.Item name="name" label="Name" labelCol={{ span: 24 }} wrapperCol={{ xs: { span: 24 }, sm: { span: 24 }, md: { span: 16 } }} rules={[{ required: true, message: "Please enter your name" }]} hasFeedback>
									<antd.Input placeholder="Enter your name" />
								</antd.Form.Item>

								<antd.Form.Item name="email" label="Email" labelCol={{ span: 24 }} wrapperCol={{ xs: { span: 24 }, sm: { span: 24 }, md: { span: 16 } }} rules={[{ required: true, message: "Please enter your email" }, { type: "email", message: "Please enter a valid email address" }]} shouldUpdate hasFeedback>
									<antd.Input placeholder="Enter your email address" />
								</antd.Form.Item>

								<antd.Form.Item name="rating" label="Your Rating" labelCol={{ span: 24 }} wrapperCol={{ xs: { span: 24 }, sm: { span: 24 }, md: { span: 16 } }} rules={[{ required: true, message: "Please select a rating" }]} shouldUpdate hasFeedback>
									<antd.Rate allowHalf />
								</antd.Form.Item>

								<antd.Form.Item name="title" label="Review Title" labelCol={{ span: 24 }} wrapperCol={{ xs: { span: 24 }, sm: { span: 24 }, md: { span: 16 } }} rules={[{ required: true, message: "Please enter the review title" }]} hasFeedback>
									<antd.Input placeholder="Enter the review title" />
								</antd.Form.Item>

								<antd.Form.Item name="body" label="Review Body" labelCol={{ span: 24 }} wrapperCol={{ xs: { span: 24 }, sm: { span: 24 }, md: { span: 16 } }} rules={[{ required: true, message: "Please enter the review body" }]} hasFeedback>
									<antd.Input.TextArea placeholder="Enter the review body" />
								</antd.Form.Item>

								<antd.Button type="default" htmlType="submit">
									Submit
								</antd.Button>
							</antd.Form>
						</div>
					</antd.Collapse.Panel>
				</antd.Collapse>

				<antd.Divider />

				<div>
					<antd.Typography.Text style={{ display: "block", fontWeight: "bold", textDecoration: "underline", paddingBottom: 10 }}>Reviews</antd.Typography.Text>

					<div style={{ marginTop: 12 }}>
						<StackGrid
							columnWidth={this.props.size.width <= 550 ? "100%" : this.props.size.width <= 768 ? "48%" : "30%"}
							gutterWidth={15}
							gutterHeight={10}
						>
							{this.process_review_item()}	
							{this.process_review_item()}	
							{this.process_review_item()}	
						</StackGrid>

						<div style={{ display: "flex", justifyContent: "end", marginTop: 15 }}>
							<antd.Pagination current={this.state.page} pageSize={this.state.limit} total={50} onChange={this.on_page_change} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

ReviewComponent.propTypes = properties;

export default withSize()(ReviewComponent);