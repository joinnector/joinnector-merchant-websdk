/* eslint-disable no-unused-vars */
//from system
import React from "react";
import ReactRipples from "react-ripples";
import * as framer_motion from "framer-motion";
import prop_types from "prop-types";
import copy_to_clipboard from "copy-to-clipboard";
// import random_gradient from "random-gradient";
import * as react_material_icons from "react-icons/md";

import collection_helper from "../../../helper/collection_helper";
import constant_helper from "../../../helper/constant_helper";

import * as MobileView from "./view/mobile";
import * as DesktopView from "./view/desktop";

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

	}

	api_merchant_get_coupons() {
		this.set_state({ loading: true });
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
				method: "get_coupons",
				body: {},
				params: {
					id: search_params.get("coupon_id")
				},
				query: {},
			}
		};

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
			sell_price: "0",
			description: "",
			tnc: "",
			category: "",
			provider: "",
			hits: "0",
			count: "0",
			avg_rating: "0",
			redeem_link: "",
			expire: null,
			uploads: [{ link: "https://res.cloudinary.com/esternetwork/image/upload/v1617280550/nector/images/logowhite.svg" }],
		};

		const uploads = deal.uploads || [];
		const picked_upload = uploads.length > 0 ? uploads[0] : { link: "https://res.cloudinary.com/esternetwork/image/upload/v1617280550/nector/images/logowhite.svg" };

		const formated_date = collection_helper.convert_to_moment_utc_from_datetime(deal.expire || collection_helper.process_new_moment()).format("MMMM Do, YYYY");
		const is_available = collection_helper.convert_to_moment_utc_from_datetime(deal.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
		// const expires_in = collection_helper.convert_to_moment_utc_from_datetime(task.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

		const expire_text = (is_available && deal.expire) ? `Expires ${formated_date}` : ((is_available && !deal.expire) ? "Coupon available" : "Coupon expired");

		const redeem_link = coupon.code ? deal.redeem_link : (coupon.redeem_link || deal.redeem_link);

		// const render_info_item = default_search_params.view === "desktop" ? DesktopView.DesktopRenderInfoItem : MobileView.MobileRenderListItem;

		return (
			<div>
				<antd.Card className="nector-coupon-info-hero-image" style={{ padding: 0 }}>
					<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
						<ReactRipples>
							<react_material_icons.MdKeyboardBackspace className="nector-back-button" onClick={() => this.props.history.goBack()}></react_material_icons.MdKeyboardBackspace>
						</ReactRipples>
					</antd.PageHeader>

					<antd.Avatar src={picked_upload.link} />

					<div style={{ marginBottom: 10 }} />

					<antd.Typography.Paragraph style={{ fontSize: "0.8em", color: "#ffffff" }}>{expire_text}</antd.Typography.Paragraph>
				</antd.Card>

				<antd.Layout>
					<div style={{ fontSize: "0.8em" }}>You Won</div>
					<antd.Typography.Title style={{ fontSize: "2.5em" }}>{deal.name}</antd.Typography.Title>
					{coupon.created_at && <antd.Typography.Text style={{ fontSize: "0.8em" }}>{collection_helper.get_moment()(coupon.created_at).format("MMMM Do YYYY, h:mm:ss a")}</antd.Typography.Text>}

					{
						coupon.code && (<div style={{ margin: "1em 0em", }}>
							<framer_motion.motion.div
								whileTap={{ scale: 0.9 }}>
								<antd.Button className="nector-background-title-disabled-button" type="primary" style={{ border: 0, textAlign: "left" }} onClick={() => this.on_couponcode_copy(coupon.code)} ><antd_icons.CopyOutlined /> {coupon.code}</antd.Button>
							</framer_motion.motion.div>
						</div>)
					}

					<div>
						{
							deal.description && (
								<div style={{ borderRadius: 5 }}>
									<antd.Typography.Text style={{ color: "#00000095", fontSize: "0.8em", display: "block", whiteSpace: "pre-wrap" }}>{deal.description}</antd.Typography.Text>
								</div>
							)
						}

						{
							deal.tnc && (
								<div style={{ borderRadius: 5, margin: "1em 0em 0em 0em" }}>
									<antd.Typography.Text style={{ color: "#000000", fontSize: "1em", display: "block", }}>Terms and conditions</antd.Typography.Text>
									<antd.Typography.Text style={{ color: "#00000095", fontSize: "0.8em", display: "block", whiteSpace: "pre-wrap" }}>{deal.tnc}</antd.Typography.Text>
								</div>
							)
						}
					</div>

					{
						redeem_link && (<div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "2%" }}>
							<framer_motion.motion.div
								whileTap={{ scale: 0.9 }}
								transition={{ type: "spring", stiffness: 300 }}>
								<antd.Button type="link" href={redeem_link} target={"_blank"} style={{ width: "100%", background: "#000000", border: 0, color: "#ffffff", fontWeight: "bold" }}>REDEEM DEAL</antd.Button>
							</framer_motion.motion.div>
						</div>)
					}
				</antd.Layout>
			</div>
		);
	}
}

CouponComponent.propTypes = properties;

export default CouponComponent;