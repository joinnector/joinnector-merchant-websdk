/* eslint-disable no-unused-vars */
//from system
import React from "react";

import prop_types from "prop-types";
import copy_to_clipboard from "copy-to-clipboard";
import * as react_material_icons from "react-icons/md";
import * as react_ri_icons from "react-icons/ri";
import * as react_fa_icons from "react-icons/fa";
import * as react_ai_icons from "react-icons/ai";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";
import axios_wrapper from "../../wrapper/axios_wrapper";
import * as analytics from "../../analytics";

import * as antd from "antd";
import Button from "./common/button";
import * as ViewForm from "../../component_form/nector/referral/view_form";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	businessinfos: prop_types.object.isRequired,
	websdkinfos: prop_types.object.isRequired,
	actioninfos: prop_types.object.isRequired,

	entity: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,
	triggers: prop_types.object.isRequired,
	referral_triggers: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class ReferralComponent extends React.Component {
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

		this.api_merchant_list_referraltriggers = this.api_merchant_list_referraltriggers.bind(this);
		this.api_merchant_get_leads = this.api_merchant_get_leads.bind(this);
		this.api_merchant_update_leadsreferredbyreferralcode = this.api_merchant_update_leadsreferredbyreferralcode.bind(this);

		this.on_referralcopy = this.on_referralcopy.bind(this);
		this.on_referral_sharewhatsapp = this.on_referral_sharewhatsapp.bind(this);
		this.on_referral_sharefacebook = this.on_referral_sharefacebook.bind(this);
		this.on_referral_sharetwitter = this.on_referral_sharetwitter.bind(this);
		this.on_referral_shareemail = this.on_referral_shareemail.bind(this);

		this.on_applyreferralcode = this.on_applyreferralcode.bind(this);
		this.toggle_drawer = this.toggle_drawer.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		// eslint-disable-next-line no-undef
		if (collection_helper.validate_is_null_or_undefined(this.props.referral_triggers.items)) {
			this.api_merchant_list_referraltriggers({});
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

	api_merchant_list_referraltriggers() {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_REFERRALTRIGGER_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				...axios_wrapper.get_wrapper().fetch({
					page: 1,
					limit: 10,
					sort: "position",
					sort_op: "DESC",
					content_types: ["referral"],
				}, "trigger")
			}
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts);
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
		} else if (collection_helper.validate_not_null_or_undefined(lead_query.customer_id) === true
			&& collection_helper.validate_not_null_or_undefined(default_search_params.identifier)) {
			attributes = axios_wrapper.get_wrapper().get_by("customer_id", collection_helper.process_key_join([default_search_params.identifier, customer_id], "-"), "lead");
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

	api_merchant_update_leadsreferredbyreferralcode(values) {
		if (!this.props.lead._id) return;

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
				...axios_wrapper.get_wrapper().save(this.props.lead._id, {
					...collection_helper.process_nullify(collection_helper.get_lodash().omitBy(collection_helper.get_lodash().pick(values, ["referred_by_referral_code"]), collection_helper.get_lodash().isNil)),
				}, "leadreferredbyreferralcode")
			}
		};

		if (Object.keys(opts.attributes.attributes).length < 1) return null;

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_put(opts, (result) => {
			if (result.meta.status === "success") {
				const referralexcutemsg = result.data.execute_after === "first_order" ? "after you place your first successful order" : "in sometime";
				collection_helper.show_message(`If referral code is valid, it will get processed ${referralexcutemsg}`, "success");
				this.setState({ show_referral_code_modal: false, referral_code: null });
				this.api_merchant_get_leads();

				analytics.capture_event(constant_helper.get_app_constant().COLLECTFRONT_EVENTS.REFERRAL_EXECUTE, this.props.entity._id, "entities", this.props.entity._id);
			}
		});

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_lead_referral_request, {
				referred_by_referral_code: values.referred_by_referral_code,
				referral_code: this.state.referral_code
			});
	}

	on_applyreferralcode() {
		this.set_state({ action: "edit" });
		this.toggle_drawer();
	}

	on_referralcopy(code) {
		collection_helper.show_message("Code copied");
		copy_to_clipboard(code);

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_lead_copy_request, {
				referral_code: code
			});
	}

	on_referral_sharewhatsapp(business_name, referral_code) {
		const business_uri = this.props.businessinfos?.kyc?.business_uri ? `${this.props.businessinfos.kyc.business_uri}?shownector=true` : null;
		const referral_instruction = this.props.actioninfos?.referral_action?.meta?.condition?.execute_after === "first_order" ? "applying the code and making first purchase" : "signing up and applying the code";

		window.open(`https://wa.me/?text=${encodeURI(`Hey there. Check out ${business_name} ${business_uri ? "(" + business_uri + ")" : ""}, use my referral code: ${referral_code} to get amazing rewards just by ${referral_instruction}`)}`, "_blank");

		analytics.capture_event(constant_helper.get_app_constant().COLLECTFRONT_EVENTS.REFERRAL_SHARE, this.props.entity._id, "entities", this.props.entity._id);
	}

	on_referral_sharefacebook(business_name, referral_code) {
		const business_uri = this.props.businessinfos?.kyc?.business_uri ? `${this.props.businessinfos.kyc.business_uri}?shownector=true` : null;
		const referral_instruction = this.props.actioninfos?.referral_action?.meta?.condition?.execute_after === "first_order" ? "applying the code and making first purchase" : "signing up and applying the code";

		window.open(`https://www.facebook.com/dialog/share?app_id=5138626756219227&display=popup&href=${business_uri || ""}&quote=${encodeURI(`Hey there. Check out ${business_name} ${business_uri ? "(" + business_uri + ")" : ""}, use my referral code: ${referral_code} to get amazing rewards just by ${referral_instruction}`)}`, "_blank", "popup=yes,left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0");

		analytics.capture_event(constant_helper.get_app_constant().COLLECTFRONT_EVENTS.REFERRAL_SHARE, this.props.entity._id, "entities", this.props.entity._id);
	}

	on_referral_sharetwitter(business_name, referral_code) {
		const business_uri = this.props.businessinfos?.kyc?.business_uri ? `${this.props.businessinfos.kyc.business_uri}?shownector=true` : null;
		const referral_instruction = this.props.actioninfos?.referral_action?.meta?.condition?.execute_after === "first_order" ? "applying the code and making first purchase" : "signing up and applying the code";

		window.open(`http://twitter.com/share?url=${business_uri || ""}&text=${encodeURI(`Hey there. Check out ${business_name} ${business_uri ? "(" + business_uri + ")" : ""}, use my referral code: ${referral_code} to get amazing rewards just by ${referral_instruction}`)}`, "_blank", "popup=yes,left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0");

		analytics.capture_event(constant_helper.get_app_constant().COLLECTFRONT_EVENTS.REFERRAL_SHARE, this.props.entity._id, "entities", this.props.entity._id);
	}

	on_referral_shareemail(business_name, referral_code) {
		const business_uri = this.props.businessinfos?.kyc?.business_uri ? `${this.props.businessinfos.kyc.business_uri}?shownector=true` : null;
		const referral_instruction = this.props.actioninfos?.referral_action?.meta?.condition?.execute_after === "first_order" ? "applying the code and making first purchase" : "signing up and applying the code";

		window.open(`mailto:?subject=${encodeURI(`Check out ${business_name}`)}&body=${encodeURI(`Hey there. Check out ${business_name} ${business_uri ? "(" + business_uri + ")" : ""}, use my referral code: ${referral_code} to get amazing rewards just by ${referral_instruction}`)}`, "_self");

		analytics.capture_event(constant_helper.get_app_constant().COLLECTFRONT_EVENTS.REFERRAL_SHARE, this.props.entity._id, "entities", this.props.entity._id);
	}

	toggle_drawer() {
		// eslint-disable-next-line no-unused-vars
		this.setState((state, props) => ({
			drawer_visible: !state.drawer_visible
		}));
	}

	render_drawer_action() {
		if (this.state.action === "edit") {
			return <ViewForm.MobileRenderEditProfileItem {...this.props} drawer_visible={this.state.drawer_visible} api_merchant_update_leadsreferredbyreferralcode={this.api_merchant_update_leadsreferredbyreferralcode} toggle_drawer={this.toggle_drawer} />;
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

		const referralTriggersDataSource = (this.props.referral_triggers && this.props.referral_triggers.items || []).map(item => ({ ...item, key: item._id })).filter(item => item.content);

		const websdk_config_arr = dataSource.filter(x => x.name === "websdk_config") || [];
		const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
		const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

		const picked_wallet = wallets.length > 0 ? wallets[0] : {
			available: "0",
			reserve: "0",
		};

		collection_helper.set_css_property("--g-text-color", websdk_config.text_color);

		const hero_gradient = `linear-gradient(to right, ${collection_helper.adjust_color(websdk_config.business_color, 15)}, ${websdk_config.business_color})`;

		return (
			<div style={{ minHeight: "100vh", display: "flex", }}>
				<div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
					<div style={{ padding: 20, flex: 1, backgroundColor: websdk_config.business_color || "#000", backgroundImage: hero_gradient }}>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => this.props.history.goBack()}>
								<h1><react_material_icons.MdKeyboardBackspace className="nector-icon" style={{ color: "#FFF", borderRadius: 6 }}></react_material_icons.MdKeyboardBackspace></h1>
							</div>

							<div className="nector-subtext nector-shadow-button" onClick={this.on_referral}>
								<react_ai_icons.AiOutlineHistory className="nector-title" style={{ color: websdk_config.business_color }} />
								<span style={{ marginLeft: 6 }}>history</span>
							</div>
						</div>

						<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
							<img src="https://cdn.nector.io/nector-static/image/nectorreferral.png" style={{ width: "40%", height: "auto" }} />
						</div>

						<antd.Timeline className="nector-timeline" style={{ color: websdk_config.text_color }}>
							<antd.Timeline.Item className="nector-pretext" color="blue">Refer your friend by sharing your referral code</antd.Timeline.Item>
							<antd.Timeline.Item className="nector-pretext" color="blue">They {this.props.actioninfos?.referral_action?.meta?.condition?.execute_after === "first_order" ? "apply the code and make their first purchase" : "sign up and apply the code"} on {websdk_config_options.business_name || "your website"}</antd.Timeline.Item>
							<antd.Timeline.Item className="nector-pretext" style={{ fontWeight: "bold" }} color="green" >
								{referralTriggersDataSource?.[0]?.content?.name} {referralTriggersDataSource?.[0]?.content?.description} <br></br> {referralTriggersDataSource?.[1]?.content?.name} {referralTriggersDataSource?.[1]?.content?.description}
							</antd.Timeline.Item>
						</antd.Timeline>

						<div style={{ textAlign: "center" }}>
							<div className="nector-wallet-point-design nector-text" style={{ padding: "10px 0px", width: "95%", margin: "0 auto" }}>
								<span style={{ display: "inline-block", marginRight: 15 }}>{safe_lead.referral_code}</span>
								<react_material_icons.MdContentCopy className="nector-text" onClick={() => this.on_referralcopy(safe_lead.referral_code)} style={{ color: "#000", cursor: "pointer" }} />
							</div>
						</div>

						<div style={{ margin: "10px 0px", marginTop: 10, textAlign: "center" }}>
							<p className="nector-subtext" style={{ margin: 0, marginBottom: 20, textAlign: "center", filter: "brightness(0.95)", color: websdk_config.text_color, }}>Share with your friends now!</p>
							<div style={{ display: "flex", justifyContent: "space-around", padding: "0px 10px" }}>
								<react_ri_icons.RiWhatsappFill className="nector-text" title="WhatsApp" style={{ cursor: "pointer", color: websdk_config.text_color, }} onClick={() => this.on_referral_sharewhatsapp(websdk_config_options.business_name, safe_lead.referral_code)} />
								<react_fa_icons.FaFacebook className="nector-text" title="Facebook" style={{ cursor: "pointer", color: websdk_config.text_color, }} onClick={() => this.on_referral_sharefacebook(websdk_config_options.business_name, safe_lead.referral_code)} />
								<react_fa_icons.FaTwitter className="nector-text" title="Twitter" style={{ cursor: "pointer", color: websdk_config.text_color, }} onClick={() => this.on_referral_sharetwitter(websdk_config_options.business_name, safe_lead.referral_code)} />
								<react_material_icons.MdEmail className="nector-text" title="Email" style={{ cursor: "pointer", color: websdk_config.text_color, }} onClick={() => this.on_referral_shareemail(websdk_config_options.business_name, safe_lead.referral_code)} />
							</div>
						</div>
					</div>

					<div>
						{safe_lead.referred_by_referral_code === null
							? (<div style={{ position: "sticky", bottom: 0, padding: "1em 2em", borderTop: "1px solid #ddd", boxShadow: "-2px -6px 42px -10px rgba(0,0,0,0.30)", borderRadius: "1em 1em 0 0", textAlign: "center", backgroundColor: "white" }}>
								<Button style={{ width: "80%", height: "40px", borderRadius: 6 }} onClick={this.on_applyreferralcode}>Apply Referral Code</Button>
							</div>)
							: (<div className="nector-pretext" style={{ position: "sticky", bottom: 0, padding: "1em 2em", borderTop: "1px solid #ddd", boxShadow: "-2px -6px 42px -10px rgba(0,0,0,0.30)", borderRadius: "1em 1em 0 0", textAlign: "center", backgroundColor: "white" }}>
								👋 Referral code: <b className="nector-subtitle">{safe_lead.referred_by_referral_code}</b> has been applied!
							</div>)
						}
					</div>
				</div>

				<antd.Drawer placement="bottom" onClose={this.toggle_drawer} visible={this.state.drawer_visible} closable={false} contentWrapperStyle={{ minHeight: 260, height: 260 }}>
					{this.render_drawer_action()}
				</antd.Drawer>
			</div>
		);
	}
}

ReferralComponent.propTypes = properties;

export default ReferralComponent;