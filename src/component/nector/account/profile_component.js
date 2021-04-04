//from system
import React from "react";
import ReactRipples from "react-ripples";
import prop_types from "prop-types";
// import random_gradient from "random-gradient";
import * as react_material_icons from "react-icons/md";
import * as react_feature_icons from "react-icons/fa";

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
	coupons: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class ProfileComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,

			page: 1,
			limit: 20,
		};

		this.api_merchant_list_coupons = this.api_merchant_list_coupons.bind(this);

		this.process_list_data = this.process_list_data.bind(this);

		this.on_wallettransaction = this.on_wallettransaction.bind(this);
		this.on_offer = this.on_offer.bind(this);
		this.on_campaign = this.on_campaign.bind(this);
		this.on_notification = this.on_notification.bind(this);
		this.on_coupon = this.on_coupon.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		this.api_merchant_list_coupons({ page: 1, limit: 20 });
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.lead._id != this.props.lead._id) {
			this.api_merchant_list_coupons({ page: 1, limit: 20, lead_id: nextProps.lead._id });
		}

		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	api_merchant_list_coupons(values) {
		this.set_state({ page: values.page || 1, limit: values.limit || 20 });

		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const lead_id = values.lead_id || this.props.lead._id;

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;
		if (collection_helper.validate_is_null_or_undefined(lead_id) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_COUPON_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: values.append_data || false,
			attributes: {
				method: "fetch_coupons",
				body: {},
				params: {},
				query: {
					...collection_helper.get_lodash().pick(collection_helper.process_objectify_params(this.props.location.search), ["deal_id"]),
					lead_id: lead_id,
					page: values.page || 1,
					limit: values.limit || 20,
					sort: values.sort || "created_at",
					sort_op: values.sort_op || "DESC",
				},
			}
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {
			this.set_state({ loading: false });
		});
	}

	process_list_data() {
		return (this.props.coupons && this.props.coupons.items || []).map(item => ({ ...item, key: item._id }));
	}

	on_wallettransaction() {
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
		}
	}

	on_notification() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/notification-list?${search_params.toString()}`);
	}

	on_offer() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/deal-list?${search_params.toString()}`);
	}

	on_campaign() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/task-list?${search_params.toString()}`);
	}

	// eslint-disable-next-line no-unused-vars
	on_coupon(record) {
		const opts = {
			event: constant_helper.get_app_constant().INTERNAL_DISPATCH,
			append_data: false,
			attributes: {
				key: "coupon",
				value: {
					...record
				}
			}
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.internal_generic_dispatch(opts, (result) => {
			const search_params = collection_helper.process_url_params(this.props.location.search);
			search_params.set("coupon_id", record._id);
			this.props.history.push(`/nector/coupon?${search_params.toString()}`);
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
		const data_source = this.process_list_data();
		const count = (this.props.coupons && this.props.coupons.count || 0);
		const wallets = this.props.lead.wallets || this.props.lead.devwallets || [];

		const picked_wallet = wallets.length > 0 ? wallets[0] : {
			available: "0",
			reserve: "0",
			currency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") },
			devcurrency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") }
		};

		// let birthday_text = null, is_today_birthday = false;
		// if (this.props.lead.dob) {
		// 	const birth_moment = collection_helper.convert_to_moment_utc_from_datetime(this.props.lead.dob);
		// 	const current_moment = collection_helper.process_new_moment();
		// 	birth_moment.year(current_moment.year());
		// 	birthday_text = Number(birth_moment.diff(current_moment, "days"));
		// 	if (birthday_text < 0) {
		// 		birthday_text = Number(birth_moment.add(1, "year").diff(current_moment, "days"));
		// 	}

		// 	if (birthday_text == 0) is_today_birthday = true;
		// 	birthday_text = is_today_birthday ? <antd.Typography.Text style={{ fontSize: "1em", color: "#ffffff" }}>Happy Birthday!</antd.Typography.Text> : <antd.Typography.Text>Birthday in {birthday_text} days</antd.Typography.Text>;
		// }

		const render_list_item = default_search_params.view === "desktop" ? DesktopView.DesktopRenderListItem : MobileView.MobileRenderListItem;

		const render_load_more = () => {
			if (!this.state.loading) {
				if (Number(count) <= data_source.length) return <div />;
				return (<div style={{ textAlign: "center", padding: "2%" }}>
					<antd.Button style={{ fontSize: "1em", }} onClick={() => this.api_merchant_list_coupons({ page: Number(this.state.page) + 1, append_data: true })}>Load more</antd.Button>
				</div>);
			} else {
				return <div />;
			}
		};

		return (
			<div>
				<antd.Card className="nector-card" style={{ padding: 0, backgroundColor: default_search_params.toolbar_background_color, backgroundImage: default_search_params.toolbar_background_image }} bordered={false}>
					<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
						<div style={{ display: "flex" }}>
							<div style={{ flex: 1 }}>
								{default_search_params.name && <antd.Typography.Text style={{ color: "#ffffff", fontSize: "1.2em", display: "block" }}>{collection_helper.get_limited_text(default_search_params.name, 30, "", "")}</antd.Typography.Text>}
							</div>
							<antd.Badge dot>
								<ReactRipples>
									<react_material_icons.MdNotifications className="nector-icon" onClick={this.on_notification}></react_material_icons.MdNotifications>
								</ReactRipples>
							</antd.Badge>
						</div>
					</antd.PageHeader>

					<ReactRipples>
						<div onClick={this.on_wallettransaction}>
							<antd.Typography.Text style={{ color: "#ffffff", fontSize: "1em", display: "block" }}>Hi, {collection_helper.get_limited_text(this.props.lead.name, 20)}</antd.Typography.Text>
							<antd.Typography.Title style={{ color: "#ffffff", fontSize: "2em", display: "block" }}>{collection_helper.get_safe_amount(picked_wallet.available)} {collection_helper.get_lodash().upperFirst((picked_wallet.currency || picked_wallet.devcurrency).currency_code)} &rarr;</antd.Typography.Title>
						</div>
					</ReactRipples>
				</antd.Card>

				<div className="nector-position-relative">
					<div className="nector-shape nector-overflow-hidden" style={{ color: "#f2f2f2" }}>
						<svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
						</svg>
					</div>
				</div>

				<div style={{ padding: "2%" }}>
					<antd.Space>
						<react_feature_icons.FaTags onClick={this.on_offer}></react_feature_icons.FaTags>
						<ReactRipples during={200}>
							<antd.Button type="primary" style={{ fontSize: "1em", }} onClick={this.on_offer}> <antd_icons.ShoppingCartOutlined /> Offers</antd.Button>
						</ReactRipples>
						<antd.Button type="ghost" style={{ fontSize: "1em", background: "#f58634", color: "#ffffff" }} onClick={this.on_campaign}> <antd_icons.FundOutlined /> Campaigns</antd.Button>
					</antd.Space>
				</div>

				<antd.Layout>
					<antd.List
						grid={{ gutter: 8, xs: 2, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
						locale={{ emptyText: "We did not find anything at the moment, please try after sometime" }}
						dataSource={data_source}
						loading={this.state.loading}
						bordered={false}
						size="small"
						loadMore={render_load_more()}
						renderItem={(item) => render_list_item(item, { ...this.props, on_coupon: this.on_coupon })}
					/>
				</antd.Layout>

			</div>
		);
	}
}

ProfileComponent.propTypes = properties;

export default ProfileComponent;