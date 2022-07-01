/* eslint-disable indent */
/* eslint-disable no-unused-vars */
//from system
import React from "react";

import prop_types from "prop-types";
import copy_to_clipboard from "copy-to-clipboard";
import * as react_game_icons from "react-icons/gi";
import * as react_material_icons from "react-icons/md";
import * as react_antd_icons from "react-icons/ai";
import * as react_remix_icons from "react-icons/ri";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";

import * as analytics from "../../analytics";

import * as ViewForm from "../../component_form/nector/profile/view_form";

import * as antd from "antd";

import Button from "./common/button";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	websdkinfos: prop_types.object.isRequired,
	actioninfos: prop_types.object.isRequired,

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
		this.api_merchant_update_leads = this.api_merchant_update_leads.bind(this);

		this.on_wallettransactionlist = this.on_wallettransactionlist.bind(this);
		this.on_couponlist = this.on_couponlist.bind(this);
		this.on_instructionlist = this.on_instructionlist.bind(this);

		this.on_referral = this.on_referral.bind(this);
		this.on_offerlist = this.on_offerlist.bind(this);
		this.on_referralcopy = this.on_referralcopy.bind(this);

		this.on_edit = this.on_edit.bind(this);

		this.get_metadetails_to_fill = this.get_metadetails_to_fill.bind(this);

		this.toggle_drawer = this.toggle_drawer.bind(this);

		this.render_drawer_action = this.render_drawer_action.bind(this);
		this.render_level_icon = this.render_level_icon.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		// eslint-disable-next-line no-undef

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
		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);
		let lead_id = search_params.get("lead_id") || null;
		let customer_id = search_params.get("customer_id") || null;
		const customer_identifier = default_search_params.identifier || null;

		if (collection_helper.validate_not_null_or_undefined(customer_identifier) === true
			&& collection_helper.validate_not_null_or_undefined(customer_id) === true) {
			customer_id = collection_helper.process_key_join([customer_identifier, customer_id], "-");
		}

		const lead_params = customer_id !== null ? { customer_id: customer_id } : {};

		if (collection_helper.validate_not_null_or_undefined(customer_id)) lead_id = lead_id || collection_helper.process_new_uuid();
		else if (collection_helper.validate_is_null_or_undefined(customer_id)
			&& collection_helper.validate_is_null_or_undefined(lead_id)) return null;

		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_GET_LEAD,
			url: url,
			endpoint: `api/v2/merchant/leads/${lead_id}`,
			append_data: false,
			params: {
				...lead_params
			},
		};

		this.props.app_action.api_generic_get(opts);
	}

	api_merchant_update_leads(values) {
		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const lead_id = values._id || this.props.lead._id;
		if (collection_helper.validate_is_null_or_undefined(lead_id) === true) return null;

		const opts = {
			event: constant_helper.get_app_constant().API_SUCCESS_DISPATCH,
			url: url,
			endpoint: `api/v2/merchant/leads/${lead_id}`,
			append_data: false,
			params: {},
			attributes: {
				...collection_helper.process_nullify(collection_helper.get_lodash().omitBy(collection_helper.get_lodash().pick(values, ["name"]), collection_helper.get_lodash().isNil)),
			}
		};

		// should be wrapped inside meta details
		const metadetail = collection_helper.process_nullify(collection_helper.get_lodash().omitBy(collection_helper.get_lodash().pick(values, ["dob", "country", "gender"]), collection_helper.get_lodash().isNil));
		if (metadetail && Object.keys(metadetail).length > 0) {
			opts.attributes = {
				...opts.attributes,
				metadetail: metadetail
			};
		}

		if (values.mobile) {
			opts.attributes = {
				...opts.attributes,
				metadetail: {
					...(opts.attributes.metadetail || {}),
					mobile: values.mobile
				}
			};
		}

		if (values.email) {
			opts.attributes = {
				...opts.attributes,
				metadetail: {
					...(opts.attributes.metadetail || {}),
					email: values.email
				}
			};
		}

		if (Object.keys(opts.attributes).length < 1) return null;

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_put(opts, (result) => {
			if (result.meta.status === "success") {
				this.api_merchant_get_leads();
			}
		});

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_lead_update_request);
	}

	on_edit(e, type = null) {
		this.set_state({ action: type || "view" });
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

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_wallet_view_request);
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

	on_referralcopy(code) {
		collection_helper.show_message("Code copied");
		copy_to_clipboard(code);

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_lead_copy_request, {
				referral_code: code
			});
	}

	on_referral() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/referral?${search_params.toString()}`);
	}

	on_offerlist(e) {
		e.stopPropagation();

		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/offer-list?${search_params.toString()}`);

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_offer_view_request);
	}

	get_metadetails_to_fill(safe_metadetail, safe_lead) {
		if (!safe_metadetail) return;

		const details_to_fill = [];

		if (!safe_lead.name) details_to_fill.push({ name: "name", text: "Enter your name" });
		if (!safe_metadetail.email) details_to_fill.push({ name: "email", text: "Enter your email" });
		if (!safe_metadetail.mobile) details_to_fill.push({ name: "mobile", text: "Enter your mobile number" });
		if (!safe_metadetail.dob) details_to_fill.push({ name: "dob", text: "Enter your birthday" });
		if (!safe_metadetail.country) details_to_fill.push({ name: "country", text: "Enter your country" });

		return details_to_fill;
	}

	toggle_drawer() {
		// eslint-disable-next-line no-unused-vars
		this.setState((state, props) => ({
			drawer_visible: !state.drawer_visible
		}));
	}

	render_drawer_action() {
		if (this.state.action === "view") {
			return <ViewForm.MobileRenderEditProfileItem {...this.props} drawer_visible={this.state.drawer_visible} api_merchant_update_leads={this.api_merchant_update_leads} toggle_drawer={this.toggle_drawer} />;
		} else if (["name", "email", "mobile", "dob", "country"].includes(this.state.action)) {
			return <ViewForm.MobileRenderEditSingleProfileItem name={this.state.action} {...this.props} drawer_visible={this.state.drawer_visible} api_merchant_update_leads={this.api_merchant_update_leads} toggle_drawer={this.toggle_drawer} />;
		}
	}

	render_level_icon(level) {
		switch (level) {
			case "daimond":
				return <react_game_icons.GiCutDiamond className="nector-text" style={{ color: "#9ac5db", margin: "0 4px" }} />;
			case "platinum":
				return <react_remix_icons.RiMedal2Fill className="nector-text" style={{ color: "#CBCAC8 ", margin: "0 4px" }} />;
			case "gold":
				return <react_remix_icons.RiMedal2Fill className="nector-text" style={{ color: "#EEBC1D", margin: "0 4px" }} />;
			case "silver":
				return <react_remix_icons.RiMedal2Fill className="nector-text" style={{ color: "#c0c0c0", margin: "0 4px" }} />;
			default:
				return <react_remix_icons.RiMedal2Fill className="nector-text" style={{ color: "#CD7F32", margin: "0 4px" }} />;
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

		const websdk_config_arr = dataSource.filter(x => x.name === "websdk_config") || [];
		const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
		const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

		const picked_wallet = wallets.length > 0 ? wallets[0] : {
			available: "0",
			reserve: "0",
		};

		const has_user = (safe_lead._id) || false;
		const has_wallet = (wallets.length > 0 && (websdk_config.hide_wallet || false) !== true) || false;
		const safe_name = (safe_lead.name) || "There";

		const details_to_fill = this.get_metadetails_to_fill(safe_metadetail, safe_lead);

		const hide_referral = collection_helper.validate_is_null_or_undefined(this.props.actioninfos?.referral_action?.meta?.execute_after);
		const show_loggedin_referral_card = (has_user && safe_lead.referral_code && !hide_referral) ? true : false;

		return (
			<div style={{ height: "inherit", display: "flex", flexDirection: "column" }}>
				<div style={{ marginBottom: 20 }}>
					<antd.Card className="nector-card" style={{ padding: 0, minHeight: "10%", borderBottom: "1px solid #eeeeee00" }} bordered={false} bodyStyle={{ padding: 20 }}>
						<div style={{ display: "flex", marginBottom: 10 }} onClick={() => this.props.history.goBack()}>
							<h1><react_material_icons.MdKeyboardBackspace className="nector-icon" style={{ background: "#eee", color: "#000", borderRadius: 6 }}></react_material_icons.MdKeyboardBackspace></h1>
						</div>

						<div>
							{(!safe_lead.name) && <h2 style={{ margin: 0 }}>Hello There</h2>}
							{(safe_lead.name) && <h2 style={{ margin: 0 }}>{safe_lead.name?.split(" ")?.map(collection_helper?.get_lodash()?.capitalize)?.join(" ") || collection_helper.get_lodash().capitalize(safe_lead.name)}</h2>}
							{safe_metadetail.email && (
								<p className="nector-subtext" style={{ color: "#555", margin: "3px 0" }}>{safe_metadetail.email}</p>
							)}
							{safe_metadetail.mobile && (
								<p className="nector-subtext" style={{ color: "#555", margin: "3px 0" }}>{safe_metadetail.mobile}</p>
							)}
							<span className="nector-subtext" style={{ display: "inline-flex", alignItems: "center", color: "#222", backgroundColor: "#efefef", padding: "5px 10px", borderRadius: 6, marginTop: 10 }}>
								You are on {this.render_level_icon(safe_lead.badge)} {collection_helper.get_lodash().capitalize(safe_lead.badge || "Bronze")} level
							</span>
							<p className="nector-subtext" style={{ marginTop: 5, color: "black" }}> Improve your rewarding level ✨ by redeeming more offers or buying exciting products 🎁</p>
						</div>

						{(has_user && has_wallet) && (
							<div
								style={{ display: "flex", alignItems: "center", padding: "5px 12px", border: "2px solid #ddd", borderRadius: 6, margin: "20px 0", cursor: "pointer", marginBottom: 0 }}
								onClick={this.on_wallettransactionlist}>
								<div style={{ marginRight: 8 }}>
									<react_game_icons.GiTwoCoins className="nector-subtitle" style={{ color: websdk_config.business_color || "#000" }} />
								</div>

								<div style={{ display: "flex", flex: 1, alignItems: "center" }}>
									<div style={{ marginRight: 10 }}>
										<antd.Typography.Text className="nector-subtitle">{collection_helper.get_safe_amount(picked_wallet.available)}</antd.Typography.Text>
										<antd.Typography.Text className="nector-subtext" style={{ marginLeft: 6, color: "#666" }}>coins</antd.Typography.Text>
									</div>
								</div>

								<div style={{ marginLeft: "auto" }}>
									<Button className="nector-subtext" size="small" style={{ color: "white", borderRadius: 3, marginRight: 15 }} onClick={this.on_offerlist}>Redeem</Button>
									<react_antd_icons.AiOutlineRight className="nector-text" style={{ color: websdk_config.business_color || "#000" }} />
								</div>
							</div>
						)}
					</antd.Card>

					<antd.Card className="nector-card" style={{ padding: 0, minHeight: "10%", borderBottom: "1px solid #eeeeee00" }} bodyStyle={{ padding: "0px 20px" }} bordered={false}>
						<div style={{ border: "1px solid #ddd", borderRadius: 6, padding: "10px 15px" }}>
							{
								has_user && (<div>
									{(details_to_fill && details_to_fill.length > 0) && <p className="nector-subtext" style={{ color: "#777", margin: "3px 0" }}>Fill the below details for a more personalized rewarding experience</p>}

									<div className="nector-profile-row" style={{ cursor: "pointer", display: "flex" }} onClick={this.on_edit}>
										<div style={{ flex: 1 }}>
											<antd.Typography.Text className="nector-text">Edit Your Profile</antd.Typography.Text>
										</div>
										<div>
											<react_antd_icons.AiOutlineRight className="nector-text" style={{ color: websdk_config.business_color || "#000" }} />
										</div>
									</div>
									<div className="nector-profile-row" style={{ cursor: "pointer", display: "flex" }} onClick={this.on_couponlist}>
										<div style={{ flex: 1 }}>
											<antd.Typography.Text className="nector-text">Your Coupons</antd.Typography.Text>
										</div>
										<div>
											<react_antd_icons.AiOutlineRight className="nector-text" style={{ color: websdk_config.business_color || "#000" }} />
										</div>
									</div>
								</div>)
							}
							<div className="nector-profile-row-bottom" style={{ cursor: "pointer", display: "flex" }} onClick={() => this.on_instructionlist("waystoearn")}>
								<div style={{ flex: 1 }}>
									<antd.Typography.Text className="nector-text">Ways To Earn</antd.Typography.Text>
								</div>
								<div>
									<react_antd_icons.AiOutlineRight className="nector-text" style={{ color: websdk_config.business_color || "#000" }} />
								</div>
							</div>
						</div>
					</antd.Card>

					{(show_loggedin_referral_card === true) && <antd.Card className="nector-card" style={{ marginTop: 15, padding: 0, minHeight: "10%", borderBottom: "1px solid #eeeeee00" }} bodyStyle={{ padding: "0px 20px" }} bordered={false}>
						<div style={{ border: "1px solid #ddd", borderRadius: 6, padding: "0px 15px" }}>
							<div className="nector-profile-row-bottom" style={{ cursor: "pointer", display: "flex" }} onClick={() => this.on_referral()}>
								<div style={{ flex: 1 }}>
									<antd.Typography.Text className="nector-text">Refer &amp; Earn</antd.Typography.Text>
								</div>
								<div>
									<react_antd_icons.AiOutlineRight className="nector-text" style={{ color: websdk_config.business_color || "#000" }} />
								</div>
							</div>
						</div>
					</antd.Card>}
				</div>

				<antd.Drawer placement="bottom" onClose={this.toggle_drawer} visible={this.state.drawer_visible} closable={false} contentWrapperStyle={this.state.action !== "view" ? this.state.action === "name" ? { minHeight: 180, height: 180 } : { minHeight: 260, height: 260 } : undefined}>
					{this.render_drawer_action()}
				</antd.Drawer>
			</div>
		);
	}
}

ProfileComponent.propTypes = properties;

export default ProfileComponent;