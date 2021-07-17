//from system
import React from "react";
import ReactRipples from "react-ripples";
import ReactPullToRefresh from "react-simple-pull-to-refresh";
import prop_types from "prop-types";
// import random_gradient from "random-gradient";
import * as react_material_icons from "react-icons/md";

import collection_helper from "../../../helper/collection_helper";
import constant_helper from "../../../helper/constant_helper";
import axios_wrapper from "../../../wrapper/axios_wrapper";


import * as MobileView from "./view/mobile";
import * as DesktopView from "./view/desktop";

import * as antd from "antd";
// import * as antd_icons from "@ant-design/icons";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
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
			loading: false,

			page: 1,
			limit: 10,
		};

		this.api_merchant_list_offers = this.api_merchant_list_offers.bind(this);
		this.api_merchant_create_offerredeems = this.api_merchant_create_offerredeems.bind(this);

		this.process_list_data = this.process_list_data.bind(this);

		this.on_refresh = this.on_refresh.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		this.on_refresh();
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.lead._id != this.props.lead._id) {
			this.api_merchant_list_offers({ page: 1, limit: 10, lead_id: nextProps.lead._id });
		}

		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	api_merchant_list_offers(values) {
		const list_filters = collection_helper.get_lodash().pick(collection_helper.process_objectify_params(this.props.location.search), ["event", "sort", "sort_op", "page", "limit"]);

		this.set_state({ page: list_filters.page || values.page || 1, limit: list_filters.limit || values.limit || 10 });

		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const lead_id = values.lead_id || this.props.lead._id;

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;
		if (collection_helper.validate_is_null_or_undefined(lead_id) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_OFFER_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: values.append_data || false,
			attributes: {
				delegate_attributes: {
					method: "fetch_offers",
					body: {},
					params: {},
					query: {
						page: values.page || 1,
						limit: values.limit || 10,
						sort: values.sort || "created_at",
						sort_op: values.sort_op || "DESC",
						...list_filters,
					},
				},
				regular_attributes: {
					...axios_wrapper.get_wrapper().fetch({
						page: values.page || 1,
						limit: values.limit || 10,
						sort: values.sort || "created_at",
						sort_op: values.sort_op || "DESC",
						...list_filters,
					}, "offer")
				}
			}
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {
			this.set_state({ loading: false });
		});
	}

	api_merchant_create_offerredeems(item) {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		
		const wallets = this.props.lead.wallets || this.props.lead.devwallets || [];
		const picked_wallet = wallets.length > 0 ? wallets[0] : {
			available: "0",
			reserve: "0",
			currency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") },
			devcurrency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") }
		};

		const currency_id = picked_wallet.currency_id;
		const lead_id = this.props.lead._id;

		if (collection_helper.validate_is_null_or_undefined(currency_id) === true
			|| collection_helper.validate_is_null_or_undefined(lead_id) === true
			|| collection_helper.validate_is_null_or_undefined(item._id) === true) return null;

		// try redeeming the offer
		const offeropts = {
			event: constant_helper.get_app_constant().API_SUCCESS_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				delegate_attributes: {
					method: "redeem_offers",
					body: {
						currency_id: currency_id,
						offer_id: item._id,
						lead_id: lead_id
					},
					params: {},
					query: {},
				},
				regular_attributes: {
					...axios_wrapper.get_wrapper().create({
						currency_id: currency_id,
						offer_id: item._id,
						lead_id: lead_id
					}, "offer", "redeem")
				}
			}
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(offeropts, (result) => {
			this.set_state({ loading: false });
			// fetch user again
			if (result && result.data && result.data.offer && result.data.offer.offer_link) {
				window.location = result.data.offer.offer_link;
				// this.props.history.push(result.data.offer.offer_link);
			}
		});
	}

	process_list_data() {
		return (this.props.offers && this.props.offers.items || []).map(item => ({ ...item, key: item._id }));
	}

	on_refresh(force = false) {
		if (force === true) {
			this.set_state({ page: 1, limit: 10 });
			return new Promise(resolve => {
				this.api_merchant_list_offers({ page: 1, limit: 10 });
				return resolve(true);
			});
		}

		if (collection_helper.validate_is_null_or_undefined(this.props.offers) === true
			|| collection_helper.validate_is_null_or_undefined(this.props.offers.items) === true
			|| (collection_helper.validate_not_null_or_undefined(this.props.offers.items) === true && this.props.offers.items.length < 1)) {
			this.api_merchant_list_offers({ page: 1, limit: 10 });
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

		const render_list_item = default_search_params.view === "desktop" ? DesktopView.DesktopRenderListItem : MobileView.MobileRenderListItem;

		const render_load_more = () => {
			if (!this.state.loading) {
				if (Number(count) <= data_source.length) return <div />;
				return (<div style={{ textAlign: "center", padding: "2%" }}>
					<antd.Button onClick={() => this.api_merchant_list_offers({ page: Math.floor(Number(data_source.length) / this.state.limit) + 1, append_data: true })}>Load more</antd.Button>
				</div>);
			} else {
				return <div />;
			}
		};

		return (
			<ReactPullToRefresh
				onRefresh={() => this.on_refresh(true)}
				pullingContent={""}
				refreshingContent={""}>
				<div>
					<antd.Card className="nector-card" style={{ padding: 0, minHeight: "10%", backgroundColor: default_search_params.toolbar_background_color, backgroundImage: default_search_params.toolbar_background_image }} bordered={false}>
						<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
							<ReactRipples>
								<react_material_icons.MdKeyboardBackspace className="nector-icon" style={{ color: default_search_params.toolbar_color }} onClick={() => this.props.history.goBack()}></react_material_icons.MdKeyboardBackspace>
							</ReactRipples>
						</antd.PageHeader>

						<antd.Typography.Title style={{ fontSize: "1.5em", color: default_search_params.toolbar_color }}>games</antd.Typography.Title>
					</antd.Card>

					<div className="nector-position-relative">
						<div className="nector-shape nector-overflow-hidden" style={{ color: "#f2f2f2" }}>
							<svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
							</svg>
						</div>
					</div>

					<div style={{ textAlign: "center" }}>
						<antd.Typography.Text style={{ fontSize: "0.7em" }}>* Pull down to refresh</antd.Typography.Text>
					</div>

					<antd.Layout>
						<antd.List
							locale={{ emptyText: "We did not find anything at the moment, please try after sometime" }}
							dataSource={data_source}
							loading={this.state.loading}
							bordered={false}
							size="small"
							loadMore={render_load_more()}
							renderItem={(item) => render_list_item(item, {...this.props, on_offer: this.api_merchant_create_offerredeems})}
						/>
					</antd.Layout>
				</div>
			</ReactPullToRefresh>
		);
	}
}

OfferListComponent.propTypes = properties;

export default OfferListComponent;