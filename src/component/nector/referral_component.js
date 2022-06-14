/* eslint-disable no-unused-vars */
//from system
import React from "react";

import prop_types from "prop-types";
import copy_to_clipboard from "copy-to-clipboard";
import * as react_material_icons from "react-icons/md";
import * as react_ri_icons from "react-icons/ri";
import * as react_ai_icons from "react-icons/ai";
import * as react_fa_icons from "react-icons/fa";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";
import axios_wrapper from "../../wrapper/axios_wrapper";

import * as antd from "antd";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	websdkinfos: prop_types.object.isRequired,

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

		this.api_merchant_update_leadsreferredbyreferralcode = this.api_merchant_update_leadsreferredbyreferralcode.bind(this);
		this.api_merchant_list_referraltriggers = this.api_merchant_list_referraltriggers.bind(this);

		this.on_referralcopy = this.on_referralcopy.bind(this);
		this.on_referral_sharewhatsapp = this.on_referral_sharewhatsapp.bind(this);
		this.on_referral_sharefacebook = this.on_referral_sharefacebook.bind(this);
		this.on_referral_sharetwitter = this.on_referral_sharetwitter.bind(this);
		this.on_referral_shareemail = this.on_referral_shareemail.bind(this);

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
				collection_helper.show_message("Your referral reward will get processed in sometime", "success");
				this.setState({ show_referral_code_modal: false, referral_code: null });
				this.api_merchant_get_leads();
			}
		});

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_lead_referral_request, {
				referred_by_referral_code: values.referred_by_referral_code,
				referral_code: this.state.referral_code
			});
	}

	on_submit_referralcode(values) {
		if (values.referred_by_referral_code) {
			this.api_merchant_update_leadsreferredbyreferralcode({ referred_by_referral_code: values.referred_by_referral_code });
		}
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
		window.open(`https://wa.me/?text=${encodeURI(`Hey everyone. Check out ${business_name} (${window.location.origin}) and use my referral code: ${referral_code} to get amazing rewards!`)}`, "_blank");
	}

	on_referral_sharefacebook(business_name, referral_code) {
		window.open(`https://www.facebook.com/dialog/share?app_id=${5138626756219227}&display=popup&href=${encodeURI(window.location.origin)}&quote=${encodeURI(`Hey everyone. Check out ${business_name} and use my referral code: ${referral_code} to get amazing rewards!`)}`, "_blank", "popup=yes,left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0");
	}

	on_referral_sharetwitter(business_name, referral_code) {
		window.open(`http://twitter.com/share?url=${encodeURI(window.location.origin)}&text=${encodeURI(`Hey everyone. Check out ${business_name} and use my referral code: ${referral_code} to get amazing rewards!`)}`, "_blank", "popup=yes,left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0");
	}

	on_referral_shareemail(business_name, referral_code) {
		window.open(`mailto:?subject=${encodeURI(`Check out ${business_name}`)}&body=${encodeURI(`Hi. Check out ${business_name} (${window.location.origin}) and use my referral code: ${referral_code} to get amazing rewards!`)}`, "_self");
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

		// const referral_content_triggers = (this.props.triggers?.items?.filter(x => x.content_type === "referral") || []);
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
			<div style={{ height: "inherit", display: "flex", flexDirection: "column" }}>
				<div>
					<div style={{ minHeight: "60vh", padding: 20, backgroundColor: websdk_config.business_color || "#000", backgroundImage: hero_gradient }}>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<div style={{ display: "flex" }} onClick={() => this.props.history.goBack()}>
								<h1><react_material_icons.MdKeyboardBackspace className="nector-icon" style={{ color: websdk_config.text_color, borderRadius: 6 }}></react_material_icons.MdKeyboardBackspace></h1>
							</div>

							{/* <div className="nector-subtext" style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "50px", padding: "5px 8px", backgroundColor: "white", boxShadow: "2px 2px 15px -4px rgba(0,0,0,0.31)", cursor: "pointer" }} onClick={this.on_referral}>
								<react_ai_icons.AiOutlineHistory className="nector-title" style={{ color: websdk_config.business_color }} />
								<span style={{ marginLeft: 6 }}>history</span>
							</div> */}
						</div>

						<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
							<img src=" https://cdn.nector.io/nector-static/image/nectorreferral.png" style={{ width: "50%", height: "auto" }} />
						</div>

						<div style={{ flex: 1, paddingTop: 15, textAlign: "center" }}>
							<antd.Typography.Text className="nector-subtext" style={{ display: "block", textAlign: "center", color: websdk_config.text_color, }}>Give your friends a reward and claim your own when they {websdk_config.referral_execute_after_order === true ? "make a purchase" : "sign up"}</antd.Typography.Text>
						</div>

						<div style={{ marginTop: 20, textAlign: "center" }}>
							<div style={{ marginTop: 20 }}>
								<div className="nector-wallet-point-design nector-text" style={{ padding: "10px 0px", width: "95%" }}>
									<span style={{ display: "inline-block", marginRight: 15 }}>{safe_lead.referral_code}</span>
									<react_material_icons.MdContentCopy className="nector-text" onClick={() => this.on_referralcopy(safe_lead.referral_code)} style={{ color: "#000", cursor: "pointer" }} />
								</div>
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

					<div style={{ padding: 20, display: "flex", justifyContent: "space-between" }}>
						<div style={{ flex: 0.48, alignItems: "center", justifyContent: "center" }}>
							<p>here the instructions for you</p>
							<p>here the instructions for you</p>
						</div>
						<div style={{ alignSelf: "center" }}>
							<antd.Divider type={"vertical"} style={{ height: 30 }} />
						</div>
						<div style={{ flex: 0.48, alignItems: "center", justifyContent: "center" }}>
							<p>here the instructions for them</p>
							<p>here the instructions for you</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

ReferralComponent.propTypes = properties;

export default ReferralComponent;