/* eslint-disable no-unused-vars */
//from system
import React from "react";
import ReactRipples from "react-ripples";
import prop_types from "prop-types";
import * as react_material_icons from "react-icons/md";
import * as react_game_icons from "react-icons/gi";

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
		this.on_deallist = this.on_deallist.bind(this);
		this.on_couponlist = this.on_couponlist.bind(this);
		this.on_instructionlist = this.on_instructionlist.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
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
	}

	on_couponlist() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/coupon-list?${search_params.toString()}`);
	}

	on_instructionlist() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/instruction-list?${search_params.toString()}`);
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
		const safe_name = (this.props.lead && this.props.lead.name) || "There";

		return (
			<div style={{ height: "inherit", display: "flex", flexDirection: "column" }}>
				<div>
					<div style={{ margin: 10 }} />
					<antd.Card className="nector-card" style={{ padding: 0 }} bordered={false}>
						<antd.Typography.Text style={{ fontSize: "2.5em", fontWeight: 600, }}>{websdk_config_options.business_name || "Rewards"} {constant_helper.get_setting_constant().EMOJIMAP.MONTH[collection_helper.get_moment()().format("M")]} </antd.Typography.Text>
					</antd.Card>
				</div>

				<div style={{ margin: 5 }} />

				<antd.Card className="nector-card" style={{ padding: 0, width: "unset", margin: 10 }} bordered={true}>
					<div style={{ display: "flex", flex: 1, alignItems: "center" }} onClick={() => has_user && this.on_profile()}>
						<div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
							<antd.Typography.Text style={{ fontSize: "1.5em", fontWeight: 600, marginBottom: 2, display: "block" }}>Hello, {collection_helper.get_lodash().capitalize(collection_helper.get_limited_text(safe_name, 12, "", "..."))} 👋 </antd.Typography.Text>
							<antd.Typography.Text style={{ fontSize: "1em", marginBottom: 2, }}>Welcome Back!</antd.Typography.Text>
						</div>
						{
							has_user && <react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ color: "black" }} />
						}
					</div>
				</antd.Card>

				<antd.Card className="nector-card" style={{ padding: 0, width: "unset", margin: 10 }} bordered={true}>
					{
						has_user && (<div style={{ display: "flex", flex: 1, alignItems: "center" }} className="nector-profile-row" onClick={this.on_wallettransactionlist}>
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

					<div className="nector-profile-row" style={{ cursor: "pointer", display: "flex" }} onClick={this.on_instructionlist}>
						<div style={{ flex: 1 }}>
							Ways To Earn
						</div>
						<div>
							<react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ color: "black" }} />
						</div>
					</div>

					<div className="nector-profile-row-bottom" style={{ cursor: "pointer", display: "flex" }} onClick={this.on_instructionlist}>
						<div style={{ flex: 1 }}>
							Ways To Redeem
						</div>
						<div>
							<react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ color: "black" }} />
						</div>
					</div>
				</antd.Card>

				<antd.Card className="nector-dealstore-card" style={{ padding: 10, width: "unset", margin: 10, color: "#FFF", textAlign: "center", borderRadius: 10 }} bordered={true} onClick={this.on_deallist}>
					<div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
						<antd.Typography.Text style={{ color: "#FFF", fontSize: "1.5em", fontWeight: 600, marginRight: 10 }}>Deal Store </antd.Typography.Text>
						<react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ fontSize: "1.5em" }} />
					</div>
				</antd.Card>

				<antd.Card className="nector-marketplace-card" style={{ padding: 10, width: "unset", margin: 10, color: "#FFF", textAlign: "center", borderRadius: 10 }} bordered={true}>
					<antd.Typography.Text style={{ color: "#FFF" }}> <b style={{ fontSize: "1.5em", fontWeight: 800, }}> Marketplace </b> <br /> <span style={{ fontSize: "1em" }}>Coming Soon!</span>  </antd.Typography.Text>
				</antd.Card>

				<div style={{ padding: 10, textAlign: "center" }}>
					<p style={{ color: "transparent" }}>Rewards Are Powered By Nector</p>
				</div>
			</div>
		);
	}
}

HomeComponent.propTypes = properties;

export default HomeComponent;