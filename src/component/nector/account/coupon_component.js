/* eslint-disable no-unused-vars */
//from system
import React from "react";
import prop_types from "prop-types";
import random_gradient from "random-gradient";

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

	set_state(values) {
		// eslint-disable-next-line no-unused-vars
		this.setState((state, props) => ({
			...state,
			...values
		}));
	}

	render() {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
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
			expire: null,
			uploads: [{ link: "https://res.cloudinary.com/esternetwork/image/upload/v1617280550/nector/images/logowhite.svg" }],
		};

		const uploads = deal.uploads || [];
		const picked_upload = uploads.length > 0 ? uploads[0] : { link: "https://res.cloudinary.com/esternetwork/image/upload/v1617280550/nector/images/logowhite.svg" };

		// const render_info_item = default_search_params.view === "desktop" ? DesktopView.DesktopRenderInfoItem : MobileView.MobileRenderListItem;

		return (
			<div>
				<antd.Card className="nector-profile-hero-image" style={{ padding: 0, background: random_gradient(collection_helper.get_limited_text(deal.name, 13, "nectormagic")) }}>
					<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
						<antd_icons.ArrowLeftOutlined style={{ fontSize: "1.2em", color: "#ffffff" }} onClick={() => this.props.history.goBack()}></antd_icons.ArrowLeftOutlined>
					</antd.PageHeader>

					<antd.Avatar src={picked_upload.link} />

					<div style={{ marginBottom: 10 }} />

					<antd.Typography.Title style={{ color: "#ffffff", fontSize: "2em" }}>{collection_helper.get_limited_text(deal.name, 100)}</antd.Typography.Title>
					{/* <antd.Typography.Paragraph style={{ color: "#ffffff", fontSize: "0.8em" }}>{expire_text}</antd.Typography.Paragraph> */}
				</antd.Card>

				<antd.Layout>

				</antd.Layout>
			</div>
		);
	}
}

CouponComponent.propTypes = properties;

export default CouponComponent;