/* eslint-disable no-unused-vars */
//from system
import React from "react";
import ReactRipples from "react-ripples";
import ReactLinkify from "react-linkify";
import * as framer_motion from "framer-motion";
import prop_types from "prop-types";
import * as react_material_icons from "react-icons/md";

import collection_helper from "../../../helper/collection_helper";
import constant_helper from "../../../helper/constant_helper";
import axios_wrapper from "../../../wrapper/axios_wrapper";

import * as MobileView from "./view/mobile";
import * as DesktopView from "./view/desktop";

import * as antd from "antd";
import * as antd_icons from "@ant-design/icons";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,
	deal: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class DealComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
		};

		this.api_merchant_get_deals = this.api_merchant_get_deals.bind(this);
		this.api_merchant_get_leads = this.api_merchant_get_leads.bind(this);
		this.api_merchant_create_coupons = this.api_merchant_create_coupons.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		console.log(this.props.deal);
		// fetch deal if no value
		if (collection_helper.validate_is_null_or_undefined(this.props.deal) === true
			|| Object.keys(this.props.deal).length < 1) {
			this.api_merchant_get_deals();
		}
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	// unmount
	componentWillUnmount() {
		const opts = {
			event: constant_helper.get_app_constant().INTERNAL_DISPATCH,
			append_data: false,
			attributes: {
				key: "deal",
				value: {}
			}
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.internal_generic_dispatch(opts, (result) => {

		});
	}

	api_merchant_get_deals() {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);

		if (collection_helper.validate_is_null_or_undefined(search_params.get("deal_id")) === true) return null;

		// try fetching th deal
		const dealopts = {
			event: constant_helper.get_app_constant().API_MERCHANT_VIEW_DEAL_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				delegate_attributes: {
					method: "get_deals",
					body: {},
					params: {
						id: search_params.get("deal_id")
					},
					query: {},
				},
				regular_attributes: {
					...axios_wrapper.get_wrapper().get(search_params.get("deal_id"), "deal")
				}
			}
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(dealopts, (result) => {
			this.set_state({ loading: false });
		});
	}

	api_merchant_create_coupons() {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);

		const wallets = this.props.lead.wallets || this.props.lead.devwallets || [];
		const picked_wallet = wallets.length > 0 ? wallets[0] : {
			available: "0",
			reserve: "0",
			currency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") },
			devcurrency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") }
		};

		const currency_id = picked_wallet.currency_id;
		const lead_id = this.props.lead._id;
		const deal_id = this.props.deal._id;

		if (collection_helper.validate_is_null_or_undefined(currency_id) === true
			|| collection_helper.validate_is_null_or_undefined(lead_id) === true
			|| collection_helper.validate_is_null_or_undefined(deal_id) === true) return null;

		// try fetching th deal
		const dealopts = {
			event: constant_helper.get_app_constant().API_MERCHANT_VIEW_COUPON_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				delegate_attributes: {
					method: "create_coupons",
					body: {
						currency_id: currency_id,
						deal_id: deal_id,
						lead_id: lead_id
					},
					params: {},
					query: {},
				},
				regular_attributes: {
					...axios_wrapper.get_wrapper().create({
						currency_id: currency_id,
						deal_id: deal_id,
						lead_id: lead_id
					}, "coupon")
				}
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

			if (result && result.data && result.data.item && result.data.item._id) {
				const search_params = collection_helper.process_url_params(this.props.location.search);
				search_params.set("coupon_id", result.data.item._id);
				this.props.history.push(`/nector/coupon?${search_params.toString()}`);
			}
		});
	}

	api_merchant_get_leads() {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);

		const lead_id = search_params.get("lead_id") || null;
		const customer_id = search_params.get("customer_id") || null;
		const email = search_params.get("email") || null;
		const mobile = search_params.get("mobile") || null;

		let method = null;
		if (collection_helper.validate_not_null_or_undefined(lead_id) === true) method = "get_leads";
		else if (collection_helper.validate_not_null_or_undefined(customer_id) === true) method = "get_leads_by_customer_id";
		else if (collection_helper.validate_not_null_or_undefined(email) === true) method = "get_leads_by_email";
		else if (collection_helper.validate_not_null_or_undefined(mobile) === true) method = "get_leads_by_mobile";

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;
		if (collection_helper.validate_is_null_or_undefined(method) === true) return null;

		let lead_params = {};
		let lead_query = {};
		if (method === "get_leads") {
			lead_params = { id: lead_id };
		} else if (method === "get_leads_by_customer_id") {
			lead_query = { customer_id: customer_id };
		} else if (method === "get_leads_by_email") {
			lead_query = { email: email };
		} else if (method === "get_leads_by_mobile") {
			lead_query = { mobile: mobile };
		}

		let regular_attributes = {};
		if (collection_helper.validate_not_null_or_undefined(lead_params.id) === true) {
			regular_attributes = axios_wrapper.get_wrapper().get(lead_id, "lead");
		} else if (collection_helper.validate_not_null_or_undefined(lead_query.customer_id) === true) {
			regular_attributes = axios_wrapper.get_wrapper().get_by("customer_id", customer_id, null, "lead");
		} else if (collection_helper.validate_not_null_or_undefined(lead_query.email) === true) {
			regular_attributes = axios_wrapper.get_wrapper().get_by("email", email, null, "lead");
		} else if (collection_helper.validate_not_null_or_undefined(lead_query.mobile) === true) {
			regular_attributes = axios_wrapper.get_wrapper().get_by("mobile", mobile, null, "lead");
		}

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_GET_LEAD,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			attributes: {
				delegate_attributes: {
					method: method,
					body: {},
					params: {
						...lead_params
					},
					query: {
						...lead_query
					},
				},
				regular_attributes: {
					...regular_attributes
				}
			}
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {

		});
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
		const deal = this.props.deal && Object.keys(this.props.deal).length > 0 ? this.props.deal : {
			name: "",
			sell_price: "0",
			description: "",
			tnc: "",
			category: "",
			provider: "",
			hits: "0",
			count: "0",
			avg_rating: "0",
			expire: null,
			uploads: [{ link: default_search_params.placeholder_image }],
		};

		const uploads = deal.uploads || [];
		const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };

		const wallets = this.props.lead.wallets || this.props.lead.devwallets || [];
		const picked_wallet = wallets.length > 0 ? wallets[0] : {
			available: "0",
			reserve: "0",
			currency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") },
			devcurrency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") }
		};

		const formated_date = collection_helper.convert_to_moment_utc_from_datetime(deal.expire || collection_helper.process_new_moment()).format("MMMM Do, YYYY");
		const is_available = collection_helper.convert_to_moment_utc_from_datetime(deal.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
		// const expires_in = collection_helper.convert_to_moment_utc_from_datetime(task.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

		const expire_text = (is_available && deal.expire) ? `Expires ${formated_date}` : ((is_available && !deal.expire) ? "Deal available" : "Deal expired");

		return (
			<div>
				<antd.Spin spinning={this.state.loading}>

					<antd.Card className="nector-card" style={{ padding: 0, backgroundColor: default_search_params.toolbar_background_color, backgroundImage: default_search_params.toolbar_background_image }} bordered={false}>
						<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
							<ReactRipples>
								<react_material_icons.MdKeyboardBackspace className="nector-icon" style={{ color: default_search_params.toolbar_color }} onClick={() => this.props.history.goBack()}></react_material_icons.MdKeyboardBackspace>
							</ReactRipples>
						</antd.PageHeader>

						<antd.Avatar src={picked_upload.link} />

						<div style={{ marginBottom: 10 }} />

						<antd.Typography.Title style={{ color: default_search_params.toolbar_color, fontSize: "1em" }}>Redeem {Number(deal.hits)} times</antd.Typography.Title>
						<antd.Typography.Paragraph style={{ color: default_search_params.toolbar_color, fontSize: "0.8em" }}>{expire_text}</antd.Typography.Paragraph>
						<div style={{ textAlign: "end" }}>
							<antd.Rate value={Number(deal.avg_rating) || (Number(deal.hits) >= 5 ? 5 : 1)} defaultValue={1} />
						</div>
					</antd.Card>

					<div className="nector-position-relative">
						<div className="nector-shape nector-overflow-hidden" style={{ color: "#f2f2f2" }}>
							<svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
							</svg>
						</div>
					</div>

					<antd.Layout>
						<antd.Typography.Title style={{ fontSize: "2.5em" }}>{deal.name}</antd.Typography.Title>

						<div>
							{
								deal.description && (
									<ReactLinkify componentDecorator={(decoratedHref, decoratedText, key) => (
										<a target="_blank" rel="noopener noreferrer" href={decoratedHref} key={key}>
											{decoratedText}
										</a>
									)}>
										<div style={{ color: "#00000095", fontSize: "0.8em", display: "block", whiteSpace: "pre-wrap" }}>{deal.description}</div>
									</ReactLinkify>
								)
							}

							{
								deal.tnc && (
									<div style={{ borderRadius: 5, margin: "1em 0em 0em 0em" }}>
										<antd.Typography.Text style={{ color: "#000000", fontSize: "1em", display: "block", }}>Terms and conditions</antd.Typography.Text>
										<ReactLinkify componentDecorator={(decoratedHref, decoratedText, key) => (
											<a target="_blank" rel="noopener noreferrer" href={decoratedHref} key={key}>
												{decoratedText}
											</a>
										)}>
											<antd.Typography.Text style={{ color: "#00000095", fontSize: "0.8em", display: "block", whiteSpace: "pre-wrap" }}>{deal.tnc}</antd.Typography.Text>
										</ReactLinkify>
									</div>
								)
							}
						</div>

						{
							deal.created_at && (<div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "2%" }}>
								<framer_motion.motion.div
									whileTap={{ scale: 0.9 }}
									transition={{ type: "spring", stiffness: 300 }}>
									<antd.Button size={"large"} type="default" style={{ width: "100%", background: default_search_params.primary_button_background_color, border: 0, color: default_search_params.primary_button_color, fontWeight: "bold" }} onClick={this.api_merchant_create_coupons}>{(Number(deal.sell_price) / (picked_wallet.currency || picked_wallet.devcurrency).conversion_factor).toFixed((picked_wallet.currency || picked_wallet.devcurrency).place)} {collection_helper.get_lodash().upperCase((picked_wallet.currency || picked_wallet.devcurrency).currency_code)}</antd.Button>
								</framer_motion.motion.div>
							</div>)
						}
					</antd.Layout>
				</antd.Spin>
			</div>
		);
	}
}

DealComponent.propTypes = properties;

export default DealComponent;