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
	lead: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class HomeComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,

			page: 1,
			limit: 10,
		};

		this.on_wallettransactionlist = this.on_wallettransactionlist.bind(this);
		this.on_deallist = this.on_deallist.bind(this);
		this.on_couponlist = this.on_couponlist.bind(this);
		this.on_instructionlist = this.on_instructionlist.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		//
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	// unmount
	componentWillUnmount() {

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

		const picked_wallet = wallets.length > 0 ? wallets[0] : {
			available: "0",
			reserve: "0",
			currency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") },
			devcurrency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") }
		};

		const metadetail = this.props.lead.metadetail || {
			gender: "female",
			dob: null
		};

		return (
			<div style={{ height: "inherit", display: "flex", flexDirection: "column" }}>
				<antd.Card className="nector-card" style={{ padding: 0 }} bordered={false}>
					<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
						<div style={{ display: "flex" }}>
							<div style={{ flex: 1 }}>
								<h3><b>Hello, {(this.props.lead && this.props.lead.name) ? collection_helper.get_lodash().capitalize(collection_helper.get_limited_text(this.props.lead.name, 12, "", "...")) : "There"} 👋 </b></h3>
								<h1><b>Welcome Back!</b></h1>
							</div>
							{
								(this.props.lead && this.props.lead._id) && (<div style={{ cursor: "pointer" }}>
									<antd.Avatar style={{ background: "#eeeeee", borderRadius: 50, height: 50, width: 50, padding: 5 }} src={metadetail.gender === "male" ? "https://cdn.nector.io/nector-static/image/maleavatar.png" : "https://cdn.nector.io/nector-static/image/femaleavatar.png"} />
								</div>)
							}
						</div>
					</antd.PageHeader>

					<div>
						{
							wallets.length > 0 && (<div className="wallet-point-design" onClick={this.on_wallettransactionlist}>
								<react_game_icons.GiTwoCoins className="nector-icon" style={{ color: "#000" }} /> {collection_helper.get_safe_amount(picked_wallet.available)}
							</div>)
						}
					</div>

				</antd.Card>

				<div style={{ display: "flex", flex: 1, flexDirection: "column", margin: "0px 14px" }}>

					<div style={{ flex: 1 }}>
						<img src={"https://cdn.nector.io/nector-static/image/hometrophy.png"} width="100%" />
					</div>
					<div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
						<div>
							<antd.Space>
								{
									(this.props.lead && this.props.lead._id) && (<div style={{ background: "#000", padding: 10, color: "#fff", paddingLeft: 10, paddingRight: 10, borderRadius: 5, cursor: "pointer" }} onClick={this.on_couponlist}>
										<antd_icons.QrcodeOutlined style={{ fontSize: 20 }} />
									</div>)
								}

								<div style={{ background: "#000", padding: 10, color: "#fff", paddingLeft: 20, paddingRight: 20, borderRadius: 5, cursor: "pointer" }} onClick={this.on_deallist}>
									<span><b>Deal Store </b> <react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" /></span>
								</div>
							</antd.Space>
						</div>
						<div style={{ padding: 10, textAlign: "center", cursor: "pointer" }} onClick={this.on_instructionlist}>
							<h4>Ways to earn points and win exclusive deals on partner brands <react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ color: "#000" }} /></h4>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

HomeComponent.propTypes = properties;

export default HomeComponent;