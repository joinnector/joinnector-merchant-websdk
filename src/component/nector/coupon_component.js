/* eslint-disable no-unused-vars */
//from system
import React from "react";
import ReactLinkify from "react-linkify";
import prop_types from "prop-types";

import copy_to_clipboard from "copy-to-clipboard";
import * as react_material_icons from "react-icons/md";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";

import * as analytics from "../../analytics";

import * as antd from "antd";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
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

		const expire_text = (is_available && connecteditem.expire) ? `Expires ${formated_date}` : ((is_available && !connecteditem.expire) ? "Coupon available" : "Coupon expired");

		const coupon_code = (coupon && coupon.type && coupon.value && coupon.type.includes("code")) ? coupon.value : "NO CODE REQUIRED";
		const coupon_redirect_link = (coupon && coupon.type && coupon.value && coupon.type.includes("link")) ? coupon.value : (connecteditem.redirect_link || null);

		return (
			<div>
				<antd.Spin spinning={this.state.loading}>

					<antd.Card className="nector-card" style={{ padding: 0, minHeight: "10%", borderBottom: "1px solid #eeeeee00" }} bordered={false}>
						<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
							<div style={{ display: "flex" }} onClick={() => this.props.history.goBack()}>
								<h1><react_material_icons.MdKeyboardBackspace className="nector-icon" style={{ background: "#eee", color: "#000", borderRadius: 6 }}></react_material_icons.MdKeyboardBackspace></h1>
							</div>
						</antd.PageHeader>

						{
							connecteditem.name && <h3><b>{collection_helper.get_lodash().capitalize(connecteditem.name)}</b></h3>
						}
					</antd.Card>

					<div style={{ display: "flex", flex: 1, flexDirection: "column", margin: "0px 14px" }}>
						<antd.Typography.Paragraph className="nector-subtext">{expire_text}</antd.Typography.Paragraph>
						<div style={{ margin: 10 }} />
						<div className="nector-coupon-design" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
							<div style={{ marginTop: -20 }}>
								<img src={picked_upload.link} style={{ background: "#eeeeee", borderRadius: 6, height: 75, width: 150, border: "3px solid #eeeeee" }} />
							</div>

							<div style={{ margin: 10 }} />
							{
								coupon_redirect_link && (
									<div style={{ display: "flex", alignItems: "center" }}>
										<antd.Space>
											{coupon_code && <react_material_icons.MdContentCopy className="nector-text" onClick={() => this.on_couponcopy(coupon_code, true, coupon._id)} style={{ color: "#000", cursor: "pointer" }} />}
											<div className="nector-wallet-point-design nector-text">
												<a target="_blank" rel="noopener noreferrer" href={coupon_redirect_link}>
													{coupon_code} <react_material_icons.MdKeyboardBackspace className="nector-backspace-rotate nector-text" style={{ color: "#000" }} />
												</a>
											</div>
										</antd.Space>
									</div>)
							}
							<div style={{ margin: 10 }} />
						</div>

						<div>
							<div style={{ margin: 10, }}></div>

							{
								couponmeta.fiat_value && (
									<div style={{ padding: 10, }}>
										<b style={{ borderBottom: "1px solid #eeeeee" }}>Discount </b>
										<div style={{ margin: 5 }} />
										<b className="nector-subtext">Get {couponmeta.fiat_class === "percent" ? "" : "Flat"} {Number(couponmeta.fiat_value)}{couponmeta.fiat_class === "percent" ? "%" : ""} Off at Checkout ({couponmeta.minimumcart_amount ? `On minimum purchace of ${couponmeta.minimumcart_amount}` : "No minimum purchase"}) </b>
									</div>)
							}

							{
								connecteditem.description && (
									<div style={{ padding: 10, }}>
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
								connecteditem.category && (<div style={{ padding: 10, }}>
									<b style={{ borderBottom: "1px solid #eeeeee" }}>Category </b>
									<div style={{ margin: 5 }} />
									<p className="nector-subtext">{collection_helper.get_lodash().capitalize(connecteditem.category)}</p>
								</div>)
							}
							{
								connecteditem.brand && (<div style={{ padding: 10, }}>
									<b style={{ borderBottom: "1px solid #eeeeee" }}>Brand </b>
									<div style={{ margin: 5 }} />
									<a target="_blank" rel="noopener noreferrer" href={coupon_redirect_link} onClick={() => coupon_code && this.on_couponcopy(coupon_code, false, coupon._id)}>
										<span className="nector-subtext">{collection_helper.get_lodash().capitalize(connecteditem.brand)} <react_material_icons.MdKeyboardBackspace className="nector-backspace-rotate nector-text" style={{ color: "#000" }} /> </span>
									</a>
								</div>)
							}
							{
								connecteditem.availed && (<div style={{ padding: 10, }}>
									<b style={{ borderBottom: "1px solid #eeeeee" }}>Redeemed </b>
									<div style={{ margin: 5 }} />
									<span className="nector-subtext">{Number(connecteditem.availed)} Time(s) on this app </span>
								</div>)
							}
						</div>
					</div>


				</antd.Spin>
			</div>
		);
	}
}

CouponComponent.propTypes = properties;

export default CouponComponent;