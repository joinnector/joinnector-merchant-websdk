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

			show_referral_code_modal: false,
			referral_code: ""
		};

		this.api_merchant_get_leads = this.api_merchant_get_leads.bind(this);
		this.api_merchant_update_metadetails = this.api_merchant_update_metadetails.bind(this);
		this.api_merchant_update_leads = this.api_merchant_update_leads.bind(this);

		this.on_wallettransactionlist = this.on_wallettransactionlist.bind(this);
		this.on_couponlist = this.on_couponlist.bind(this);
		this.on_instructionlist = this.on_instructionlist.bind(this);

		this.on_couponcodecopy = this.on_couponcodecopy.bind(this);

		this.on_edit = this.on_edit.bind(this);
		this.on_submit_referralcode = this.on_submit_referralcode.bind(this);

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
					...collection_helper.process_nullify(collection_helper.get_lodash().omitBy(collection_helper.get_lodash().pick(values, ["name"]), collection_helper.get_lodash().isNil)),
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

	api_merchant_update_leadsreferredbyreferralcode(values) {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_SUCCESS_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				...axios_wrapper.get_wrapper().save(values._id, {
					...collection_helper.process_nullify(collection_helper.get_lodash().omitBy(collection_helper.get_lodash().pick(values, ["referred_by_referral_code"]), collection_helper.get_lodash().isNil)),
				}, "leadreferredbyreferralcode")
			}
		};

		if (Object.keys(opts.attributes.attributes).length < 1) return null;

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_put(opts, (result) => {
			if(result.meta.status === "success") {
				this.setState({ show_referral_code_modal: false, referral_code: null });
				this.api_merchant_get_leads();
			} else {
				collection_helper.show_message("Invalid Referral Code", "error");
			}
		});
	}

	on_edit() {
		this.set_state({ action: "view" });
		this.toggle_drawer();
	}

	on_wallettransactionlist() {
		const wallets = this.props.lead.wallets || this.props.lead.devwallets || [];
		if (wallets.length > 0) {
			const opts = {
				event: constant_helper.get_app_constant().INTERNAL_DISPATCH,
				append_data: false,
				attributes: {
					key: "wallet",
					value: {
						...wallets[0]
					}
				}
			};

			// eslint-disable-next-line no-unused-vars
			this.props.app_action.internal_generic_dispatch(opts, (result) => {
				const search_params = collection_helper.process_url_params(this.props.location.search);
				search_params.set("wallet_id", wallets[0]._id);
				this.props.history.push(`/nector/wallettransaction-list?${search_params.toString()}`);
			});
		} else {
			collection_helper.show_message("Unable to fetch wallet", "error");
		}
	}

	on_couponlist() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/coupon-list?${search_params.toString()}`);
	}

	on_instructionlist(type) {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/${type}-list?${search_params.toString()}`);
	}

	on_couponcodecopy(code) {
		collection_helper.show_message("Code copied");
		copy_to_clipboard(code);
	}

	on_submit_referralcode() {
		if(this.state.referral_code) {
			this.api_merchant_update_leadsreferredbyreferralcode({ _id: this.props.lead?._id, referred_by_referral_code: this.state.referral_code });
		}
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
		const wallets = this.props.lead.wallets || this.props.lead.devwallets || [];

		const safe_lead = this.props.lead || {};
		const safe_metadetail = safe_lead.metadetail || {};

		const dataSource = (this.props.websdkinfos && this.props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));

		const websdk_config = dataSource.filter(x => x.name === "websdk_config") || [];
		const websdk_config_options = websdk_config.length > 0 ? websdk_config[0].value : {};

		const picked_wallet = wallets.length > 0 ? wallets[0] : {
			available: "0",
			reserve: "0",
		};

		const has_user = (safe_lead._id) || false;
		const has_wallet = (wallets.length > 0 && (websdk_config_options.disable_wallet || false) !== true) || false;
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

						{
							(has_user && has_wallet) && (<div style={{ marginBottom: 20 }} onClick={this.on_wallettransactionlist}>
								<antd.Typography.Paragraph style={{ fontSize: "1em", marginBottom: 2, display: "block" }}>Your Coins</antd.Typography.Paragraph>
								<div style={{ display: "flex", flex: 1, alignItems: "center" }}>
									<div style={{ marginRight: 10 }}>
										<antd.Typography.Text style={{ fontSize: "2em", fontWeight: 600, }}>{collection_helper.get_safe_amount(picked_wallet.available)}</antd.Typography.Text>
									</div>
									<react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ color: "black" }} />
								</div>
							</div>)
						}

						<h3> Hello <b>{collection_helper.get_lodash().capitalize(safe_lead.name || "There")} 👋 </b> from <b> {collection_helper.get_lodash().capitalize(safe_metadetail.country || "earth")} 🏳️‍🌈 </b>,You are on <b> {collection_helper.get_lodash().capitalize(safe_lead.badge || "Bronze")} </b> level </h3>
						<h4> Improve your rewarding level ✨ by redeeming more deals or buying exciting products 🎁</h4>
					</antd.Card>

					{
						safe_lead.referral_code ? (
							<antd.Card className="nector-card" style={{ padding: 0, minHeight: "10%", borderBottom: "1px solid #eeeeee00", marginBottom: 0 }} bordered={false}>
								<h3> Your Referral Code is: </h3>
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
						safe_lead.referred_by_referral_code === null ? (
							<antd.Card className="nector-card" style={{ padding: 0, minHeight: "5%", borderBottom: "1px solid #eeeeee00" }} bordered={false} bodyStyle={{ marginTop: -15 }}	>
								<antd.Typography.Link style={{ color: "#2699ab", fontSize: "0.8rem" }} onClick={() => this.setState({ show_referral_code_modal: true })}>
								Have A Referral Code?
								</antd.Typography.Link>
							</antd.Card>
						) : null
					}

					<antd.Card className="nector-card" style={{ padding: 0, minHeight: "10%", borderBottom: "1px solid #eeeeee00" }} bordered={false}>
						{
							has_user && (<div>
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
										Your Coupons
									</div>
									<div>
										<react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ color: "black" }} />
									</div>
								</div>
							</div>)
						}
						<div className="nector-profile-row" style={{ cursor: "pointer", display: "flex" }} onClick={() => this.on_instructionlist("waystoearn")}>
							<div style={{ flex: 1 }}>
								Ways To Earn
							</div>
							<div>
								<react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ color: "black" }} />
							</div>
						</div>
						<div className="nector-profile-row" style={{ cursor: "pointer", display: "flex" }} onClick={() => this.on_instructionlist("waystoredeem")}>
							<div style={{ flex: 1 }}>
								Ways To Redeem
							</div>
							<div>
								<react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ color: "black" }} />
							</div>
						</div>
					</antd.Card>


				</div>
				<antd.Drawer placement="bottom" onClose={this.toggle_drawer} visible={this.state.drawer_visible} closable={false}>
					{this.render_drawer_action()}
				</antd.Drawer>

				<antd.Modal title="Referral Code" visible={this.state.show_referral_code_modal} okText="Submit" onOk={this.on_submit_referralcode} onCancel={() => this.setState({ referral_code: "", show_referral_code_modal: false })} okButtonProps={{ disabled: !this.state.referral_code || this.state.referral_code.length < 4 }} className="referral-code-modal">
					<div style={{ padding: 20 }}>
						<antd.Alert message="Enter the Referral Code of the user who referred you." type="warning" style={{ marginBottom: 10 }}></antd.Alert>
						<antd.Input placeholder="Enter the referral code" value={this.state.referral_code} onChange={e => this.setState({ referral_code: e.target.value })} />
					</div>
				</antd.Modal>
			</div>
		);
	}
}

ProfileComponent.propTypes = properties;

export default ProfileComponent;