/* eslint-disable no-unused-vars */
//from system
import React from "react";
import ReactLinkify from "react-linkify";
import prop_types from "prop-types";

import copy_to_clipboard from "copy-to-clipboard";
import * as react_material_icons from "react-icons/md";
import * as react_bs_icons from "react-icons/bs";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";

import * as analytics from "../../analytics";

import * as antd from "antd";
import * as antd_icons from "@ant-design/icons";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	websdkinfos: prop_types.object.isRequired,

	lead: prop_types.object.isRequired,
	coupon: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class CouponComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
		};

		this.api_merchant_get_coupons = this.api_merchant_get_coupons.bind(this);

		this.on_couponcopy = this.on_couponcopy.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		// eslint-disable-next-line no-undef


		// fetch coupon if no value
		if (collection_helper.validate_is_null_or_undefined(this.props.coupon) === true
			|| Object.keys(this.props.coupon).length < 1) {
			this.api_merchant_get_coupons();
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
				key: "coupon",
				value: {}
			}
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.internal_generic_dispatch(opts);
	}

	api_merchant_get_coupons() {
		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const search_params = collection_helper.process_url_params(this.props.location.search);
		if (collection_helper.validate_is_null_or_undefined(search_params.get("coupon_id")) === true) return null;

		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_GET_COUPON_DISPATCH,
			url: url,
			endpoint: `api/v2/merchant/coupons/${search_params.get("coupon_id")}`,
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

	on_couponcopy(code, show_msg = true, coupon_id = null) {
		show_msg && collection_helper.show_message("Coupon code copied");
		copy_to_clipboard(code);

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_coupon_copy_request, {
				coupon_id: coupon_id
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

		const websdkConfigDataSource = (this.props.websdkinfos && this.props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));
		const websdk_config_arr = websdkConfigDataSource.filter(x => x.name === "websdk_config") || [];
		const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
		const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

		const coupon = this.props.coupon && Object.keys(this.props.coupon).length > 0 ? this.props.coupon : {
			offer_id: null,
			type: null,
			value: null,
			created_at: null
		};

		const offer = (this.props.coupon && Object.keys(this.props.coupon).length > 0 && this.props.coupon.offer) ? this.props.coupon.offer : {
			name: "",
			description: "",
			category: "",
			redirect_link: "",
			expire: null,
			uploads: [{ link: default_search_params.placeholder_image }],
		};

		const connecteditem = offer;
		const couponmeta = coupon.meta || {};

		const uploads = (connecteditem.uploads || []);
		const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };

		const formated_date = collection_helper.convert_to_moment_utc_from_datetime(connecteditem.expire || collection_helper.process_new_moment()).format("MMMM Do, YYYY");
		const is_available = collection_helper.convert_to_moment_utc_from_datetime(connecteditem.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
		// const expires_in = collection_helper.convert_to_moment_utc_from_datetime(task.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

		const expire_text = (is_available && connecteditem.expire) ? `Expires ${formated_date}` : ((is_available && !connecteditem.expire) ? null : "Coupon expired");

		const coupon_code = (coupon && coupon.type && coupon.value && coupon.type.includes("code")) ? coupon.value : "NO CODE REQUIRED";
		const coupon_redirect_link = (coupon && coupon.type && coupon.value && coupon.type.includes("link")) ? coupon.value : (connecteditem.redirect_link || null);

		return (
			<div>
				<antd.Spin spinning={this.state.loading}>
					<div style={{ backgroundColor: "#f2f2f2", padding: 20, paddingBottom: 30, borderRadius: "0 0 16px 16px" }}>
						<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 30, marginTop: 15, background: "transparent", alignItems: "flex-start" }}>
							<div style={{ display: "flex", borderRadius: 6 }} onClick={() => this.props.history.goBack()}>
								<react_material_icons.MdKeyboardBackspace className="nector-icon" style={{ color: "#000", fontSize: 24 }}></react_material_icons.MdKeyboardBackspace>
							</div>
						</div>

						<div style={{ display: "flex" }}>
							<div style={{ display: "flex", flex: "1 0 0", flexDirection: "column", alignItems: "start", gap: 8 }}>
								<img src={picked_upload.link} style={{ background: "#fff", borderRadius: 6, height: 60, width: "auto", maxWidth: "100%", border: "3px solid #eee" }} />

								<antd.Typography.Paragraph className="nector-subtext" style={{ color: "#555" }}>{connecteditem.brand}</antd.Typography.Paragraph>
							</div>

							<div>
								{expire_text && <antd.Typography.Text className="nector-center nector-subtext" style={{ gap: 4, fontSize: 12 }}><react_bs_icons.BsClockHistory /> {expire_text}</antd.Typography.Text>}
							</div>
						</div>

						<antd.Typography.Title style={{ fontSize: 24, fontWeight: "normal" }}>{connecteditem.name}</antd.Typography.Title>

						{couponmeta.fiat_value && (
							<antd.Typography.Title style={{ fontSize: 14, fontWeight: "normal", lineHeight: 1.5, color: "#444" }}>
								Get {couponmeta.fiat_class === "percent" ? "" : "Flat"} {Number(couponmeta.fiat_value)}{couponmeta.fiat_class === "percent" ? "%" : ""} Off at Checkout ({couponmeta.minimumcart_amount ? `On minimum purchace of ${couponmeta.minimumcart_amount}` : "No minimum purchase"})
							</antd.Typography.Title>
						)}

						<div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
							<antd.Typography.Text className="nector-subtext" style={{ fontWeight: "bold" }}>YOUR COUPON CODE</antd.Typography.Text>

							<div className="nector-center" style={{ gap: 12, backgroundColor: "#D9D9D9", border: "1px dashed #222", padding: 10, borderRadius: 4 }}>
								<span className="nector-text" style={{ fontWeight: "bold" }}>{coupon_code}</span>
								<react_material_icons.MdContentCopy className="nector-subtitle" style={{ cursor: "pointer" }} onClick={() => this.on_couponcopy(coupon_code, true, coupon._id)} />
							</div>

							<antd.Button onClick={() => window.open(connecteditem?.redirect_link, "_blank")} style={{ backgroundColor: websdk_config.business_color, color: websdk_config.text_color, border: "none", width: "100%", height: 42, borderRadius: 4, marginTop: 15 }}>Redeem Coupon Code</antd.Button>
						</div>
					</div>

					<div style={{ padding: 20 }}>
						{
							connecteditem.description && (
								<div style={{ marginBottom: 20 }}>
									<b style={{ borderBottom: "1px solid #eeeeee" }}>Description </b>
									<div style={{ margin: 5 }} />
									<ReactLinkify componentDecorator={(decoratedHref, decoratedText, key) => (
										<a target="_blank" rel="noopener noreferrer" href={decoratedHref} key={key}>
											{decoratedText}
										</a>
									)}>
										<p className="nector-subtext" style={{ cursor: "pointer", whiteSpace: "pre-wrap" }}>{connecteditem.description}</p>
									</ReactLinkify>
								</div>
							)
						}
						{
							connecteditem.category && (<div style={{ marginBottom: 20 }}>
								<b style={{ borderBottom: "1px solid #eeeeee" }}>Category </b>
								<div style={{ margin: 5 }} />
								<p className="nector-subtext">{collection_helper.get_lodash().capitalize(connecteditem.category)}</p>
							</div>)
						}
						{
							connecteditem.brand && (<div style={{ marginBottom: 20 }}>
								<b style={{ borderBottom: "1px solid #eeeeee" }}>Brand </b>
								<div style={{ margin: 5 }} />
								<a target="_blank" rel="noopener noreferrer" href={coupon_redirect_link} onClick={() => coupon_code && this.on_couponcopy(coupon_code, false, coupon._id)}>
									<span className="nector-subtext">{connecteditem.brand} <react_material_icons.MdKeyboardBackspace className="nector-backspace-rotate nector-text" style={{ color: "#000" }} /> </span>
								</a>
							</div>)
						}
						{
							connecteditem.availed ? (<div style={{ marginBottom: 20 }}>
								<b style={{ borderBottom: "1px solid #eeeeee" }}>Redeemed </b>
								<div style={{ margin: 5 }} />
								<span className="nector-subtext">{Number(connecteditem.availed)} Time(s) on this app </span>
							</div>) : ""
						}
					</div>
				</antd.Spin>
			</div>
		);
	}
}

CouponComponent.propTypes = properties;

export default CouponComponent;