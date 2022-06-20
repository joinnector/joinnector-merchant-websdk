/* eslint-disable no-unused-vars */
//from system
import React from "react";
import prop_types from "prop-types";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";
import axios_wrapper from "../../wrapper/axios_wrapper";
// import * as analytics from "../../analytics";

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
			loading: true,

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

	async api_merchant_create_triggeractivities(values, form) {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);

		const trigger_id = search_params.get("trigger_id");
		const lead_id = this.props.lead._id;

		if (collection_helper.validate_is_null_or_undefined(values.reference_product_id) || collection_helper.validate_is_null_or_undefined(values.reference_product_source) || collection_helper.validate_is_null_or_undefined(trigger_id) === true) return;

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
					trace: {
						params_for_review: {
							...collection_helper.get_lodash().omitBy(collection_helper.get_lodash().omit(values, ["email", "files"]), collection_helper.get_lodash().isNil)
						}
					},
					name: values.name
				}, "triggeractivity", "create", { use_apikeyhash: true })
			}
		};

		if (collection_helper.validate_not_null_or_undefined(lead_id) === true) {
			reviewopts.attributes.attributes.lead_id = lead_id;
		}

		if (collection_helper.validate_is_null_or_undefined(lead_id) === true) {
			reviewopts.attributes.attributes.metadetail = {
				email: values.email
			};
		}

		await this.props.app_action.api_generic_post(reviewopts, (result) => {
			if (result.data.success === true) {
				if (values.files && values.files.length > 0) {
					if (result.data && result.data.review_reward && result.data.review_reward.item && result.data.review_reward.item._id) {
						values.files.forEach((file, index) => {
							// eslint-disable-next-line no-unused-vars
							const opts = {
								parent_type: "reviews",
								parent_id: result.data.review_reward.item._id,
								file: file.originFileObj
							};

							this.api_merchant_create_uploads(opts, form, index === values.files.length - 1);
						});
					} else {
						// not uploading images because review id not there
						collection_helper.show_message("Failed to upload images", "error");
					}
				} else {
					form && form.resetFields();
					collection_helper.show_message("Review submitted successfully");
				}
			}
		});
	}

	async api_merchant_create_uploads(values, form, is_last) {
		if (!values.parent_type || !values.parent_id || !values.file) return;

		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		const uploadopts = {
			event: constant_helper.get_app_constant().API_SUCCESS_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				...axios_wrapper.get_wrapper().create({
					parent_type: values.parent_type,
					parent_id: values.parent_id
				}, "upload", "create", { use_apikeyhash: true }),
			}
		};

		uploadopts.attributes.headers = {
			...uploadopts.attributes.headers,
			"content-type": "multipart/form-data",
		};

		uploadopts.attributes.attributes = {
			...uploadopts.attributes.attributes,
			file: values.file
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(uploadopts, (result) => {
			if (result.meta.status === "success" && is_last === true) {
				form && form.resetFields();
				collection_helper.show_message("Review submitted successfully");
			}
		});
	}

	async api_merchant_get_orders(values) {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);

		const order_id = search_params.get("order_id");

		if (!order_id) return;
		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_GET_ORDER_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			attributes: {
				...axios_wrapper.get_wrapper().get(order_id, "order", "get", { use_apikeyhash: true })
			}
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {
			this.setState({ loading: false });
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
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);
		const wallets = this.props.lead.wallets || this.props.lead.devwallets || [];

		const dataSource = (this.props.websdkinfos && this.props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));
		const products = (this.props.order && this.props.order.product_lines || []).map(item => ({ ...item, key: item._id }));

		const websdk_config_arr = dataSource.filter(x => x.name === "websdk_config") || [];
		const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
		const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

		const business_name = websdk_config.business_name || this.props.entity.name || "";

		const has_user = (this.props.lead && this.props.lead._id) || false;

		const safe_lead = this.props.lead || {};
		const safe_name = (this.props.lead && this.props.lead.name) || "There";

		const expires_at = search_params.get("expires_at");

		if (expires_at && Number(expires_at) && Date.now() >= expires_at) {
			const business_uri = this.props.businessinfos?.kyc?.business_uri ? `${this.props.businessinfos.kyc.business_uri}?shownector=true` : null;

			return (
				<div style={{ minHeight: "100vh", padding: "1em", textAlign: "center" }} className="center">
					<antd.Typography.Text className="nector-text" style={{ color: "#555" }}>Sorry, the link has expired. We request you to please visit <a href={business_uri}>{business_name}</a> and place your review on the respective product page. Thank You!</antd.Typography.Text>
				</div>
			);
		}

		if (this.state.loading === true) {
			return <FullPageLoader />;
		}

		return (
			<div className="collectreview-container" style={{ height: "inherit", display: "flex", flexDirection: "column", maxWidth: 600, border: "1px solid #eee" }}>
				<div style={{ padding: "1em" }}>
					<div><antd.Typography.Title level={3} style={{ textAlign: "center", fontWeight: "normal" }}>{business_name}</antd.Typography.Title></div>

					<antd.Divider style={{ margin: "12px 0" }} />

					<antd.Typography.Text style={{ display: "block", textAlign: "center", color: "#666" }} className="nector-text">Please provide your valuble review on the products of your recent order on {business_name}</antd.Typography.Text>

					<div style={{ padding: "0.5em", marginTop: "1em" }}>
						{(products && products.length > 0) && (products.map((product, index) => (
							<div key={product.id || product.reference_product_id}>
								<antd.Typography.Text className="nector-subtitle" style={{ display: "block", marginBottom: "0.5em" }}>{index + 1}. {product.name}</antd.Typography.Text>

								<CollectReviewCreateForm product={product} api_merchant_create_triggeractivities={this.api_merchant_create_triggeractivities} {...this.props} />

								{(index !== products.length - 1) && <antd.Divider />}
							</div>
						)))}
					</div>

					<div style={{ marginTop: "1em", textAlign: "center" }}>
						<antd.Typography.Text style={{ color: "#666" }} className="nector-text">Powered By <a href="https://nector.io" target="_blank" style={{ color: "#555" }} rel="noreferrer">Nector</a></antd.Typography.Text>
					</div>
				</div>
			</div >
		);
	}
}

CollectReviewComponent.propTypes = properties;

export default CollectReviewComponent;