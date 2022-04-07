/* eslint-disable no-unused-vars */
//from system
import React from "react";
import prop_types from "prop-types";
import * as react_material_icons from "react-icons/md";
import * as react_game_icons from "react-icons/gi";
import * as react_remix_icons from "react-icons/ri";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";

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
class HomeComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,

			page: 1,
			limit: 10,
		};

		this.on_profile = this.on_profile.bind(this);
		this.on_wallettransactionlist = this.on_wallettransactionlist.bind(this);
		this.on_discountlist = this.on_discountlist.bind(this);
		this.on_deallist = this.on_deallist.bind(this);
		this.on_couponlist = this.on_couponlist.bind(this);
		this.on_instructionlist = this.on_instructionlist.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		// eslint-disable-next-line no-undef


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

		const safe_name = (this.props.lead && this.props.lead.name) || "There";


		const show_hero_card = !has_user && (websdk_config_options.login_link || websdk_config_options.signup_link);

		return (
			<div style={{ height: "inherit", display: "flex", flexDirection: "column" }}>
				<div>
					<div style={{ padding: "20px 20px 0px 20px", paddingBottom: show_hero_card ? "60px" : "25px", backgroundColor: "#000", backgroundImage: `linear-gradient(131deg, #000 75%, ${websdk_config_options.business_color || "#000"} 100%)`, borderRadius: show_hero_card ? "0px" : "0 0 10px 10px" }}>
						<div style={{ flex: 1, paddingTop: 20 }}>
							<antd.Typography.Text style={{ display: "block", color: "white" }}>Hi {collection_helper.get_lodash().capitalize(collection_helper.get_limited_text(safe_name, 12, "", "")).split(" ")[0]},</antd.Typography.Text>
							<antd.Typography.Text style={{ fontSize: "1.75em", marginBottom: 2, color: "white" }}>Welcome to {websdk_config_options.business_name || "Rewards Dashboard"}</antd.Typography.Text>
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
					{(has_user) && <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "50px", height: "50px", borderRadius: "50%", border: "1px solid #eee", marginLeft: "auto", marginTop: "-25px", backgroundColor: "white", boxShadow: "2px 2px 15px -4px rgba(0,0,0,0.31)" }}>
						<antd_icons.UserOutlined style={{ color: "black", fontSize: "22px" }} onClick={() => has_user && this.on_profile()} />
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
			</div >
		);
	}
}

HomeComponent.propTypes = properties;

export default HomeComponent;