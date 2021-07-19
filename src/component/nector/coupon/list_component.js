/* eslint-disable no-unused-vars */
//from system
import React from "react";
import ReactRipples from "react-ripples";
import ReactPullToRefresh from "react-simple-pull-to-refresh";
import prop_types from "prop-types";
import * as react_material_icons from "react-icons/md";
// import random_gradient from "random-gradient";
// import * as react_font_awesome from "react-icons/fa";
// import * as react_feature_icons from "react-icons/fi";

import collection_helper from "../../../helper/collection_helper";
import constant_helper from "../../../helper/constant_helper";
import axios_wrapper from "../../../wrapper/axios_wrapper";

import * as MobileView from "./view/mobile";
import * as DesktopView from "./view/desktop";

import * as antd from "antd";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,
	coupons: prop_types.object.isRequired,

	is_partial_view: prop_types.bool,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class CouponListComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,

			page: 1,
			limit: 10,
		};

		this.api_merchant_list_coupons = this.api_merchant_list_coupons.bind(this);

		this.process_list_data = this.process_list_data.bind(this);

		this.on_refresh = this.on_refresh.bind(this);

		this.on_couponlist = this.on_couponlist.bind(this);

		this.on_coupon = this.on_coupon.bind(this);

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
			this.api_merchant_list_coupons({ page: 1, limit: 10, lead_id: nextProps.lead._id });
		}

		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	api_merchant_list_coupons(values) {
		const list_filters = collection_helper.get_lodash().pick(collection_helper.process_objectify_params(this.props.location.search), ["deal_id", "sort", "sort_op", "page", "limit"]);

		this.set_state({ page: list_filters.page || values.page || 1, limit: list_filters.limit || values.limit || 10 });

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
				delegate_attributes: {
					method: "fetch_coupons",
					body: {},
					params: {},
					query: {
						lead_id: lead_id,
						page: values.page || 1,
						limit: values.limit || 10,
						sort: values.sort || "created_at",
						sort_op: values.sort_op || "DESC",
						...list_filters,
					},
				},
				regular_attributes: {
					...axios_wrapper.get_wrapper().fetch({
						lead_id: lead_id,
						page: values.page || 1,
						limit: values.limit || 10,
						sort: values.sort || "created_at",
						sort_op: values.sort_op || "DESC",
						...list_filters,
					}, "coupon")
				}
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

	on_refresh(force = false) {
		if (force === true) {
			// to load the partial component
			this.set_state({ force_load_partial_component: true, page: 1, limit: 10 });
			return new Promise(resolve => {
				this.api_merchant_list_coupons({ page: 1, limit: 10 });
				return resolve(true);
			});
		}

		if (collection_helper.validate_is_null_or_undefined(this.props.coupons) === true
			|| collection_helper.validate_is_null_or_undefined(this.props.coupons.items) === true
			|| (collection_helper.validate_not_null_or_undefined(this.props.coupons.items) === true && this.props.coupons.items.length < 1)) {
			this.api_merchant_list_coupons({ page: 1, limit: 10 });
		}
	}

	on_couponlist() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		this.props.history.push(`/nector/coupon-list?${search_params.toString()}`);
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

		const render_list_item = default_search_params.view === "desktop" ? DesktopView.DesktopRenderListItem : MobileView.MobileRenderListItem;
		const render_load_more = () => {
			if (!this.state.loading) {
				if (Number(count) <= data_source.length) return <div />;
				return (<div style={{ textAlign: "center", padding: "2%" }}>
					<antd.Button style={{ fontSize: "1em", }} onClick={() => this.api_merchant_list_coupons({ page: Math.floor(Number(data_source.length) / this.state.limit) + 1, append_data: true })}>Load more</antd.Button>
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
					{
						this.props.is_partial_view === true ? <div /> : (<div>
							<antd.Card className="nector-card" style={{ padding: 0, minHeight: "10%", backgroundColor: default_search_params.toolbar_background_color, backgroundImage: default_search_params.toolbar_background_image }} bordered={false}>
								<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
									<ReactRipples>
										<react_material_icons.MdKeyboardBackspace className="nector-icon" style={{ color: default_search_params.toolbar_color }} onClick={() => this.props.history.goBack()}></react_material_icons.MdKeyboardBackspace>
									</ReactRipples>
								</antd.PageHeader>

								<antd.Typography.Title style={{ fontSize: "1.5em", color: default_search_params.toolbar_color }}>rewards</antd.Typography.Title>
							</antd.Card>

							<div className="nector-position-relative">
								<div className="nector-shape nector-overflow-hidden" style={{ color: "#f2f2f2" }}>
									<svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
									</svg>
								</div>
							</div>
						</div>)
					}

					{
						this.props.is_partial_view === true ? <div /> : (<div style={{ textAlign: "center" }}>
							<antd.Typography.Text style={{ fontSize: "0.7em" }}>* Pull down to refresh</antd.Typography.Text>
						</div>)
					}

					<antd.Layout>
						{
							this.props.is_partial_view === true ? (<div style={{ display: "flex" }} onClick={this.on_couponlist}>
								<div style={{ flex: 1 }}>
									<antd.Typography.Text style={{ color: "#000000", fontWeight: "bold", fontSize: "1em", display: "block", marginBottom: 14 }}> MY REWARDS </antd.Typography.Text>
								</div>
								<react_material_icons.MdKeyboardArrowRight className="nector-icon" style={{ color: default_search_params.toolbar_color }}></react_material_icons.MdKeyboardArrowRight>
							</div>)
								: <div />
						}

						<antd.List
							grid={{ gutter: 8, xs: 2, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
							locale={{ emptyText: "You do not have any reward, try getting one" }}
							dataSource={data_source}
							loading={this.state.loading}
							bordered={false}
							size="small"
							loadMore={render_load_more()}
							renderItem={(item) => render_list_item(item, { ...this.props, on_coupon: this.on_coupon })}
						/>
					</antd.Layout>

				</div>
			</ReactPullToRefresh>
		);
	}
}

CouponListComponent.propTypes = properties;

export default CouponListComponent;