/* eslint-disable no-unused-vars */
//from system
import React from "react";
// import ReactPullToRefresh from "react-simple-pull-to-refresh";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import prop_types from "prop-types";
import * as react_material_icons from "react-icons/md";
import * as react_game_icons from "react-icons/gi";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";
import axios_wrapper from "../../wrapper/axios_wrapper";

import * as ViewForm from "../../component_form/nector/offer/view_form";

import * as antd from "antd";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	offerbrandinfos: prop_types.object.isRequired,
	offercategoryinfos: prop_types.object.isRequired,
	websdkinfos: prop_types.object.isRequired,

	entity: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,
	offers: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class OfferListComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			drawer_visible: false,

			action: "view",
			action_item: null,

			loading: false,

			category: "All",

			page: 1,
			limit: 10,
		};

		this.api_merchant_list_offers = this.api_merchant_list_offers.bind(this);
		this.api_merchant_get_leads = this.api_merchant_get_leads.bind(this);
		this.api_merchant_create_offerredeems = this.api_merchant_create_offerredeems.bind(this);

		this.process_list_data = this.process_list_data.bind(this);

		this.on_refresh = this.on_refresh.bind(this);

		this.on_wallettransactionlist = this.on_wallettransactionlist.bind(this);
		this.on_offer = this.on_offer.bind(this);
		this.on_filter = this.on_filter.bind(this);

		this.toggle_drawer = this.toggle_drawer.bind(this);

		this.render_drawer_action = this.render_drawer_action.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		// eslint-disable-next-line no-undef


		this.on_refresh();

	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.lead._id != this.props.lead._id) {
			this.api_merchant_list_offers({ page: 1, limit: 10, category: this.state.category });
		}

		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	api_merchant_list_offers(values) {
		let list_filters = collection_helper.get_lodash().pick(collection_helper.process_objectify_params(this.props.location.search), ["sort", "sort_op", "page", "limit"]);

		// add category and visibility
		list_filters = { ...list_filters, ...collection_helper.get_lodash().pick(values, ["category", "brand", "visibility"]) };

		// remove if it has All
		if (!list_filters["brand"] || list_filters["brand"] === "all" || list_filters["brand"] === "All") delete list_filters["brand"];
		if (!list_filters["category"] || list_filters["category"] === "all" || list_filters["category"] === "All") delete list_filters["category"];

		this.set_state({ page: list_filters.page || values.page || 1, limit: list_filters.limit || values.limit || 10 });

		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_OFFER_DISPATCH,
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
					...list_filters,
				}, "offer")
			}
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {
			this.set_state({ loading: false });
		});
	}

	api_merchant_create_offerredeems(values) {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		const lead_id = this.props.lead._id;
		const offer_id = values.offer_id;
		const step = values.step || 1;
		const coin_amount = values.coin_amount || null;
		const fiat_value = values.fiat_value || null;
		const fiat_class = values.fiat_class || null;

		if (collection_helper.validate_is_null_or_undefined(lead_id) === true
			|| collection_helper.validate_is_null_or_undefined(offer_id) === true) return null;

		// try fetching the offer
		const offeropts = {
			event: constant_helper.get_app_constant().API_MERCHANT_VIEW_COUPON_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				...axios_wrapper.get_wrapper().create({
					offer_id: offer_id,
					lead_id: lead_id,
					step: step,
				}, "offer", "redeem")
			}
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(offeropts, (result) => {
			this.set_state({ loading: false });
			// fetch user again
			if (result && result.data && result.data.coupon && result.data.coupon.lead_id) {
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

			if (result && result.data && result.data.coupon && result.data.coupon._id) {
				const search_params = collection_helper.process_url_params(this.props.location.search);
				search_params.set("coupon_id", result.data.coupon._id);
				search_params.delete("offer_id");
				this.props.history.push(`/nector/coupon?${search_params.toString()}`);
			}
		});

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_offer_redeem_request, {
				offer_id: offer_id,
				offer_coinamount: coin_amount,
				offer_fiatvalue: fiat_value,
				offer_fiatclass: fiat_class,
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

	process_list_data() {
		return (this.props.offers && this.props.offers.items || []).map(item => ({ ...item, key: item._id }));
	}

	on_refresh(force = false) {
		if (force === true) {
			// to load the partial component
			this.set_state({ page: 1, limit: 10 });
			return new Promise(resolve => {
				this.api_merchant_list_offers({ page: 1, limit: 10, category: this.state.category });
				return resolve(true);
			});
		}

		if (collection_helper.validate_is_null_or_undefined(this.props.offers) === true
			|| collection_helper.validate_is_null_or_undefined(this.props.offers.items) === true
			|| (collection_helper.validate_not_null_or_undefined(this.props.offers.items) === true && this.props.offers.items.length < 1)) {
			this.api_merchant_list_offers({ page: 1, limit: 10, category: this.state.category });
		}
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

	// eslint-disable-next-line no-unused-vars
	on_offer(record) {
		this.set_state({ action_item: record, action: "view" });
		this.toggle_drawer();

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_offer_open_request, {
				offer_id: record._id
			});
	}

	// eslint-disable-next-line no-unused-vars
	on_filter(record) {
		if (record === this.state.category) return;

		this.set_state({ category: record });
		this.api_merchant_list_offers({ category: record });
	}

	toggle_drawer() {
		// eslint-disable-next-line no-unused-vars
		this.setState((state, props) => ({
			drawer_visible: !state.drawer_visible
		}));
	}

	render_drawer_action() {
		if (this.state.action === "view") {
			return <ViewForm.MobileRenderViewItem {...this.props} drawer_visible={this.state.drawer_visible} action_item={this.state.action_item} api_merchant_create_offerredeems={this.api_merchant_create_offerredeems} toggle_drawer={this.toggle_drawer} />;
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
		const data_source = this.process_list_data();
		const count = (this.props.offers && this.props.offers.count || 0);

		const dataSource = (this.props.websdkinfos && this.props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));

		const websdk_config = dataSource.filter(x => x.name === "websdk_config") || [];
		const websdk_config_options = websdk_config.length > 0 ? websdk_config[0].value : {};

		const allcategories = (this.props.offercategoryinfos && this.props.offercategoryinfos.items || []).map(item => item.category);
		const categoryitem = (this.props.websdkinfos && this.props.websdkinfos.items || []).filter(item => item.name === "disabled_category");
		const blacklistedcategories = categoryitem.length > 0 ? categoryitem[0].value : [];
		const allowedcategories = collection_helper.get_lodash().difference(allcategories, blacklistedcategories);

		const wallets = this.props.lead.wallets || this.props.lead.devwallets || [];

		const picked_wallet = wallets.length > 0 ? wallets[0] : {
			available: "0",
			reserve: "0",
		};

		const render_load_more = () => {
			if (!this.state.loading) {
				if (Number(count) <= data_source.length) return <div />;
				return (<div style={{ textAlign: "center", padding: "2%", marginTop: 5, marginBottom: 5 }}>
					<antd.Button type="primary" style={{ fontSize: "1em", }} onClick={() => this.api_merchant_list_offers({ page: Math.floor(Number(data_source.length) / this.state.limit) + 1, append_data: true, category: this.state.category })}>Load more</antd.Button>
				</div>);
			} else {
				return <div />;
			}
		};

		const has_wallet = (wallets.length > 0 && (websdk_config_options.hide_wallet || false) !== true) || false;

		return (
			<div>
				{/* <ReactPullToRefresh onRefresh={() => this.on_refresh(true)} pullingContent={""} refreshingContent={""}> */}
				<div>
					<antd.Card className="nector-card" style={{ padding: 0, minHeight: "10%", borderBottom: "1px solid #eeeeee00" }} bordered={false}>
						<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
							<div style={{ display: "flex" }} onClick={() => this.props.history.goBack()}>
								<h2><react_material_icons.MdKeyboardBackspace className="nector-icon" style={{ background: "#eee", color: "#000", borderRadius: 10 }}></react_material_icons.MdKeyboardBackspace></h2>
							</div>
						</antd.PageHeader>

						<div style={{ display: "flex", flex: 1, alignItems: "center" }}>
							<div style={{ display: "flex", flex: 1 }}><h3><b>Offer Store</b></h3></div>
							<div>
								{
									(has_wallet) && (<div className="wallet-point-design" onClick={this.on_wallettransactionlist}>
										<react_game_icons.GiTwoCoins className="nector-icon" style={{ color: "#f5a623" }} /> {collection_helper.get_safe_amount(picked_wallet.available)}
									</div>)
								}
							</div>
						</div>

						<div>
							<div style={{ margin: 10 }} />
							<ScrollMenu>
								{["All", ...allowedcategories].map(category => {
									return (<div key={category} className="nector-category-card" style={this.state.category === category ? { borderColor: "#000" } : {}} onClick={() => this.on_filter(category)}>
										<antd.Typography.Text style={{ whiteSpace: "nowrap", fontSize: "1em", fontWeight: "bold" }}>{collection_helper.get_lodash().capitalize(category)}</antd.Typography.Text>
									</div>
									);
								})}
							</ScrollMenu>
						</div>

					</antd.Card>

					<antd.Layout>
						{/* <div style={{ textAlign: "center" }}>
								<antd.Typography.Text style={{ fontSize: "0.7em" }}>* Pull down to refresh</antd.Typography.Text>
							</div> */}


						<antd.List
							// grid={{ gutter: 8, xs: 2, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
							locale={{ emptyText: "We did not find anything at the moment, please try after sometime in case experiencing any issues." }}
							dataSource={data_source}
							loading={this.state.loading}
							bordered={false}
							size="small"
							loadMore={render_load_more()}
							renderItem={(item) => ViewForm.MobileRenderListItem(item, { ...this.props, on_offer: this.on_offer })}
						/>
					</antd.Layout>
				</div>
				{/* </ReactPullToRefresh> */}

				<antd.Drawer placement="bottom" onClose={this.toggle_drawer} visible={this.state.drawer_visible} closable={false}>
					{this.render_drawer_action()}
				</antd.Drawer>
			</div>
		);
	}
}

OfferListComponent.propTypes = properties;

export default OfferListComponent;