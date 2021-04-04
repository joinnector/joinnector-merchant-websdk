/* eslint-disable no-unused-vars */
//from system
import React from "react";
import ReactRipples from "react-ripples";
import * as framer_motion from "framer-motion";
import prop_types from "prop-types";
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

			shown_coupon_popup: true
		};

		this.api_merchant_get_deals = this.api_merchant_get_deals.bind(this);
		this.api_merchant_create_coupons = this.api_merchant_create_coupons.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
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

	}

	api_merchant_get_deals() {
		this.set_state({ loading: true });
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
				method: "get_deals",
				body: {},
				params: {
					id: search_params.get("deal_id")
				},
				query: {},
			}
		};

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
			event: constant_helper.get_app_constant().API_IGNORE_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				method: "create_coupons",
				body: {
					currency_id: currency_id,
					deal_id: deal_id,
					lead_id: lead_id
				},
				params: {},
				query: {},
			}
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(dealopts, (result) => {
			console.log(result);
			this.set_state({ shown_coupon_popup: true, });
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
			uploads: [{ link: "https://res.cloudinary.com/esternetwork/image/upload/v1617280550/nector/images/logowhite.svg" }],
		};

		const uploads = deal.uploads || [];
		const picked_upload = uploads.length > 0 ? uploads[0] : { link: "https://res.cloudinary.com/esternetwork/image/upload/v1617280550/nector/images/logowhite.svg" };

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

		// const render_info_item = default_search_params.view === "desktop" ? DesktopView.DesktopRenderInfoItem : MobileView.MobileRenderListItem;

		return (
			<div>
				<framer_motion.motion.div
					animate={{ scale: 2, }}
					transition={{ duration: 0.5 }}>
					<antd.Modal closable={false} visible={this.state.shown_coupon_popup} onCancel={() => this.set_state({ shown_coupon_popup: false })} footer={null}>
						<div>
							<antd.Card className="nector-card" style={{ padding: 0 }} bordered={false}>
								<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
									<ReactRipples>
										<react_material_icons.MdClose className="nector-icon" onClick={() => this.set_state({ shown_coupon_popup: false })}></react_material_icons.MdClose>
									</ReactRipples>
								</antd.PageHeader>

								<antd.Avatar src={picked_upload.link} />

								<div style={{ marginBottom: 10 }} />

								<antd.Typography.Paragraph style={{ fontSize: "0.8em", color: "#ffffff" }}>{expire_text}</antd.Typography.Paragraph>
							</antd.Card>
						</div>
					</antd.Modal>
				</framer_motion.motion.div>

				<antd.Card className="nector-card" style={{ padding: 0 }} bordered={false}>
					<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
						<ReactRipples>
							<react_material_icons.MdKeyboardBackspace className="nector-icon" onClick={() => this.props.history.goBack()}></react_material_icons.MdKeyboardBackspace>
						</ReactRipples>
					</antd.PageHeader>

					<antd.Avatar src={picked_upload.link} />

					<div style={{ marginBottom: 10 }} />

					<antd.Typography.Paragraph style={{ fontSize: "0.8em", color: "#ffffff" }}>{expire_text}</antd.Typography.Paragraph>
				</antd.Card>

				<antd.Layout>
					<antd.Typography.Title style={{ fontSize: "2.5em" }}>{deal.name}</antd.Typography.Title>

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
						deal.created_at && (<div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "2%" }}>
							<framer_motion.motion.div
								whileTap={{ scale: 0.9 }}
								transition={{ type: "spring", stiffness: 300 }}>
								<antd.Button type="default" style={{ width: "100%", background: "#000000", border: 0, color: "#ffffff", fontWeight: "bold" }} onClick={this.api_merchant_create_coupons}>BUY {(Number(deal.sell_price) / (picked_wallet.currency || picked_wallet.devcurrency).conversion_factor).toFixed((picked_wallet.currency || picked_wallet.devcurrency).place)} {collection_helper.get_lodash().upperCase((picked_wallet.currency || picked_wallet.devcurrency).currency_code)}</antd.Button>
							</framer_motion.motion.div>
						</div>)
					}
				</antd.Layout>
			</div>
		);
	}
}

DealComponent.propTypes = properties;

export default DealComponent;