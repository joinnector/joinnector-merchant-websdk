/* eslint-disable no-unused-vars */
//from system
import React from "react";
import ReactLinkify from "react-linkify";
import prop_types from "prop-types";

import * as antd from "antd";
import * as react_material_icons from "react-icons/md";
import * as react_game_icons from "react-icons/gi";
import * as react_bs_icons from "react-icons/bs";

import * as view_form from "../../component_form/nector/offer/view_form";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";

import * as analytics from "../../analytics";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	websdkinfos: prop_types.object.isRequired,

	entity: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,
	offer: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class OfferComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			selected_coin_amount: 0
		};

		this.api_merchant_get_leads = this.api_merchant_get_leads.bind(this);
		this.api_merchant_create_offerredeems = this.api_merchant_create_offerredeems.bind(this);
		this.api_merchant_get_offers = this.api_merchant_get_offers.bind(this);

		this.on_wallettransactionlist = this.on_wallettransactionlist.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		// eslint-disable-next-line no-undef

		// fetch offer if no value
		if (collection_helper.validate_is_null_or_undefined(this.props.offer) === true
			|| Object.keys(this.props.offer).length < 1) {
			this.api_merchant_get_offers();
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
				key: "offer",
				value: {}
			}
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.internal_generic_dispatch(opts);
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

	api_merchant_get_offers() {
		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const search_params = collection_helper.process_url_params(this.props.location.search);
		if (collection_helper.validate_is_null_or_undefined(search_params.get("offer_id")) === true) return null;

		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_GET_OFFER_DISPATCH,
			url: url,
			endpoint: `api/v2/merchant/offers/${search_params.get("offer_id")}`,
			append_data: false,
			params: {

			},
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_get(opts, (result) => {
			this.set_state({ loading: false });
		});
	}

	api_merchant_create_offerredeems(values) {
		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const lead_id = values.lead_id || this.props.lead._id;
		const offer_id = values.offer_id;
		const step = values.step || 1;

		if (collection_helper.validate_is_null_or_undefined(lead_id) === true
			|| collection_helper.validate_is_null_or_undefined(offer_id) === true
			|| collection_helper.validate_is_null_or_undefined(step) === true) return null;

		const opts = {
			event: constant_helper.get_app_constant().API_SUCCESS_DISPATCH,
			url: url,
			endpoint: "api/v2/merchant/offerredeems",
			append_data: false,
			params: {},
			attributes: {
				offer_id: offer_id,
				lead_id: lead_id,
				step: step,
			}
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {
			this.set_state({ loading: false });
			// fetch user again
			if (result && result.data && result.data.coupon && result.data.coupon.lead_id) {
				this.api_merchant_get_leads();

				collection_helper.window_post_message(constant_helper.get_app_constant().WINDOW_MESSAGE_EVENTS.REFRESH_WALLET);
			}

			// clear all the wallettransaction
			const wallettransactionopts = {
				event: constant_helper.get_app_constant().INTERNAL_DISPATCH,
				append_data: false,
				attributes: {
					key: "wallettransactions",
					value: {}
				}
			};

			// eslint-disable-next-line no-unused-vars
			this.props.app_action.internal_generic_dispatch(wallettransactionopts);

			// clear all the coupons
			const couponopts = {
				event: constant_helper.get_app_constant().INTERNAL_DISPATCH,
				append_data: false,
				attributes: {
					key: "coupons",
					value: {}
				}
			};

			// eslint-disable-next-line no-unused-vars
			this.props.app_action.internal_generic_dispatch(couponopts);

			if (result && result.data && result.data.coupon && result.data.coupon._id) {
				const search_params = collection_helper.process_url_params(this.props.location.search);
				search_params.set("coupon_id", result.data.coupon._id);
				search_params.delete("offer_id");
				this.props.history.push(`/nector/coupon?${search_params.toString()}`);
			}
		});

		const coin_amount = values.coin_amount || null;
		const fiat_value = values.fiat_value || null;
		const fiat_class = values.fiat_class || null;

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_offer_redeem_request, {
				offer_id: offer_id,
				offer_coinamount: coin_amount,
				offer_fiatvalue: fiat_value,
				offer_fiatclass: fiat_class,
			});
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

	set_state(values) {
		// eslint-disable-next-line no-unused-vars
		this.setState((state, props) => ({
			...state,
			...values
		}));
	}

	render() {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		const websdkConfigDataSource = (this.props.websdkinfos && this.props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));
		const websdk_config_arr = websdkConfigDataSource.filter(x => x.name === "websdk_config") || [];
		const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
		const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

		const wallets = this.props.lead.wallets || this.props.lead.devwallets || [];
		const item = this.props.offer;

		const uploads = item.uploads || [];
		const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };

		const picked_wallet = wallets.length > 0 ? wallets[0] : {
			available: "0",
			reserve: "0",
		};

		const is_available = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
		const expires_in = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

		const expire_text = (is_available && item.expire) ? (Number(expires_in) > 0 ? `Expires in ${expires_in} days` : "Expires today") : ((is_available && !item.expire) ? null : "Expired");

		const has_user = (this.props.lead && this.props.lead._id) || false;

		const business_color = websdk_config.business_color;

		return (
			<div>
				<antd.Spin spinning={this.state.loading}>
					<div style={{ backgroundColor: "#f2f2f2", padding: 20, paddingBottom: 30, borderRadius: "0 0 16px 16px" }}>
						<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 30, marginTop: 15, background: "transparent", alignItems: "flex-start" }}>
							<div style={{ display: "flex", borderRadius: 6 }} onClick={() => this.props.history.goBack()}>
								<h1><react_material_icons.MdKeyboardBackspace className="nector-icon" style={{ color: "#000", borderRadius: 6 }}></react_material_icons.MdKeyboardBackspace></h1>
							</div>

							<div className="nector-wallet-point-design nector-center" style={{ gap: 6, backgroundColor: "#fff" }} onClick={this.on_wallettransactionlist}>
								<react_game_icons.GiTwoCoins className="nector-subtitle" style={{ color: business_color }} />
								<span>{collection_helper.get_safe_amount(picked_wallet.available)}</span>
							</div>
						</div>

						<div style={{ display: "flex" }}>
							<div style={{ display: "flex", flex: "1 0 0", flexDirection: "column", alignItems: "start", gap: 8 }}>
								<img src={picked_upload.link} style={{ background: "#fff", borderRadius: 6, height: 60, width: "auto", maxWidth: "100%", border: "3px solid white" }} />

								<antd.Typography.Paragraph className="nector-subtext" style={{ color: "#555" }}>{item.brand}</antd.Typography.Paragraph>
							</div>

							<div>
								{expire_text && <antd.Typography.Text className="nector-subtext nector-center" style={{ gap: 4 }}><react_bs_icons.BsClockHistory /> {expire_text}</antd.Typography.Text>}
							</div>
						</div>

						<div style={{ padding: "2px 0" }}>
							<view_form.MobileRenderViewItem {...this.props} item={this.props.offer} api_merchant_create_offerredeems={this.api_merchant_create_offerredeems} />
						</div>

						{item.redirect_link && (
							<antd.Button style={{ backgroundColor: "white", color: business_color, height: 42, width: "100%", border: "none", borderRadius: 6, boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }} onClick={() => window.open(item.redirect_link, "_blank")}>
								Visit Store
							</antd.Button>
						)}
					</div>

					<div style={{ padding: 20 }}>
						{
							item.description && (
								<div>
									<b style={{ borderBottom: "1px solid #eeeeee" }}>Details </b>
									<div style={{ margin: 5 }} />
									<ReactLinkify componentDecorator={(decoratedHref, decoratedText, key) => (
										<a target="_blank" rel="noopener noreferrer" href={decoratedHref} key={key}>
											{decoratedText}
										</a>
									)}>
										<p className="nector-subtext" style={{ cursor: "pointer", whiteSpace: "pre-wrap" }}>{item.description}</p>
									</ReactLinkify>

									<div style={{ margin: 5 }} />
									{
										item.availed ? (<div>
											<b style={{ borderBottom: "1px solid #eeeeee" }}>Redeemed </b>
											<div style={{ margin: 5 }} />
											<a target="_blank" rel="noopener noreferrer">
												<span className="nector-subtext">Used by {Number(item.availed)} buyer(s) in last 7 days</span>
											</a>
										</div>) : ""
									}
								</div>
							)
						}
					</div>
				</antd.Spin>
			</div>
		);
	}
}

OfferComponent.propTypes = properties;

export default OfferComponent;