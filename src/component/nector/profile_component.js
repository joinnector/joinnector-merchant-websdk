/* eslint-disable no-unused-vars */
//from system
import React from "react";
import ReactRipples from "react-ripples";
import prop_types from "prop-types";
import copy_to_clipboard from "copy-to-clipboard";
import * as react_material_icons from "react-icons/md";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";
import axios_wrapper from "../../wrapper/axios_wrapper";

import * as ViewForm from "../../component_form/nector/profile/view_form";

import * as antd from "antd";
import * as antd_icons from "@ant-design/icons";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	websdkinfos: prop_types.object.isRequired,

	lead: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class ProfileComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			drawer_visible: false,

			action: "view",

			loading: false,

			page: 1,
			limit: 10,
		};

		this.api_merchant_get_leads = this.api_merchant_get_leads.bind(this);
		this.api_merchant_update_metadetails = this.api_merchant_update_metadetails.bind(this);
		this.api_merchant_update_leads = this.api_merchant_update_leads.bind(this);

		this.on_couponlist = this.on_couponlist.bind(this);
		this.on_instructionlist = this.on_instructionlist.bind(this);

		this.on_couponcodecopy = this.on_couponcodecopy.bind(this);

		this.on_edit = this.on_edit.bind(this);

		this.toggle_drawer = this.toggle_drawer.bind(this);

		this.render_drawer_action = this.render_drawer_action.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {

	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	api_merchant_get_leads() {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);

		const lead_id = search_params.get("lead_id") || null;
		const customer_id = search_params.get("customer_id") || null;

		let method = null;
		if (collection_helper.validate_not_null_or_undefined(lead_id) === true) method = "get_leads";
		else if (collection_helper.validate_not_null_or_undefined(customer_id) === true) method = "get_leads_by_customer_id";


		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;
		if (collection_helper.validate_is_null_or_undefined(method) === true) return null;

		let lead_params = {};
		let lead_query = {};
		if (method === "get_leads") {
			lead_params = { id: lead_id };
		} else if (method === "get_leads_by_customer_id") {
			lead_query = { customer_id: customer_id };
		}

		let attributes = {};
		if (collection_helper.validate_not_null_or_undefined(lead_params.id) === true) {
			attributes = axios_wrapper.get_wrapper().get(lead_id, "lead");
		} else if (collection_helper.validate_not_null_or_undefined(lead_query.customer_id) === true) {
			attributes = axios_wrapper.get_wrapper().get_by("customer_id", customer_id, "lead");
		}

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_GET_LEAD,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			attributes: {
				...attributes
			}
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {

		});
	}

	api_merchant_update_leads(values) {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_UPDATE_LEAD_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				...axios_wrapper.get_wrapper().save(values._id, {
					...collection_helper.process_nullify(collection_helper.get_lodash().omitBy(collection_helper.get_lodash().pick(values, ["country", "name"]), collection_helper.get_lodash().isNil)),
				}, "lead")
			}
		};

		if (Object.keys(opts.attributes.attributes).length < 1) return null;

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_put(opts, (result) => {

		});
	}

	api_merchant_update_metadetails(values) {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_UPDATE_METADETAIL_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				...axios_wrapper.get_wrapper().save(values._id, {
					...collection_helper.process_nullify(collection_helper.get_lodash().omitBy(collection_helper.get_lodash().omit(values, ["_id", "mobile_code", "mobile", "email"]), collection_helper.get_lodash().isNil)),
				}, "metadetail")
			}
		};

		if (values.mobile_code && values.mobile) {
			opts.attributes = {
				...opts.attributes,
				attributes: {
					...opts.attributes.attributes,
					mobile: {
						mobile_code: values.mobile_code,
						mobile: values.mobile,
					}
				}
			};
		}

		if (values.email) {
			opts.attributes = {
				...opts.attributes,
				attributes: {
					...opts.attributes.attributes,
					email: values.email
				}
			};
		}

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_put(opts, (result) => {
			this.api_merchant_get_leads();
		});
	}

	on_edit() {
		this.set_state({ action: "view" });
		this.toggle_drawer();
	}

	on_couponlist() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/coupon-list?${search_params.toString()}`);
	}

	on_instructionlist() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/instruction-list?${search_params.toString()}`);
	}

	on_couponcodecopy(code) {
		collection_helper.show_message("Code copied");
		copy_to_clipboard(code);
	}

	toggle_drawer() {
		// eslint-disable-next-line no-unused-vars
		this.setState((state, props) => ({
			drawer_visible: !state.drawer_visible
		}));
	}

	render_drawer_action() {
		if (this.state.action === "view") {
			return <ViewForm.MobileRenderEditProfileItem {...this.props} drawer_visible={this.state.drawer_visible} api_merchant_update_metadetails={this.api_merchant_update_metadetails} api_merchant_update_leads={this.api_merchant_update_leads} toggle_drawer={this.toggle_drawer} />;
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

		const safe_lead = this.props.lead || {};
		const safe_metadetail = safe_lead.metadetail || {};

		const dataSource = (this.props.websdkinfos && this.props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));

		const websdk_config = dataSource.filter(x => x.name === "websdk_config") || [];
		const websdk_config_options = websdk_config.length > 0 ? websdk_config[0].value : {};

		const has_user = (safe_lead._id) || false;
		const safe_name = (safe_lead.name) || "There";

		return (
			<div style={{ height: "inherit", display: "flex", flexDirection: "column" }}>
				<div>
					<antd.Card className="nector-card" style={{ padding: 0, minHeight: "10%", borderBottom: "1px solid #eeeeee00" }} bordered={false}>
						<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
							<div style={{ display: "flex" }} onClick={() => this.props.history.goBack()}>
								<h2><react_material_icons.MdKeyboardBackspace className="nector-icon" style={{ background: "#eee", color: "#000", borderRadius: 10 }}></react_material_icons.MdKeyboardBackspace></h2>
							</div>
						</antd.PageHeader>

						<h3> Hey <b>{collection_helper.get_lodash().capitalize(safe_lead.name || "There")} 👋 </b> from <b> {collection_helper.get_lodash().capitalize(safe_lead.country || "Ind")} 🏳️‍🌈 </b>,You are on <b> {collection_helper.get_lodash().capitalize(safe_lead.badge || "Bronze")} </b> level </h3>
						<h4> Improve your rewarding level ✨ by redeeming more deals or buying exciting products 🎁</h4>
					</antd.Card>

					{
						safe_lead.referral_code ? (
							<antd.Card className="nector-card" style={{ padding: 0, minHeight: "10%", borderBottom: "1px solid #eeeeee00" }} bordered={false}>
								<h3> You Referral Code is: </h3>
								<antd.Space>
									<div className="wallet-point-design" style={{ fontSize: "1.5em", }}>
										{safe_lead.referral_code}
									</div>
									<react_material_icons.MdContentCopy onClick={() => this.on_couponcodecopy(safe_lead.referral_code)} style={{ color: "#000", fontSize: "1.5em", cursor: "pointer" }} />
								</antd.Space>
							</antd.Card>
						) : <div></div>
					}

					{
						has_user ? (
							<div>
								<antd.Card className="nector-card" style={{ padding: 0, minHeight: "10%", borderBottom: "1px solid #eeeeee00" }} bordered={false}>
									<div className="nector-profile-row-top" style={{ cursor: "pointer", display: "flex" }} onClick={this.on_edit}>
										<div style={{ flex: 1 }}>
											Edit Your Profile
										</div>
										<div>
											<react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ color: "black" }} />
										</div>
									</div>
									<div className="nector-profile-row" style={{ cursor: "pointer", display: "flex" }} onClick={this.on_couponlist}>
										<div style={{ flex: 1 }}>
											Your Scratch Cards
										</div>
										<div>
											<react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ color: "black" }} />
										</div>
									</div>
									<div className="nector-profile-row" style={{ cursor: "pointer", display: "flex" }} onClick={this.on_instructionlist}>
										<div style={{ flex: 1 }}>
											Ways To Earn Rewards
										</div>
										<div>
											<react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ color: "black" }} />
										</div>
									</div>
								</antd.Card>

							</div>
						) : <div></div>
					}
				</div>
				<antd.Drawer placement="bottom" onClose={this.toggle_drawer} visible={this.state.drawer_visible} closable={false}>
					{this.render_drawer_action()}
				</antd.Drawer>
			</div>
		);
	}
}

ProfileComponent.propTypes = properties;

export default ProfileComponent;