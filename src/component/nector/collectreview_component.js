/* eslint-disable no-unused-vars */
//from system
import React from "react";
import prop_types from "prop-types";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";
import security_wrapper from "../../wrapper/security_wrapper";

import * as analytics from "../../analytics";

import * as antd from "antd";

import FullPageLoader from "./common/full_page_loader";
import CollectReviewCreateForm from "../../component_form/nector/collectreview/create_form";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	businessinfos: prop_types.object.isRequired,
	websdkinfos: prop_types.object.isRequired,

	entity: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,
	order: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class CollectReviewComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,

			page: 1,
			limit: 10,
		};

		this.api_merchant_create_triggeractivities = this.api_merchant_create_triggeractivities.bind(this);
		this.api_merchant_create_uploads = this.api_merchant_create_uploads.bind(this);
		this.api_merchant_get_orders = this.api_merchant_get_orders.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		// eslint-disable-next-line no-undef
		const search_params = collection_helper.process_url_params(this.props.location.search);

		const expires_at = search_params.get("expires_at");
		if (!expires_at || (expires_at && Number(expires_at) && Date.now() < expires_at)) {
			this.api_merchant_get_orders();
		}
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	async api_merchant_create_triggeractivities(values, form, callback = null) {
		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const search_params = collection_helper.process_url_params(this.props.location.search);
		const product_id = values.reference_product_id;
		const product_source = values.reference_product_source;
		const trigger_id = search_params.get("trigger_id");
		const order_id = search_params.get("order_id");

		if (collection_helper.validate_is_null_or_undefined(product_id)
			|| collection_helper.validate_is_null_or_undefined(product_source)
			|| collection_helper.validate_is_null_or_undefined(trigger_id)
			|| collection_helper.validate_is_null_or_undefined(order_id)) return;

		const lead_id = (this.props.lead && this.props.lead._id) || (this.props.order && this.props.order.lead_id) || null;
		const customer_id = search_params.get("customer_id") || (this.props.lead && this.props.lead.customer_id) || collection_helper.process_key_join([product_source, security_wrapper.get_wrapper().process_sha256_hash(values.email)].filter(x => x), "-");

		const opts = {
			event: constant_helper.get_app_constant().API_SUCCESS_DISPATCH,
			url: url,
			endpoint: "api/v2/merchant/activities",
			append_data: false,
			has_algo: true,
			params: {},
			attributes: {
				trigger_id: trigger_id,
				customer_id: customer_id,
				trace: {
					params_for_review: {
						...collection_helper.get_lodash().omitBy(collection_helper.get_lodash().omit(values, ["email", "files"]), collection_helper.get_lodash().isNil),
						order_id: order_id,
						reference_product_id: product_id,
						reference_product_source: product_source,
					}
				},
				metadetail: {
					email: values.email
				},
				name: values.name
			}
		};

		if (collection_helper.validate_not_null_or_undefined(lead_id)) {
			opts.attributes = {
				...opts.attributes,
				lead_id: lead_id
			};
		}

		const func_process_uploads = (result) => {
			if (values.files && values.files.length > 0) {
				if (result.data
					&& result.data.review_reward
					&& result.data.review_reward.item
					&& result.data.review_reward.item._id) {

					values.files.forEach((file, index) => {
						// eslint-disable-next-line no-unused-vars
						const opts = {
							parent_type: "reviews",
							parent_id: result.data.review_reward.item._id,
							file: file.originFileObj
						};

						this.api_merchant_create_uploads(opts, form, index === values.files.length - 1);
					});
				}
			} else {
				form && form.resetFields();
			}
		};

		this.set_state({ loading: true });
		this.props.app_action.api_generic_post(opts, (result) => {
			this.set_state({ loading: false });
			if (result.data.success === true) func_process_uploads(result);

			if (collection_helper.validate_not_null_or_undefined(callback)
				&& collection_helper.validate_is_function(callback)) callback(result);
		});

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_review_create_request);
	}

	async api_merchant_create_uploads(values, form, is_last) {
		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		if (collection_helper.validate_is_null_or_undefined(values.parent_type) === true
			|| collection_helper.validate_is_null_or_undefined(values.parent_id) === true
			|| collection_helper.validate_is_null_or_undefined(values.file) === true) return;

		const opts = {
			event: constant_helper.get_app_constant().API_SUCCESS_DISPATCH,
			url: url,
			endpoint: "api/v2/merchant/uploads",
			append_data: false,
			has_algo: true,
			params: {},
			attributes: {
				parent_type: values.parent_type,
				parent_id: values.parent_id
			}
		};

		opts.headers = {
			...(opts.headers || {}),
			"content-type": "multipart/form-data",
		};

		opts.attributes = {
			...opts.attributes,
			file: values.file
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {
			if (result.meta.status === "success" && is_last === true) {
				form && form.resetFields();
			}
		});
	}

	async api_merchant_get_orders(values) {
		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const search_params = collection_helper.process_url_params(this.props.location.search);
		const order_id = search_params.get("order_id");

		if (collection_helper.validate_is_null_or_undefined(order_id) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_GET_ORDER_DISPATCH,
			url: url,
			endpoint: `api/v2/merchant/orders/${order_id}`,
			append_data: false,
			has_algo: true,
			params: {},
		};

		this.set_state({ loading: true });
		this.props.app_action.api_generic_get(opts, (result) => {
			this.set_state({ loading: false });
			if (result.meta.status === "success" && result.data && result.data.item && result.data.item.lead_id) {
				const opts = {
					event: constant_helper.get_app_constant().API_MERCHANT_GET_LEAD,
					url: url,
					endpoint: `api/v2/merchant/leads/${result.data.item.lead_id}`,
					append_data: false,
					has_algo: true,
					params: {},
				};

				this.props.app_action.api_generic_get(opts);
			}
		});
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

		const dataSource = (this.props.websdkinfos && this.props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));
		const products = (this.props.order && this.props.order.product_lines || []).filter(item => item.is_reviewed !== true).map(item => ({ ...item, key: item._id }));

		const websdk_config_arr = dataSource.filter(x => x.name === "websdk_config") || [];
		const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
		const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

		const business_name = websdk_config.business_name || this.props.entity.name || "";

		const expires_at = search_params.get("expires_at");

		if (expires_at && Number(expires_at) && Date.now() >= expires_at) {
			const business_uri = this.props.businessinfos?.kyc?.business_uri ? `${this.props.businessinfos.kyc.business_uri}?shownector=true` : null;

			return (
				<div style={{ minHeight: "100vh", padding: "1em", textAlign: "center" }} className="center">
					<antd.Typography.Text className="nector-text" style={{ color: "#555" }}>Sorry, the link has expired. We request you to please visit <a href={business_uri}>{business_name}</a> and place your review on the respective product page. Thank You!</antd.Typography.Text>
				</div>
			);
		}

		return (
			<div className="nector-collectreview-container" style={{ height: "100vh", margin: "0 auto", maxWidth: 600 }}>
				<div style={{ padding: 20 }}>
					<div><antd.Typography.Title level={3} style={{ textAlign: "center", fontWeight: "normal" }}>{business_name}</antd.Typography.Title></div>

					<antd.Divider style={{ margin: "12px 0" }} />

					<antd.Typography.Text style={{ display: "block", textAlign: "center", color: "#666" }} className="nector-subtext">Please provide your valuable review for your recent purchase from {business_name}</antd.Typography.Text>

					<div style={{ padding: "0.5em", marginTop: "1em" }}>
						{
							products.length > 0 ? (products.map((product, index) => (
								<div key={product.id || product.reference_product_id}>
									<antd.Typography.Text className="nector-subtitle" style={{ display: "block", marginBottom: "0.5em" }}>{index + 1}. {product.name}</antd.Typography.Text>

									<CollectReviewCreateForm product={product} api_merchant_create_triggeractivities={this.api_merchant_create_triggeractivities} {...this.props} />

									{(index !== products.length - 1) && <antd.Divider />}
								</div>
							))) : (<antd.Result
								status="success"
								title="Review Submit Sucessful"
								subTitle="Your review for this order has been submitted successfully. We appreciate your time!"
							/>)
						}
					</div>
				</div>
			</div>
		);
	}
}

CollectReviewComponent.propTypes = properties;

export default CollectReviewComponent;