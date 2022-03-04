/* eslint-disable no-unused-vars */
//from system
import React from "react";
import prop_types from "prop-types";
import * as react_material_icons from "react-icons/md";
import * as react_game_icons from "react-icons/gi";
import * as react_remix_icons from "react-icons/ri";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";

import axios_wrapper from "../../wrapper/axios_wrapper";

import * as DealViewForm from "../../component_form/nector/deal/view_form";
import * as DiscountViewForm from "../../component_form/nector/discount/view_form";

import * as antd from "antd";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	websdkinfos: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,
	deals: prop_types.object.isRequired,
	discounts: prop_types.object.isRequired,

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

			drawer_visible: false
		};

		this.api_merchant_list_deals = this.api_merchant_list_deals.bind(this);
		this.api_merchant_create_dealredeems = this.api_merchant_create_dealredeems.bind(this);
		this.api_merchant_list_discounts = this.api_merchant_list_discounts.bind(this);
		this.api_merchant_create_discountredeems = this.api_merchant_create_discountredeems.bind(this);

		this.on_profile = this.on_profile.bind(this);
		this.on_wallettransactionlist = this.on_wallettransactionlist.bind(this);
		this.on_discountlist = this.on_discountlist.bind(this);
		this.on_deallist = this.on_deallist.bind(this);
		this.on_couponlist = this.on_couponlist.bind(this);
		this.on_instructionlist = this.on_instructionlist.bind(this);
		this.on_deal = this.on_deal.bind(this);
		this.on_discount = this.on_discount.bind(this);

		this.toggle_drawer = this.toggle_drawer.bind(this);
		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		setTimeout(() => this.set_state({ loading: false }), 1000);
		this.api_merchant_list_deals({});
		this.api_merchant_list_discounts({});
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	api_merchant_list_deals(values) {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_DEAL_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: values.append_data || false,
			attributes: {
				...axios_wrapper.get_wrapper().fetch({
					page: values.page || 1,
					limit: values.limit || 10,
					sort: values.sort || "created_at",
					sort_op: values.sort_op || "DESC"
				}, "deal")
			}
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {
			this.set_state({ loading: false });
		});
	}

	api_merchant_list_discounts(values) {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_DISCOUNT_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: values.append_data || false,
			attributes: {
				...axios_wrapper.get_wrapper().fetch({
					page: values.page || 1,
					limit: values.limit || 10,
					sort: values.sort || "created_at",
					sort_op: values.sort_op || "DESC",
				}, "discount")
			}
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {
			this.set_state({ loading: false });
		});
	}

	api_merchant_create_dealredeems(values) {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		const lead_id = this.props.lead._id;
		const deal_id = values.deal_id;

		if (collection_helper.validate_is_null_or_undefined(lead_id) === true
			|| collection_helper.validate_is_null_or_undefined(deal_id) === true) return null;

		// try fetching the deal
		const dealopts = {
			event: constant_helper.get_app_constant().API_MERCHANT_VIEW_COUPON_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				...axios_wrapper.get_wrapper().create({
					deal_id: deal_id,
					lead_id: lead_id
				}, "deal", "redeem")
			}
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(dealopts, (result) => {
			this.set_state({ loading: false });
			// fetch user again
			if (result && result.data && result.data.item && result.data.item.lead_id) {
				this.api_merchant_get_leads();
			}

			// clear all the coupons
			const opts = {
				event: constant_helper.get_app_constant().INTERNAL_DISPATCH,
				append_data: false,
				attributes: {
					key: "coupons",
					value: {}
				}
			};

			// eslint-disable-next-line no-unused-vars
			this.props.app_action.internal_generic_dispatch(opts, (result) => {

			});

			if (result && result.data && result.data.item && result.data.item._id) {
				const search_params = collection_helper.process_url_params(this.props.location.search);
				search_params.set("coupon_id", result.data.item._id);
				search_params.delete("deal_id");
				this.props.history.push(`/nector/coupon?${search_params.toString()}`);
			}
		});
	}

	api_merchant_create_discountredeems(values) {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		const lead_id = this.props.lead._id;
		const discount_id = values.discount_id;
		const amount = collection_helper.validate_is_number(values.amount) ? values.amount : undefined;

		if (collection_helper.validate_is_null_or_undefined(lead_id) === true
			|| collection_helper.validate_is_null_or_undefined(discount_id) === true) return null;

		// try fetching the discount
		const discountopts = {
			event: constant_helper.get_app_constant().API_MERCHANT_VIEW_COUPON_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				...axios_wrapper.get_wrapper().create({
					discount_id: discount_id,
					lead_id: lead_id,
					amount: amount,
				}, "discount", "redeem")
			}
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(discountopts, (result) => {
			this.set_state({ loading: false });
			// fetch user again
			if (result && result.data && result.data.item && result.data.item.lead_id) {
				this.api_merchant_get_leads();
			}

			// clear all the coupons
			const opts = {
				event: constant_helper.get_app_constant().INTERNAL_DISPATCH,
				append_data: false,
				attributes: {
					key: "coupons",
					value: {}
				}
			};

			// eslint-disable-next-line no-unused-vars
			this.props.app_action.internal_generic_dispatch(opts, (result) => {

			});

			if (result && result.data && result.data.item && result.data.item._id) {
				const search_params = collection_helper.process_url_params(this.props.location.search);
				search_params.set("coupon_id", result.data.item._id);
				search_params.delete("discount_id");
				this.props.history.push(`/nector/coupon?${search_params.toString()}`);
			}
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

	on_deallist() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/deal-list?${search_params.toString()}`);
	}

	on_discountlist() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/discount-list?${search_params.toString()}`);
	}

	on_couponlist() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/coupon-list?${search_params.toString()}`);
	}

	on_instructionlist(type) {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/${type}-list?${search_params.toString()}`);
	}

	on_deal(record) {
		this.set_state({ action_item: record, action: "view_deal" });
		this.toggle_drawer();
	}

	on_discount(record) {
		this.set_state({ action_item: record, action: "view_discount" });
		this.toggle_drawer();
	}

	render_drawer_action() {
		if (this.state.action === "view_deal") {
			return <DealViewForm.MobileRenderViewItem {...this.props} drawer_visible={this.state.drawer_visible} action_item={this.state.action_item} api_merchant_create_dealredeems={this.api_merchant_create_dealredeems} toggle_drawer={this.toggle_drawer} />;
		} else if (this.state.action === "view_discount") {
			return <DealViewForm.MobileRenderViewItem {...this.props} drawer_visible={this.state.drawer_visible} action_item={this.state.action_item} api_merchant_create_dealredeems={this.api_merchant_create_dealredeems} toggle_drawer={this.toggle_drawer} />;
		}
	}

	toggle_drawer() {
		// eslint-disable-next-line no-unused-vars
		this.setState((state, props) => ({
			drawer_visible: !state.drawer_visible
		}));
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
		const safe_name = (this.props.lead && this.props.lead.name) || "There";

		return (
			<div style={{ height: "inherit", display: "flex", flexDirection: "column" }}>
				<div style={{ backgroundColor: "#1a1a40", paddingBottom: 35, borderRadius: "0 0 8px 8px" }}>
					<div style={{ display: "flex", justifyContent: "flex-end", padding: 20 }}>
						{has_user && <p style={{ color: "white", cursor: "pointer" }} onClick={this.on_couponlist}>Your Coupons</p>}

						{has_user && <p style={{ color: "white", cursor: "pointer", marginLeft: 20 }} onClick={() => this.on_profile()}>Profile</p>}

						{(has_user && has_wallet) && <div style={{ marginLeft: 20, alignSelf: "start", padding: "0 8px", borderRadius: 10, backgroundColor: "white", display: "flex", alignItems: "center", cursor: "pointer" }} onClick={this.on_wallettransactionlist}>
							<react_game_icons.GiTwoCoins className="nector-icon" style={{ color: "#f5a623", fontSize: "1.5em", marginRight: 5 }} />
								
							<antd.Typography.Text style={{ fontWeight: 600 }}>{collection_helper.get_safe_amount(picked_wallet.available)}</antd.Typography.Text>
						</div>}
					</div>

					<div style={{ padding: 20, paddingTop: 10 }}>
						<div>
							<antd.Typography.Text style={{ fontSize: "2em", marginBottom: 2, color: "white" }}>👋 Hello, {collection_helper.get_lodash().capitalize(collection_helper.get_limited_text(safe_name, 12, "", "")).split(" ")[0]} </antd.Typography.Text>
						</div>

						<div>
							<antd.Typography.Text style={{ marginBottom: 2, color: "white", fontSize: 13 }}>Here is your {collection_helper.get_limited_text(websdk_config_options.business_name || "rewards", 20, "", "")} dashboard! Use the coins you are rewarded to redeem exclusive deals &amp; discounts!</antd.Typography.Text>
						</div>
					</div>
				</div>

				<div style={{ margin: "0 15px", marginTop: -25, borderRadius: 5, backgroundColor: "white", padding: 15, boxShadow: "0px 4px 19px -4px rgba(0,0,0,0.27)" }}>
					<antd.Typography.Title style={{ fontSize: "14px", fontWeight: 300 }}>Exclusive Deals From {collection_helper.get_limited_text(websdk_config_options.business_name || "rewards", 20, "", "")}</antd.Typography.Title>
					<div style={{ display: "flex", flex: 1, flexWrap: "wrap", marginTop: 15 }}>
						{
							has_deal && (<DealViewForm.DealSwiperComponent {...this.props} on_deal={this.on_deal} />)
						}
					</div>

					<div>
						<antd.Button style={{ width: "100%", backgroundColor: "#1a1a40", borderRadius: 5, color: "white", marginTop: 15, height: 36 }} onClick={this.on_deallist}>View All Deals</antd.Button>
					</div>
				</div>

				<div style={{ margin: "15px", borderRadius: 5, backgroundColor: "white", padding: 15, boxShadow: "0px 4px 19px -4px rgba(0,0,0,0.27)" }}>
					<antd.Typography.Title style={{ fontSize: "14px", fontWeight: 300 }}>Exclusive Discounts From {collection_helper.get_limited_text(websdk_config_options.business_name || "rewards", 20, "", "")}</antd.Typography.Title>
					<div style={{ display: "flex", flex: 1, flexWrap: "wrap", marginTop: 15 }}>
						{
							has_discount && (<DiscountViewForm.DiscountSwiperComponent {...this.props} on_discount={this.on_discount} />)
						}
					</div>

					<div>
						<antd.Button style={{ width: "100%", backgroundColor: "#1a1a40", borderRadius: 5, color: "white", marginTop: 15, height: 36 }} onClick={this.on_discountlist}>View All Discounts</antd.Button>
					</div>
				</div>

				<div style={{ margin: "15px", marginTop: 0, borderRadius: 5, backgroundColor: "white", padding: 15, boxShadow: "0px 4px 19px -4px rgba(0,0,0,0.27)" }}>
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

					<div className="nector-profile-row-bottom" style={{ cursor: "pointer", display: "flex" }} onClick={() => this.on_instructionlist("waystoearn")}>
						<div style={{ flex: 1 }}>
							Ways To Earn
						</div>
						<div>
							<react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ color: "black" }} />
						</div>
					</div>
				</div>

				<antd.Drawer placement="bottom" onClose={this.toggle_drawer} visible={this.state.drawer_visible} closable={false}>
					{this.render_drawer_action()}
				</antd.Drawer>
			</div >
		);
	}
}

HomeComponent.propTypes = properties;

export default HomeComponent;