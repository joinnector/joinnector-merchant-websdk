/* eslint-disable no-unused-vars */
//from system
import React from "react";
import ReactLinkify from "react-linkify";
import prop_types from "prop-types";
import ReactQrCode from "react-qr-code";
import copy_to_clipboard from "copy-to-clipboard";
// import random_gradient from "random-gradient";
import * as react_material_icons from "react-icons/md";
import * as react_game_icons from "react-icons/gi";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";
import axios_wrapper from "../../wrapper/axios_wrapper";

import * as antd from "antd";
import * as antd_icons from "@ant-design/icons";

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

		this.on_couponcode_copy = this.on_couponcode_copy.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
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
		this.props.app_action.internal_generic_dispatch(opts, (result) => {

		});
	}

	api_merchant_get_coupons() {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);

		if (collection_helper.validate_is_null_or_undefined(search_params.get("coupon_id")) === true) return null;

		// try fetching th coupon
		const couponopts = {
			event: constant_helper.get_app_constant().API_MERCHANT_VIEW_COUPON_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				...axios_wrapper.get_wrapper().get(search_params.get("coupon_id"), "coupon")
			},
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(couponopts, (result) => {
			this.set_state({ loading: false });
		});
	}

	on_couponcode_copy(code) {
		collection_helper.show_message("Coupon code copied");
		copy_to_clipboard(code);
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
			code: "",
			redeem_link: null,
			created_at: null
		};

		const deal = this.props.coupon && Object.keys(this.props.coupon).length > 0 && (this.props.coupon.deal || this.props.coupon.devdeal) ? (this.props.coupon.deal || this.props.coupon.devdeal) : {
			name: "",
			description: "",
			category: "",
			deal_link: "",
			expire: null,
			uploads: [{ link: default_search_params.placeholder_image }],
		};

		const uploads = deal.uploads || [];
		const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };

		const formated_date = collection_helper.convert_to_moment_utc_from_datetime(deal.expire || collection_helper.process_new_moment()).format("MMMM Do, YYYY");
		const is_available = collection_helper.convert_to_moment_utc_from_datetime(deal.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
		// const expires_in = collection_helper.convert_to_moment_utc_from_datetime(task.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

		const expire_text = (is_available && deal.expire) ? `Expires ${formated_date}` : ((is_available && !deal.expire) ? "Coupon available" : "Coupon expired");

		const redeem_link = coupon.code ? deal.deal_link : (coupon.redeem_link || deal.deal_link);

		return (
			<div>
				<antd.Spin spinning={this.state.loading}>

					<antd.Card className="nector-card" style={{ padding: 0, minHeight: "10%", borderBottom: "1px solid #eeeeee00" }} bordered={false}>
						<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
							<div style={{ display: "flex" }} onClick={() => this.props.history.goBack()}>
								<h2><react_material_icons.MdKeyboardBackspace className="nector-icon" style={{ background: "#eee", color: "#000", borderRadius: 10 }}></react_material_icons.MdKeyboardBackspace></h2>
							</div>
						</antd.PageHeader>

						{
							deal.name && <h3><b>{collection_helper.get_lodash().capitalize(deal.name)}</b></h3>
						}
					</antd.Card>


					<div style={{ display: "flex", flex: 1, flexDirection: "column", margin: "0px 14px" }}>
						<antd.Typography.Paragraph style={{ fontSize: "0.8em" }}>{expire_text}</antd.Typography.Paragraph>
						<div style={{ margin: 10 }} />
						<div className="coupon-design" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
							<div style={{ marginTop: -20 }}>
								<img src={picked_upload.link} style={{ background: "#eeeeee", borderRadius: 10, height: 75, maxWidth: 150, border: "3px solid #eeeeee" }} />
							</div>

							<div style={{ margin: 10 }} />
							<ReactQrCode value={redeem_link ? redeem_link : ""} bgColor="#eeeeee" />
							<div style={{ margin: 10 }} />
							{
								redeem_link && (
									<div style={{ display: "flex", alignItems: "center" }}>
										<antd.Space>
											<react_material_icons.MdContentCopy onClick={() => this.on_couponcode_copy(coupon.code)} style={{ color: "#000", fontSize: "1em", cursor: "pointer" }} />
											<div className="wallet-point-design" style={{ fontSize: "1em", }}>
												<a target="_blank" rel="noopener noreferrer" href={redeem_link}>
													{coupon.code || ""} <react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ fontSize: "1em", color: "#000" }} />
												</a>
											</div>
										</antd.Space>
									</div>)
							}
							<div style={{ margin: 10 }} />
						</div>
						<div>
							{
								deal.name && (<div style={{ padding: 10, }}>
									<h3><b>{collection_helper.get_lodash().capitalize(deal.name)}</b></h3>
								</div>)
							}
							{
								deal.description && (
									<div style={{ padding: 10, }}>
										<b style={{ borderBottom: "1px solid #eeeeee" }}>Description </b>
										<div style={{ margin: 5 }} />
										<ReactLinkify componentDecorator={(decoratedHref, decoratedText, key) => (
											<a target="_blank" rel="noopener noreferrer" href={decoratedHref} key={key}>
												{decoratedText}
											</a>
										)}>
											<p style={{ fontSize: "0.8em", cursor: "pointer", whiteSpace: "pre-wrap" }}>{deal.description}</p>
										</ReactLinkify>
									</div>
								)
							}
							{
								deal.category && (<div style={{ padding: 10, }}>
									<b style={{ borderBottom: "1px solid #eeeeee" }}>Category </b>
									<div style={{ margin: 5 }} />
									<p style={{ fontSize: "0.8em" }}>{collection_helper.get_lodash().capitalize(deal.category)}</p>
								</div>)
							}
							{
								deal.brand && (<div style={{ padding: 10, }}>
									<b style={{ borderBottom: "1px solid #eeeeee" }}>Brand </b>
									<div style={{ margin: 5 }} />
									<a target="_blank" rel="noopener noreferrer" href={redeem_link}>
										<span style={{ fontSize: "0.8em" }}>{collection_helper.get_lodash().capitalize(deal.brand)} <react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ fontSize: "1em", color: "#000" }} /> </span>
									</a>
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