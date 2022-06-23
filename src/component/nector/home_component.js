/* eslint-disable no-unused-vars */
//from system
import React from "react";
import prop_types from "prop-types";
import * as react_material_icons from "react-icons/md";
import * as react_game_icons from "react-icons/gi";
import * as react_fi_icons from "react-icons/fi";
import * as react_fa_icons from "react-icons/fa";
import * as react_ri_icons from "react-icons/ri";
import * as react_io_icons from "react-icons/io";
import copy_to_clipboard from "copy-to-clipboard";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";
import axios_wrapper from "../../wrapper/axios_wrapper";
import * as analytics from "../../analytics";

import Button from "./common/button";
import IconText from "./common/icon_text";

import * as antd from "antd";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	businessinfos: prop_types.object.isRequired,
	websdkinfos: prop_types.object.isRequired,
	actioninfos: prop_types.object.isRequired,

	entity: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,
	coupons: prop_types.object.isRequired,
	triggers: prop_types.object.isRequired,
	referral_triggers: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class HomeComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,

			page: 1,
			limit: 10,
		};

		this.api_merchant_get_leads = this.api_merchant_get_leads.bind(this);
		this.api_merchant_list_referraltriggers = this.api_merchant_list_referraltriggers.bind(this);

		this.on_profile = this.on_profile.bind(this);
		this.on_referral = this.on_referral.bind(this);
		this.on_wallettransactionlist = this.on_wallettransactionlist.bind(this);
		this.api_merchant_list_coupons = this.api_merchant_list_coupons.bind(this);
		this.on_offerlist = this.on_offerlist.bind(this);
		this.on_couponlist = this.on_couponlist.bind(this);
		this.on_instructionlist = this.on_instructionlist.bind(this);
		this.on_referralcopy = this.on_referralcopy.bind(this);
		this.on_referral_sharewhatsapp = this.on_referral_sharewhatsapp.bind(this);
		this.on_referral_sharefacebook = this.on_referral_sharefacebook.bind(this);
		this.on_referral_sharetwitter = this.on_referral_sharetwitter.bind(this);
		this.on_referral_shareemail = this.on_referral_shareemail.bind(this);
		this.on_signup = this.on_signup.bind(this);
		this.on_signin = this.on_signin.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		// eslint-disable-next-line no-undef
		if (collection_helper.validate_is_null_or_undefined(this.props.referral_triggers.items)) {
			this.api_merchant_list_referraltriggers({});
		}

		if (this.props.lead._id && collection_helper.validate_is_null_or_undefined(this.props.coupons?.items)) {
			this.api_merchant_list_coupons({});
		}

		setTimeout(() => this.set_state({ loading: false }), 1000);
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.lead._id !== nextProps.lead._id) {
			this.api_merchant_list_coupons({ lead_id: nextProps.lead._id });
		}

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
					sort: "content_type",
					sort_op: "ASC",
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

	api_merchant_list_coupons(values) {
		const list_filters = collection_helper.get_lodash().pick(collection_helper.process_objectify_params(this.props.location.search), ["offer_id", "sort", "sort_op", "page", "limit"]);

		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const lead_id = values.lead_id || this.props.lead._id;

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;
		if (collection_helper.validate_is_null_or_undefined(lead_id) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_COUPON_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			attributes: {
				...axios_wrapper.get_wrapper().fetch({
					lead_id: lead_id,
					page: values.page || 1,
					limit: values.limit || 10,
					sort: values.sort || "created_at",
					sort_op: values.sort_op || "DESC",
					...list_filters,
				}, "coupon")
			}
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {
			this.set_state({ loading: false });
		});
	}

	on_profile() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/user?${search_params.toString()}`);
	}

	on_referral() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/referral?${search_params.toString()}`);
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

	on_referralcopy(code) {
		collection_helper.show_message("Code copied");
		copy_to_clipboard(code);

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_lead_copy_request, {
				referral_code: code
			});
	}

	on_offerlist(e, discounts = false) {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		if (discounts === true) search_params.append("visibility", "private");

		this.props.history.push(`/nector/offer-list?${search_params.toString()}`);

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_offer_view_request);
	}

	on_couponlist() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/coupon-list?${search_params.toString()}`);

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_coupon_view_request);
	}

	on_instructionlist(type) {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/${type}-list?${search_params.toString()}`);

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_instruction_view_request);
	}

	on_referral_sharewhatsapp(business_name, referral_code) {
		const business_uri = this.props.businessinfos?.kyc?.business_uri ? `${this.props.businessinfos.kyc.business_uri}?shownector=true` : null;
		const referral_instruction = this.props.actioninfos?.referral_action?.meta?.execute_after === "make_transaction" ? "applying the code and making first purchase" : "signing up and applying the code";

		window.open(`https://wa.me/?text=${encodeURI(`Hey there. Check out ${business_name} ${business_uri ? "(" + business_uri + ")" : ""}, use my referral code: ${referral_code} to get amazing rewards just by ${referral_instruction}`)}`, "_blank");

		analytics.capture_event(constant_helper.get_app_constant().COLLECTFRONT_EVENTS.REFERRAL_SHARE, this.props.entity._id, "entities", this.props.entity._id);
	}

	on_referral_sharefacebook(business_name, referral_code) {
		const business_uri = this.props.businessinfos?.kyc?.business_uri ? `${this.props.businessinfos.kyc.business_uri}?shownector=true` : null;
		const referral_instruction = this.props.actioninfos?.referral_action?.meta?.execute_after === "make_transaction" ? "applying the code and making first purchase" : "signing up and applying the code";

		window.open(`https://www.facebook.com/dialog/share?app_id=5138626756219227&display=popup&href=${business_uri || ""}&quote=${encodeURI(`Hey there. Check out ${business_name} ${business_uri ? "(" + business_uri + ")" : ""}, use my referral code: ${referral_code} to get amazing rewards just by ${referral_instruction}`)}`, "_blank", "popup=yes,left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0");

		analytics.capture_event(constant_helper.get_app_constant().COLLECTFRONT_EVENTS.REFERRAL_SHARE, this.props.entity._id, "entities", this.props.entity._id);
	}

	on_referral_sharetwitter(business_name, referral_code) {
		const business_uri = this.props.businessinfos?.kyc?.business_uri ? `${this.props.businessinfos.kyc.business_uri}?shownector=true` : null;
		const referral_instruction = this.props.actioninfos?.referral_action?.meta?.execute_after === "make_transaction" ? "applying the code and making first purchase" : "signing up and applying the code";

		window.open(`http://twitter.com/share?url=${business_uri || ""}&text=${encodeURI(`Hey there. Check out ${business_name} ${business_uri ? "(" + business_uri + ")" : ""}, use my referral code: ${referral_code} to get amazing rewards just by ${referral_instruction}`)}`, "_blank", "popup=yes,left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0");

		analytics.capture_event(constant_helper.get_app_constant().COLLECTFRONT_EVENTS.REFERRAL_SHARE, this.props.entity._id, "entities", this.props.entity._id);
	}

	on_referral_shareemail(business_name, referral_code) {
		const business_uri = this.props.businessinfos?.kyc?.business_uri ? `${this.props.businessinfos.kyc.business_uri}?shownector=true` : null;
		const referral_instruction = this.props.actioninfos?.referral_action?.meta?.execute_after === "make_transaction" ? "applying the code and making first purchase" : "signing up and applying the code";

		window.open(`mailto:?subject=${encodeURI(`Check out ${business_name}`)}&body=${encodeURI(`Hey there. Check out ${business_name} ${business_uri ? "(" + business_uri + ")" : ""}, use my referral code: ${referral_code} to get amazing rewards just by ${referral_instruction}`)}`, "_self");

		analytics.capture_event(constant_helper.get_app_constant().COLLECTFRONT_EVENTS.REFERRAL_SHARE, this.props.entity._id, "entities", this.props.entity._id);
	}

	on_signup(signup_link) {
		analytics.send_events({ event: constant_helper.get_app_constant().COLLECTFRONT_EVENTS.SIGNUP_CLICK, entity_id: this.props.entity._id, id_type: "entities", id: this.props.entity._id, incr_by: 1 });

		setTimeout(() => {
			window.open(signup_link, "_parent");
		}, 150);
	}

	on_signin(e, signin_link) {
		e.preventDefault();

		analytics.send_events({ event: constant_helper.get_app_constant().COLLECTFRONT_EVENTS.SIGNIN_CLICK, entity_id: this.props.entity._id, id_type: "entities", id: this.props.entity._id, incr_by: 1 });

		setTimeout(() => {
			window.open(signin_link, "_parent");
		}, 150);
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

		const dataSource = (this.props.websdkinfos && this.props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));
		const referralTriggersDataSource = (this.props.referral_triggers && this.props.referral_triggers.items || []).map(item => ({ ...item, key: item._id })).filter(item => item.content);

		// const referral_content_triggers = (this.props.triggers?.items?.filter(x => x.content_type === "referral") || []);
		const websdk_config_arr = dataSource.filter(x => x.name === "websdk_config") || [];
		const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
		const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

		const picked_wallet = wallets.length > 0 ? wallets[0] : {
			available: "0",
			reserve: "0",
		};

		const metadetail = this.props.lead.metadetail || {
			gender: "female",
			dob: null
		};

		const has_user = (this.props.lead && this.props.lead._id) || false;
		const has_wallet = (wallets.length > 0 && (websdk_config_options.hide_wallet || false) !== true) || false;
		const has_offer = websdk_config_options.hide_offer === true ? false : true;

		const safe_lead = this.props.lead || {};
		const safe_name = (this.props.lead && this.props.lead.name) || "There";

		const show_hero_card = !has_user && (this.props.lead && !this.props.lead.pending) && (websdk_config_options.login_link || websdk_config_options.signup_link);
		const show_loggedout_referral_card = (!has_user && !websdk_config_options.hide_referral) ? true : false;
		const show_loggedin_referral_card = (has_user && safe_lead.referral_code && !websdk_config_options.hide_referral) ? true : false;
		// const show_loggedin_referral_link = (has_user && safe_lead.referral_code && !websdk_config_options.hide_referral && referral_content_triggers.length > 1) ? true : false;

		const hero_gradient = `linear-gradient(to right, ${collection_helper.adjust_color(websdk_config.business_color, 15)}, ${websdk_config.business_color})`;

		return (
			<div style={{ height: "inherit", display: "flex", flexDirection: "column" }}>
				<div>
					<div style={{ padding: "20px 20px 0px 20px", paddingBottom: show_hero_card ? "60px" : "20px", backgroundColor: websdk_config.business_color || "#000", backgroundImage: hero_gradient, borderRadius: 0 }}>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							{(has_user) && (
								<div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "35px", height: "35px", borderRadius: "50%", border: "1px solid #eee", backgroundColor: "white", boxShadow: "2px 2px 15px -4px rgba(0,0,0,0.31)", cursor: "pointer" }} onClick={() => has_user && this.on_profile()}>
									<react_fa_icons.FaUserAstronaut className="nector-text" style={{ color: websdk_config.business_color }} />
								</div>
							)}

							{(show_loggedin_referral_card) && (
								<div className="nector-subtext" style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "50px", padding: "5px 8px", backgroundColor: "white", boxShadow: "2px 2px 15px -4px rgba(0,0,0,0.31)", cursor: "pointer" }} onClick={() => show_loggedin_referral_card && this.on_referral()}>
									<react_io_icons.IoIosPeople className="nector-title" style={{ color: websdk_config.business_color }} />
									<span style={{ marginLeft: 6 }}>refer &amp; earn</span>
								</div>
							)}
						</div>

						<div style={{ flex: 1, paddingTop: 15 }}>
							<antd.Typography.Text className="nector-text" style={{ display: "block", color: websdk_config.text_color }}>👋 Hi {collection_helper.get_lodash().capitalize(collection_helper.get_limited_text(safe_name, 12, "", "")).split(" ")[0]},</antd.Typography.Text>
							<antd.Typography.Text className="nector-title" style={{ display: "block", marginBottom: 2, color: websdk_config.text_color, marginTop: 5 }}>Welcome to {websdk_config_options.business_name || "Rewards"}</antd.Typography.Text>
						</div>

						<div style={{ display: "flex", marginTop: 15 }}>
							<antd.Space size={15}>
								{(has_user) && <IconText icon={<react_game_icons.GiTwoCoins className="nector-subtitle" style={{ color: websdk_config.business_color || "#000" }} />} text={collection_helper.get_safe_amount(picked_wallet.available)} textStyles={{ margin: "0 3px" }} onClick={this.on_wallettransactionlist} title="Coins" />}
								{(has_user) && <IconText className="nector-subtitle" icon={<react_ri_icons.RiCoupon3Fill className="nector-text" style={{ color: websdk_config.business_color || "#000" }} />} text={this.props.coupons?.count || 0} textStyles={{ margin: "0 3px" }} onClick={this.on_couponlist} title="Coupons" />}
								<IconText icon={<react_ri_icons.RiHandCoinFill className="nector-subtitle" style={{ color: websdk_config.business_color || "#000" }} />} text="Ways to Earn" textStyles={{ margin: "0 3px" }} onClick={() => this.on_instructionlist("waystoearn")} title="Earn Coins" />
							</antd.Space>
						</div>
					</div>
				</div>

				{(show_hero_card) && <div>
					<antd.Card bordered={false} style={{ padding: "10px 0", minHeight: "10%", margin: "5px 15px", marginTop: -40, borderRadius: 6, border: "1px solid #ddd", boxShadow: "3px 5px 30px -10px rgba(0,0,0,0.6)" }}>
						<div style={{ width: "90%", margin: "0 auto" }}>
							<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
								<antd.Typography.Text className="nector-subtitle" style={{ textAlign: "center", marginBottom: 10, }}>Join Our Loyalty Program</antd.Typography.Text>
								<antd.Typography.Text className="nector-subtext" style={{ display: "block", textAlign: "center" }}>Earn coins and redeem exclusive offers. Get started now!</antd.Typography.Text>
							</div>

							{(websdk_config_options.signup_link) && <div style={{ marginTop: 15, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
								<Button type="primary" style={{ width: "85%", paddingTop: 8, paddingBottom: 8, height: "auto", borderRadius: 6, }} onClick={() => this.on_signup(websdk_config_options.signup_link)}>Sign Up To Get Free Coins</Button>
								{(websdk_config_options.login_link) && <antd.Typography.Text className="nector-subtext" style={{ display: "block", marginTop: 10 }}>Already have an account? <a href="#" className="nector-text" style={{ textDecoration: "underline" }} onClick={(e) => this.on_signin(e, websdk_config_options.login_link)}>Login</a></antd.Typography.Text>}
							</div>}

							{(!websdk_config_options.signup_link && websdk_config_options.login_link) && <div style={{ marginTop: 15, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
								<Button type="primary" style={{ width: "85%", paddingTop: 8, paddingBottom: 8, height: "auto", borderRadius: 6, }} onClick={() => window.open(websdk_config_options.login_link, "_parent")}>Login To Redeem Offers</Button>
							</div>}
						</div>
					</antd.Card>
				</div>}

				<div style={{ margin: 15, marginTop: 15 }}>
					<div style={{ display: "flex", flex: 1, flexWrap: "wrap", justifyContent: "space-between" }}>
						{
							has_offer && (<antd.Card className="nector-home-card" style={{ padding: 0, width: "48%", borderRadius: 6, cursor: "pointer" }} onClick={this.on_offerlist}>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
									<antd.Typography.Paragraph className="nector-text" style={{ marginBottom: 0 }}>Offer Store</antd.Typography.Paragraph>
									<div style={{ textAlign: "end" }}>
										<react_material_icons.MdKeyboardBackspace className="nector-backspace-rotate nector-text" style={{ color: "black" }} />
									</div>
								</div>
								<antd.Typography.Paragraph className="nector-subtext" style={{ marginBottom: 2, }}>Redeem your coins to get big offers on various products.</antd.Typography.Paragraph>
							</antd.Card>)
						}
						{
							has_offer && (<antd.Card className="nector-home-card" style={{ padding: 0, width: "48%", borderRadius: 6, cursor: "pointer" }} onClick={(e) => this.on_offerlist(e, true)}>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
									<antd.Typography.Paragraph className="nector-text" style={{ marginBottom: 0 }}>Discounts</antd.Typography.Paragraph>
									<div style={{ textAlign: "end" }}>
										<react_material_icons.MdKeyboardBackspace className="nector-backspace-rotate nector-text" style={{ color: "black" }} />
									</div>
								</div>
								<antd.Typography.Paragraph className="nector-subtext" style={{ marginBottom: 2, }}>Redeem your coins to get amazing discounts on various products.</antd.Typography.Paragraph>
							</antd.Card>)
						}
					</div>
				</div>

				{(show_loggedout_referral_card && (referralTriggersDataSource && referralTriggersDataSource.length > 1)) && <div>
					<antd.Card bordered={false} style={{ padding: "0px", minHeight: "10%", margin: "15px", marginTop: 0, borderRadius: 6, border: "1px solid #ddd", boxShadow: "3px 5px 30px -10px rgba(0,0,0,0.2)" }}>
						<div style={{ width: "90%", margin: "0 auto" }}>
							<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
								<antd.Typography.Title className="nector-subtitle" level={5} style={{ textAlign: "center", marginBottom: 10 }}>Referrals</antd.Typography.Title>
								<antd.Typography.Text className="nector-subtext" style={{ display: "block", textAlign: "center" }}>Refer your friends to win exciting rewards and offers! <a href="#" className="nector-text" style={{ textDecoration: "underline" }} onClick={(e) => this.on_signin(e, websdk_config_options.login_link)}>Login</a> </antd.Typography.Text>
							</div>
						</div>

						<div style={{ display: "flex", justifyContent: "space-between", flex: "1 0 auto" }}>
							<div style={{ padding: 20, display: "flex", justifyContent: "space-between", flex: "1 0 auto", alignSelf: "start" }}>
								<div style={{ flex: 0.48, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
									<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><react_fi_icons.FiGift className="nector-title" style={{ color: websdk_config.business_color }} /></div>
									<antd.Typography.Text className="nector-pretext" style={{ display: "block", textAlign: "center", }}>{referralTriggersDataSource?.[0]?.content?.name}</antd.Typography.Text>
									<antd.Typography.Text className="nector-subtext" style={{ display: "block", textAlign: "center", }}>{referralTriggersDataSource?.[0]?.content?.description}</antd.Typography.Text>
								</div>
								<div style={{ alignSelf: "center" }}>
									<antd.Divider type={"vertical"} style={{ height: 30 }} />
								</div>
								<div style={{ flex: 0.48, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
									<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><react_fi_icons.FiGift className="nector-title" style={{ color: websdk_config.business_color }} /></div>
									<antd.Typography.Text className="nector-pretext" style={{ display: "block", textAlign: "center", }}>{referralTriggersDataSource?.[1]?.content?.name}</antd.Typography.Text>
									<antd.Typography.Text className="nector-subtext" style={{ display: "block", textAlign: "center", }}>{referralTriggersDataSource?.[1]?.content?.description}</antd.Typography.Text>
								</div>
							</div>
						</div>
					</antd.Card>
				</div>}


				{(show_loggedin_referral_card && (referralTriggersDataSource && referralTriggersDataSource.length > 0)) && <div>
					<antd.Card bordered={false} style={{ padding: "0px", minHeight: "10%", margin: "15px", marginTop: 0, borderRadius: 6, border: "1px solid #ddd", boxShadow: "3px 5px 30px -10px rgba(0,0,0,0.2)" }} bodyStyle={{ paddingBottom: 20 }}>
						<div style={{ width: "90%", margin: "0 auto" }}>
							<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
								<antd.Typography.Title className="nector-subtitle" level={5} style={{ textAlign: "center", marginBottom: 10 }}>Refer Your Friends</antd.Typography.Title>
								<antd.Typography.Text className="nector-subtext" style={{ display: "block", textAlign: "center" }}>Give your friends a reward and claim your own when they <b style={{ fontWeight: "bold" }}> {this.props.actioninfos?.referral_action?.meta?.execute_after === "make_transaction" ? "Apply the Code and Make their First Purchase" : "Signup and Apply the Code"} on {websdk_config_options.business_name || "your website"}</b></antd.Typography.Text>
							</div>

							<div style={{ marginTop: 20 }}>
								<div className="nector-wallet-point-design nector-text" style={{ padding: "10px 0px", width: "100%" }}>
									<span style={{ display: "inline-block", marginRight: 15, }}>{safe_lead.referral_code}</span>
									<react_material_icons.MdContentCopy className="nector-text" onClick={() => this.on_referralcopy(safe_lead.referral_code)} style={{ color: websdk_config.business_color, cursor: "pointer" }} />
								</div>
							</div>

							<div style={{ margin: "10px 0px", marginTop: 10 }}>
								<p className="nector-subtext" style={{ margin: 0, marginBottom: 20, textAlign: "center", filter: "brightness(0.95)" }}>Share with your friends now!</p>
								<div style={{ display: "flex", justifyContent: "space-around", padding: "0px 10px" }}>
									<react_ri_icons.RiWhatsappFill className="nector-text" title="WhatsApp" style={{ cursor: "pointer", color: websdk_config.business_color }} onClick={() => this.on_referral_sharewhatsapp(websdk_config_options.business_name, safe_lead.referral_code)} />
									<react_fa_icons.FaFacebook className="nector-text" title="Facebook" style={{ cursor: "pointer", color: websdk_config.business_color }} onClick={() => this.on_referral_sharefacebook(websdk_config_options.business_name, safe_lead.referral_code)} />
									<react_fa_icons.FaTwitter className="nector-text" title="Twitter" style={{ cursor: "pointer", color: websdk_config.business_color }} onClick={() => this.on_referral_sharetwitter(websdk_config_options.business_name, safe_lead.referral_code)} />
									<react_material_icons.MdEmail className="nector-text" title="Email" style={{ cursor: "pointer", color: websdk_config.business_color }} onClick={() => this.on_referral_shareemail(websdk_config_options.business_name, safe_lead.referral_code)} />
								</div>
							</div>

							<div style={{ textAlign: "center", marginTop: 15 }}>
								<Button type="primary" onClick={() => show_loggedin_referral_card && this.on_referral()}> <span style={{ marginRight: 6 }}>Refer &amp; Earn</span>  <react_material_icons.MdKeyboardBackspace className="nector-backspace-rotate nector-text" style={{ color: websdk_config.text_color }} /> </Button>
							</div>
						</div>
					</antd.Card>
				</div>}
			</div >
		);
	}
}

HomeComponent.propTypes = properties;

export default HomeComponent;