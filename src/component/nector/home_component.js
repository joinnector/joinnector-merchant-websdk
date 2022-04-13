/* eslint-disable no-unused-vars */
//from system
import React from "react";
import prop_types from "prop-types";
import * as react_material_icons from "react-icons/md";
import * as react_game_icons from "react-icons/gi";
import * as react_fi_icons from "react-icons/fi";
import * as react_fa_icons from "react-icons/fa";
import * as react_remix_icons from "react-icons/ri";
import copy_to_clipboard from "copy-to-clipboard";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";
import axios_wrapper from "../../wrapper/axios_wrapper";

import * as antd from "antd";
import * as antd_icons from "@ant-design/icons";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	websdkinfos: prop_types.object.isRequired,

	lead: prop_types.object.isRequired,
	referral_instructions: prop_types.object.isRequired,

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
		this.api_merchant_list_waystoreferralinstructions = this.api_merchant_list_waystoreferralinstructions.bind(this);
		this.api_merchant_update_leadsreferredbyreferralcode = this.api_merchant_update_leadsreferredbyreferralcode.bind(this);

		this.on_profile = this.on_profile.bind(this);
		this.on_wallettransactionlist = this.on_wallettransactionlist.bind(this);
		this.on_discountlist = this.on_discountlist.bind(this);
		this.on_deallist = this.on_deallist.bind(this);
		this.on_couponlist = this.on_couponlist.bind(this);
		this.on_instructionlist = this.on_instructionlist.bind(this);
		this.on_referralcopy = this.on_referralcopy.bind(this);
		this.on_referral_sharefacebook = this.on_referral_sharefacebook.bind(this);
		this.on_referral_sharetwitter = this.on_referral_sharetwitter.bind(this);
		this.on_referral_shareemail = this.on_referral_shareemail.bind(this);
		this.on_submit_referralcode = this.on_submit_referralcode.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		// eslint-disable-next-line no-undef
		this.api_merchant_list_waystoreferralinstructions({});

		setTimeout(() => this.set_state({ loading: false }), 1000);
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	api_merchant_list_waystoreferralinstructions(values) {
		let list_filters = collection_helper.get_lodash().pick(collection_helper.process_objectify_params(this.props.location.search), ["sort", "sort_op", "page", "limit"]);

		this.set_state({ page: list_filters.page || values.page || 1, limit: list_filters.limit || values.limit || 10 });

		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_REFERRALINSTRUCTION_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: values.append_data || false,
			attributes: {
				...axios_wrapper.get_wrapper().fetch({
					page: values.page || 1,
					limit: values.limit || 10,
					sort: values.sort || "score",
					sort_op: values.sort_op || "DESC",
					type: "ways_to_referral",
					...list_filters,
				}, "instruction")
			}
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {
			this.set_state({ loading: false });
		});
	}

	api_merchant_update_leadsreferredbyreferralcode(values) {
		if(!this.props.lead?._id) return;

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
				collection_helper.show_message("Submitted Successfully!", "success");
				this.setState({ show_referral_code_modal: false, referral_code: null });
				this.api_merchant_get_leads();
			} else {
				collection_helper.show_message("Invalid Referral Code", "error");
			}
		});

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_lead_referral_request, {
				referred_by_referral_code: values.referred_by_referral_code,
				referral_code: this.state.referral_code
			});
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

	on_profile() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/user?${search_params.toString()}`);
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

	on_deallist() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/deal-list?${search_params.toString()}`);

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_deal_view_request);
	}

	on_discountlist() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/discount-list?${search_params.toString()}`);

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_discount_view_request);
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

	on_submit_referralcode(values) {
		if (values.referred_by_referral_code) {
			this.api_merchant_update_leadsreferredbyreferralcode({ referred_by_referral_code: values.referred_by_referral_code });
		}
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

		const dataSource = (this.props.websdkinfos && this.props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));
		const referralInstructionsDataSource = (this.props.referral_instructions && this.props.referral_instructions.items || []).map(item => ({ ...item, key: item._id }));

		const websdk_config = dataSource.filter(x => x.name === "websdk_config") || [];
		const websdk_config_options = websdk_config.length > 0 ? websdk_config[0].value : {};

		const picked_wallet = wallets.length > 0 ? wallets[0] : {
			available: "0",
			reserve: "0",
		};

		const metadetail = this.props.lead.metadetail || {
			gender: "female",
			dob: null
		};

		const has_user = (this.props.lead && this.props.lead._id) || false;
		const has_wallet = (wallets.length > 0 && (websdk_config_options.disable_wallet || false) !== true) || false;
		const has_deal = websdk_config_options.disable_deal === true ? false : true;
		const has_discount = websdk_config_options.disable_discount === true ? false : true;
		const safe_websdkcolor = websdk_config_options.disable_discount === true ? false : true;

		const safe_lead = this.props.lead || {};
		const safe_name = (this.props.lead && this.props.lead.name) || "There";


		const show_hero_card = !has_user && (this.props.lead && !this.props.lead.pending) && (websdk_config_options.login_link || websdk_config_options.signup_link);
		const show_loggedout_referral_card = (!has_user && !websdk_config_options.hide_referral) ? true : false;
		const show_loggedin_referral_card = (has_user && safe_lead.referral_code && !websdk_config_options.hide_referral) ? true : false;

		return (
			<div style={{ height: "inherit", display: "flex", flexDirection: "column" }}>
				<div>
					<div style={{ padding: "20px 20px 0px 20px", paddingBottom: show_hero_card ? "60px" : "25px", backgroundColor: "#000", backgroundImage: `linear-gradient(131deg, #000 75%, ${websdk_config_options.business_color || "#000"} 100%)`, borderRadius: show_hero_card ? "0px" : "0 0 10px 10px" }}>
						<div style={{ flex: 1, paddingTop: 20 }}>
							<antd.Typography.Text style={{ display: "block", color: "white" }}>Hi {collection_helper.get_lodash().capitalize(collection_helper.get_limited_text(safe_name, 12, "", "")).split(" ")[0]},</antd.Typography.Text>
							<antd.Typography.Text style={{ fontSize: "1.75em", marginBottom: 2, color: "white" }}>Welcome to {websdk_config_options.business_name || "Rewards"}</antd.Typography.Text>
						</div>
					</div>
				</div>

				{(show_hero_card) && <div>
					<antd.Card bordered={false} style={{ padding: "10px 0", minHeight: "10%", margin: "5px 15px", marginTop: -40, borderRadius: 8, border: "1px solid #ddd", boxShadow: "3px 5px 30px -10px rgba(0,0,0,0.6)" }}>
						<div style={{ width: "90%", margin: "0 auto" }}>
							<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
								<antd.Typography.Title level={5} style={{ textAlign: "center", marginBottom: 10, fontWeight: "lighter", fontSize: "18px" }}>Join Our Loyalty Program</antd.Typography.Title>
								<antd.Typography.Text style={{ display: "block", textAlign: "center", fontSize: 13 }}>Earn coins and redeem exclusive deals & discounts. Get started now!</antd.Typography.Text>
							</div>

							{(websdk_config_options.signup_link) && <div style={{ marginTop: 15, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
								<antd.Button type="primary" style={{ width: "85%", paddingTop: 8, paddingBottom: 8, height: "auto", borderRadius: 5, /* backgroundColor: "#f5a623", color: "white" */ }} onClick={() => window.open(websdk_config_options.signup_link, "_parent")}>Sign Up To Get Free Coins</antd.Button>

								{(websdk_config_options.login_link) && <antd.Typography.Text style={{ display: "block", marginTop: 10, fontSize: 12 }}>Already have an account? <a href={websdk_config_options.login_link} target="_parent" style={{ fontSize: 13, textDecoration: "underline" }}>Login</a></antd.Typography.Text>}
							</div>}

							{(!websdk_config_options.signup_link && websdk_config_options.login_link) && <div style={{ marginTop: 15, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
								<antd.Button type="primary" style={{ width: "85%", paddingTop: 8, paddingBottom: 8, height: "auto", borderRadius: 5, /* backgroundColor: "#f5a623", color: "white" */ }} onClick={() => window.open(websdk_config_options.login_link, "_parent")}>Login To Redeem Deals</antd.Button>
							</div>}
						</div>
					</antd.Card>
				</div>}

				<div style={{ margin: 15, marginTop: 0 }}>
					{(has_user) && <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "50px", height: "50px", borderRadius: "50%", border: "1px solid #eee", marginLeft: "auto", marginTop: "-25px", backgroundColor: "white", boxShadow: "2px 2px 15px -4px rgba(0,0,0,0.31)" }} onClick={() => has_user && this.on_profile()}>
						<antd_icons.UserOutlined style={{ color: "black", fontSize: "22px" }} />
					</div>}

					<antd.Typography.Title level={5} style={{ marginTop: has_user ? 0 : 15, fontSize: "20px", fontWeight: "normal" }}>Discover</antd.Typography.Title>

					<div style={{ display: "flex", flex: 1, flexWrap: "wrap", justifyContent: "space-between" }}>
						{
							has_deal && (<antd.Card className="nector-home-card" style={{ padding: 0, width: "48%", borderRadius: 10, marginRight: 3, cursor: "pointer" }} onClick={this.on_deallist}>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
									<antd.Typography.Paragraph style={{ fontSize: "1em", fontWeight: "bold", marginBottom: 0 }}>Deal Store</antd.Typography.Paragraph>
									<div style={{ textAlign: "end" }}>
										<react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ color: "black", fontSize: "16px" }} />
									</div>
								</div>
								<antd.Typography.Paragraph style={{ fontSize: "0.8em", marginBottom: 2, }}>Enjoy big discounts on various brand by redeeming your coins.</antd.Typography.Paragraph>
							</antd.Card>)
						}
						{
							has_discount && (<antd.Card className="nector-home-card" style={{ padding: 0, width: "48%", borderRadius: 10, marginRight: 3, cursor: "pointer" }} onClick={this.on_discountlist}>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
									<antd.Typography.Paragraph style={{ fontSize: "1em", marginBottom: 0, fontWeight: "bold" }}>Discount Store</antd.Typography.Paragraph>
									<div style={{ textAlign: "end" }}>
										<react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ color: "black", fontSize: "16px" }} />
									</div>
								</div>
								<antd.Typography.Paragraph style={{ fontSize: "0.8em", marginBottom: 2, }}>Redeem your coins to get big discount on various products.</antd.Typography.Paragraph>
							</antd.Card>)
						}
					</div>
				</div>

				<antd.Card className="nector-card" style={{ padding: 0, width: "unset", margin: 15, marginTop: 5, border: "1px solid #dde", borderRadius: 7 }} bordered={true}>
					{
						(has_user && has_wallet) && (<div style={{ display: "flex", flex: 1, alignItems: "center" }} className="nector-profile-row" onClick={this.on_wallettransactionlist}>
							<div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
								<antd.Typography.Paragraph style={{ fontSize: "1em", marginBottom: 2, display: "block" }}>Your Coins</antd.Typography.Paragraph>
								<div style={{ display: "flex", alignItems: "center" }}>
									<react_game_icons.GiTwoCoins className="nector-icon" style={{ color: "#f5a623", fontSize: "2em", marginRight: 5 }} />
									<antd.Typography.Text style={{ fontSize: "2em", fontWeight: 600, }}>{collection_helper.get_safe_amount(picked_wallet.available)}</antd.Typography.Text>
								</div>
							</div>
							<react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ color: "black" }} />
						</div>)
					}

					{
						has_user && (<div className="nector-profile-row" style={{ cursor: "pointer", display: "flex" }} onClick={this.on_couponlist}>
							<div style={{ flex: 1 }}>
								Your Coupons
							</div>
							<div>
								<react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ color: "black" }} />
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

					<div className="nector-profile-row-bottom" style={{ cursor: "pointer", display: "flex" }} onClick={() => this.on_instructionlist("waystoredeem")}>
						<div style={{ flex: 1 }}>
							Ways To Redeem
						</div>
						<div>
							<react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ color: "black" }} />
						</div>
					</div>
				</antd.Card>

				{(show_loggedout_referral_card) && <div>
					<antd.Card bordered={false} style={{ padding: "0px", minHeight: "10%", margin: "15px", marginTop: 0, borderRadius: 6, border: "1px solid #ddd", boxShadow: "3px 5px 30px -10px rgba(0,0,0,0.2)" }}>
						<div style={{ width: "90%", margin: "0 auto" }}>
							<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
								<antd.Typography.Title level={5} style={{ textAlign: "center", marginBottom: 5, fontSize: "18px", fontWeight: "lighter" }}>Referrals</antd.Typography.Title>
								<antd.Typography.Text style={{ display: "block", textAlign: "center", fontSize: 12, color: "#555" }}>Refer your friends to win exciting rewards, deals & discount coupons!</antd.Typography.Text>
							</div>
						</div>

						{(referralInstructionsDataSource && referralInstructionsDataSource.length > 0) && <div style={{ width: "90%", margin: "0 auto", marginTop: 20, display: "flex", flexDirection: "column", justifyContent: "center" }}>
							{referralInstructionsDataSource.map((instruction, index) => (
								<div key={instruction.name} style={{ display: "flex", marginBottom: 10, paddingBottom: 10, borderBottom: index !== referralInstructionsDataSource.length - 1 ? "1px solid #eee" : "none" }}>
									<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><react_fi_icons.FiGift style={{ fontSize: 24, color: "#444" }} /></div>

									<div style={{ display: "flex", flexDirection: "column", flexGrow: 1, marginLeft: 15 }}>
										<antd.Typography.Title style={{ fontSize: "14px", fontWeight: "lighter", marginBottom: 5 }}>{instruction.name}</antd.Typography.Title>
										<antd.Typography.Text style={{ fontSize: "12px", color: "#444" }}>{instruction.description}</antd.Typography.Text>
									</div>
								</div>
							))}
						</div>}
					</antd.Card>
				</div>}


				{(show_loggedin_referral_card) && <div>
					<antd.Card bordered={false} style={{ padding: "0px", minHeight: "10%", margin: "15px", marginTop: 0, borderRadius: 6, border: "1px solid #ddd", boxShadow: "3px 5px 30px -10px rgba(0,0,0,0.2)" }}>
						<div style={{ width: "90%", margin: "0 auto" }}>
							<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
								<antd.Typography.Title level={5} style={{ textAlign: "center", marginBottom: 5, fontSize: "18px", fontWeight: "lighter" }}>Referrals</antd.Typography.Title>
								<antd.Typography.Text style={{ display: "block", textAlign: "center", fontSize: 12, color: "#555" }}>Refer your friends through your unique code below &amp; get rewarded when they apply it!</antd.Typography.Text>
							</div>

							<div style={{ marginTop: 20 }}>
								<div className="wallet-point-design" style={{ fontSize: "1.2em", padding: "10px 0px", width: "100%" }}>
									<span style={{ display: "inline-block", marginRight: 15 }}>{safe_lead.referral_code}</span>
									
									<react_material_icons.MdContentCopy onClick={() => this.on_referralcopy(safe_lead.referral_code)} style={{ color: "#000", fontSize: "1em", cursor: "pointer" }} />
								</div>
							</div>
						</div>

						<div style={{ width: "90%", margin: "25px auto", marginTop: 15, display: "flex", justifyContent: "space-around", padding: "0px 10px" }}>
							<react_fa_icons.FaFacebook title="Facebook" style={{ fontSize: 24, cursor: "pointer" }} onClick={() => this.on_referral_sharefacebook(websdk_config_options.business_name, safe_lead.referral_code)} />
							
							{/* <react_fa_icons.FaInstagram title="Instagram" style={{ fontSize: 24, cursor: "pointer" }} /> */}
							
							<react_fa_icons.FaTwitter title="Twitter" style={{ fontSize: 24, cursor: "pointer" }} onClick={() => this.on_referral_sharetwitter(websdk_config_options.business_name, safe_lead.referral_code)} />
							
							<react_material_icons.MdEmail title="Email" style={{ fontSize: 24, cursor: "pointer" }} onClick={() => this.on_referral_shareemail(websdk_config_options.business_name, safe_lead.referral_code)} />
						</div>

						{(referralInstructionsDataSource && referralInstructionsDataSource.length > 0) && <div style={{ width: "90%", margin: "0 auto", marginTop: 20, display: "flex", flexDirection: "column", justifyContent: "center" }}>
							{referralInstructionsDataSource.map((instruction, index) => (
								<div key={instruction.name} style={{ display: "flex", marginBottom: 10, paddingBottom: 10, borderBottom: index !== referralInstructionsDataSource.length - 1 ? "1px solid #eee" : "none" }}>
									<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><react_fi_icons.FiGift style={{ fontSize: 24, color: "#444" }} /></div>

									<div style={{ display: "flex", flexDirection: "column", flexGrow: 1, marginLeft: 15 }}>
										<antd.Typography.Title style={{ fontSize: "14px", fontWeight: "lighter", marginBottom: 5 }}>{instruction.name}</antd.Typography.Title>
										<antd.Typography.Text style={{ fontSize: "12px", color: "#444" }}>{instruction.description}</antd.Typography.Text>
									</div>
								</div>
							))}
						</div>}

						{(safe_lead.referred_by_referral_code === null) && <div style={{ width: "95%", margin: "0 auto" }}>
							<antd.Collapse
								defaultActiveKey="temp"
								bordered={false}
								style={{
									marginBottom: "0",
									borderRadius: "7px",
									overflow: "hidden",
									backgroundColor: "#f5f5f5"
								}}
							>
								<antd.Collapse.Panel header="Have a Referral Code?" key="1" className="referral-code-collapse-panel" showArrow={false} extra={<antd_icons.CaretDownFilled />}>
									<antd.Form onFinish={this.on_submit_referralcode}>
										<antd.Form.Item
											name="referred_by_referral_code"
											rules={[{ required: true, message: "Please enter the referral code" }]}
											style={{ marginBottom: 15 }}
										>
											<antd.Input placeholder="Enter the referral code" style={{ borderRadius: 5 }} />
										</antd.Form.Item>

										<antd.Form.Item style={{ marginBottom: 0 }}>
											<antd.Button type="primary" htmlType="submit" size="middle" style={{ width: "100%", borderRadius: 5 }}> Submit </antd.Button>
										</antd.Form.Item>
									</antd.Form>
								</antd.Collapse.Panel>
							</antd.Collapse>
						</div>}
					</antd.Card>
				</div>}
			</div >
		);
	}
}

HomeComponent.propTypes = properties;

export default HomeComponent;