/* eslint-disable no-unused-vars */
//from system
import React from "react";
import ReactRipples from "react-ripples";
import ReactPullToRefresh from "react-simple-pull-to-refresh";
import prop_types from "prop-types";
// import random_gradient from "random-gradient";
// import * as react_font_awesome from "react-icons/fa";
import * as react_feature_icons from "react-icons/fi";

import collection_helper from "../../../helper/collection_helper";
import constant_helper from "../../../helper/constant_helper";
import axios_wrapper from "../../../wrapper/axios_wrapper";

import CouponListComponent from "../coupon/list_component";

import * as antd from "antd";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,
	coupons: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class ProfileComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,

			page: 1,
			limit: 10,
		};

		this.on_wallettransactionlist = this.on_wallettransactionlist.bind(this);
		this.on_voucherlist = this.on_voucherlist.bind(this);
		this.on_tasklist = this.on_tasklist.bind(this);
		this.on_notificationlist = this.on_notificationlist.bind(this);

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

	on_notificationlist() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/notification-list?${search_params.toString()}`);
	}

	on_voucherlist() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/voucher-list?${search_params.toString()}`);
	}

	on_tasklist() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/task-list?${search_params.toString()}`);
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

		// let birthday_text = null, is_today_birthday = false;
		// if (this.props.lead.dob) {
		// 	const birth_moment = collection_helper.convert_to_moment_utc_from_datetime(this.props.lead.dob);
		// 	const current_moment = collection_helper.process_new_moment();
		// 	birth_moment.year(current_moment.year());
		// 	birthday_text = Number(birth_moment.diff(current_moment, "days"));
		// 	if (birthday_text < 0) {
		// 		birthday_text = Number(birth_moment.add(1, "year").diff(current_moment, "days"));
		// 	}

		// 	if (birthday_text == 0) is_today_birthday = true;
		// 	birthday_text = is_today_birthday ? <antd.Typography.Text style={{ fontSize: "1em", color: "#ffffff" }}>Happy Birthday!</antd.Typography.Text> : <antd.Typography.Text>Birthday in {birthday_text} days</antd.Typography.Text>;
		// }

		return (
			<div>
				<antd.Card className="nector-card" style={{ padding: 0, backgroundColor: default_search_params.toolbar_background_color, backgroundImage: default_search_params.toolbar_background_image }} bordered={false}>
					<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
						<div style={{ display: "flex" }}>
							<div style={{ flex: 1 }}>
								{default_search_params.name && <antd.Typography.Text style={{ color: default_search_params.toolbar_color, fontSize: "1.2em", display: "block", }}>{collection_helper.get_limited_text(default_search_params.name, 20, "", "")}</antd.Typography.Text>}
							</div>
							<div>
								<antd.Space>
									<antd.Badge dot>
										<ReactRipples>
											<antd.Avatar icon={<react_feature_icons.FiBell className="nector-icon" style={{ color: default_search_params.toolbar_color }} onClick={this.on_notificationlist} />} />
										</ReactRipples>
									</antd.Badge>
								</antd.Space>
							</div>
						</div>
					</antd.PageHeader>

					<ReactRipples>
						<div onClick={this.on_wallettransactionlist}>
							<antd.Typography.Text style={{ color: default_search_params.toolbar_color, fontSize: "1em", display: "block" }}>Hi, {collection_helper.get_limited_text(this.props.lead.name, 20)}</antd.Typography.Text>
							<antd.Typography.Title style={{ color: default_search_params.toolbar_color, fontSize: "1.7em", display: "block", textDecoration: "underline" }}>{collection_helper.get_safe_amount(picked_wallet.available)} {collection_helper.get_lodash().toUpper((picked_wallet.currency || picked_wallet.devcurrency).currency_code)}</antd.Typography.Title>
						</div>
					</ReactRipples>

				</antd.Card>

				<div className="nector-position-relative">
					<div className="nector-shape nector-overflow-hidden" style={{ color: "#f2f2f2" }}>
						<svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
						</svg>
					</div>
				</div>

				<antd.Layout>
					<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
						<div style={{ margin: 5, textAlign: "center" }} onClick={this.on_wallettransactionlist}>
							<antd.Avatar style={{ padding: 10 }} size={50} src={"https://cdn.nector.io/nector-static/image/nectorwallet.png"} />
							<p style={{ fontSize: 9 }}>wallet points</p>
						</div>
						<div style={{ margin: 5, textAlign: "center" }} onClick={this.on_voucherlist}>
							<antd.Avatar style={{ padding: 10 }} size={50} src={"https://cdn.nector.io/nector-static/image/nectordeal.png"} />
							<p style={{ fontSize: 9 }}>vouchers</p>
						</div>
						<div style={{ margin: 5, textAlign: "center" }}>
							<antd.Avatar style={{ padding: 10 }} size={50} src={"https://cdn.nector.io/nector-static/image/nectorgame.png"} />
							<p style={{ fontSize: 9 }}>games</p>
						</div>
						<div style={{ margin: 5, textAlign: "center" }} onClick={this.on_tasklist}>
							<antd.Avatar style={{ padding: 10 }} size={50} src={"https://cdn.nector.io/nector-static/image/nectortask.png"} />
							<p style={{ fontSize: 9 }}>campaigns</p>
						</div>
						<div style={{ margin: 5, textAlign: "center" }}>
							<antd.Avatar style={{ padding: 10 }} size={50} src={"https://cdn.nector.io/nector-static/image/nectorsurprise.png"} />
							<p style={{ fontSize: 9 }}>surprises</p>
						</div>
					</div>
				</antd.Layout>
				<CouponListComponent {...this.props} is_partial_view={true} />
			</div>
		);
	}
}

ProfileComponent.propTypes = properties;

export default ProfileComponent;