/* eslint-disable no-unused-vars */
//from system
import React from "react";
import prop_types from "prop-types";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";
import security_wrapper from "../../wrapper/security_wrapper";

import * as analytics from "../../analytics";

import * as antd from "antd";

import * as ViewForm from "../../component_form/nector/reward/view_form";
import Button from "./common/button";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	businessinfos: prop_types.object.isRequired,
	websdkinfos: prop_types.object.isRequired,
	businessoffers: prop_types.object.isRequired,
	internaloffers: prop_types.object.isRequired,

	entity: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,
	coupons: prop_types.object.isRequired,
	triggers: prop_types.object.isRequired,
	wallettransactions: prop_types.object.isRequired,
	activities: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class RewardComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			triggers_loading: false,
			triggers_page: 1,
			triggers_limit: 6,

			coupons_loading: false,
			coupons_page: 1,
			coupons_limit: 5,

			wallettransactions_loading: false,
			wallettransactions_page: 1,
			wallettransactions_limit: 5,

			visible_userinfo_section: null
		};

		this.redeem_section_ref = React.createRef();
		this.userinfo_section_ref = React.createRef();

		this.api_merchant_list_triggers = this.api_merchant_list_triggers.bind(this);
		this.api_merchant_list_coupons = this.api_merchant_list_coupons.bind(this);
		this.api_merchant_list_wallettransactions = this.api_merchant_list_wallettransactions.bind(this);
		this.api_merchant_get_leads = this.api_merchant_get_leads.bind(this);
		this.api_merchant_create_triggeractivities = this.api_merchant_create_triggeractivities.bind(this);
		this.api_merchant_create_offerredeems = this.api_merchant_create_offerredeems.bind(this);

		this.process_render_pagination = this.process_render_pagination.bind(this);

		this.process_triggers_list_data = this.process_triggers_list_data.bind(this);
		this.process_offers_list_data = this.process_offers_list_data.bind(this);
		this.process_wallettransactions_list_data = this.process_wallettransactions_list_data.bind(this);
		this.process_coupons_list_data = this.process_coupons_list_data.bind(this);

		this.on_show_userinfo_section = this.on_show_userinfo_section.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		let lead_id = search_params.get("lead_id") || null;
		let customer_id = search_params.get("customer_id") || null;

		if (collection_helper.validate_is_null_or_undefined(lead_id) && collection_helper.validate_is_null_or_undefined(customer_id)) {
			this.triggers_fetched = true;
			this.api_merchant_list_triggers({ page: 1, limit: 6 });
		}
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.lead._id && nextProps.lead._id !== this.props.lead._id) {
			this.api_merchant_list_triggers({ lead_id: nextProps.lead._id, page: 1, limit: 6 });
		}

		if (!this.triggers_fetched && this.props.lead.pending === true && collection_helper.validate_is_null_or_undefined(nextProps.lead.pending) && collection_helper.validate_is_null_or_undefined(nextProps.lead._id)) {
			this.api_merchant_list_triggers({ page: 1, limit: 6 });
		}

		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	api_merchant_list_triggers(values) {
		this.set_state({ triggers_page: values.page || 1, triggers_limit: values.limit || 6 });

		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const lead_id = values.lead_id || this.props.lead._id || null;

		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_TRIGGERS_DISPATCH,
			url: url,
			endpoint: "api/v2/merchant/triggers",
			append_data: values.append_data || false,
			params: {
				page: values.page || 1,
				limit: values.limit || 6,
				sort: "created_at",
				sort_op: "DESC",
				content_types: ["earn", "social"]
			},
		};

		if (collection_helper.validate_not_null_or_undefined(lead_id)) opts.params.lead_id = lead_id;

		this.set_state({ triggers_loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_get(opts, (result) => {
			this.set_state({ triggers_loading: false });
		});
	}

	api_merchant_list_coupons(values) {
		this.set_state({ coupons_page: values.page || 1, coupons_limit: values.limit || 5 });

		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const lead_id = values.lead_id || this.props.lead._id;
		if (collection_helper.validate_is_null_or_undefined(lead_id) === true) return null;

		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_COUPON_DISPATCH,
			url: url,
			endpoint: "api/v2/merchant/coupons",
			append_data: values.append_data || false,
			params: {
				lead_id: lead_id,
				page: values.page || 1,
				limit: values.limit || 5,
				sort: values.sort || "created_at",
				sort_op: values.sort_op || "DESC",
			},
		};

		this.set_state({ coupons_loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_get(opts, (result) => {
			this.set_state({ coupons_loading: false });
		});
	}

	api_merchant_list_wallettransactions(values) {
		this.set_state({ wallettransactions_page: values.page || 1, wallettransactions_limit: values.limit || 5 });

		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const lead_id = values.lead_id || this.props.lead._id;
		if (collection_helper.validate_is_null_or_undefined(lead_id) === true) return null;

		const wallet_params = this.props.lead?.wallets?.[0]?._id ? { wallet_id: this.props.lead.wallets[0]._id } : {};

		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_WALLETTRANSACTION_DISPATCH,
			url: url,
			endpoint: "api/v2/merchant/wallettransactions",
			append_data: values.append_data || false,
			params: {
				lead_id: lead_id,
				page: values.page || 1,
				limit: values.limit || 5,
				sort: values.sort || "created_at",
				sort_op: values.sort_op || "DESC",
				...wallet_params,
			},
		};

		this.set_state({ wallettransactions_loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_get(opts, (result) => {
			this.set_state({ wallettransactions_loading: false });
		});
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

	api_merchant_create_triggeractivities(values) {
		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const lead_id = this.props.lead._id;
		const trigger_id = values.trigger_id;

		if (collection_helper.validate_is_null_or_undefined(lead_id) === true
			|| collection_helper.validate_is_null_or_undefined(trigger_id) === true) return null;

		const opts = {
			event: constant_helper.get_app_constant().API_SUCCESS_DISPATCH,
			url: url,
			endpoint: "api/v2/merchant/activities",
			append_data: false,
			params: {},
			attributes: {
				trigger_id: trigger_id,
				lead_id: lead_id
			}
		};

		this.set_state({ loading: true });
		this.props.app_action.api_generic_post(opts, (result) => {
			this.set_state({ loading: false });

			// fetch user again
			if (result && result.data && result.data.activity) {
				this.api_merchant_get_leads();

				collection_helper.window_post_message(constant_helper.get_app_constant().WINDOW_MESSAGE_EVENTS.REFRESH_WALLET);
			}

			if (result && result.data && result.data.wallet_reward) {
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
				this.set_state({ visible_userinfo_section: null });

			} else if (result && result.data && result.data.offer_reward) {
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
				this.set_state({ visible_userinfo_section: null });
			}
		});

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_instruction_follow_request, {
				trigger_id: trigger_id
			});
	}

	api_merchant_create_offerredeems(values, callback) {
		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) {
			if (callback) callback(null);
			return null;
		}

		const lead_id = values.lead_id || this.props.lead._id;
		const offer_id = values.offer_id;
		const step = values.step || 1;

		if (collection_helper.validate_is_null_or_undefined(lead_id) === true
			|| collection_helper.validate_is_null_or_undefined(offer_id) === true
			|| collection_helper.validate_is_null_or_undefined(step) === true) {
			if (callback) callback(null);
			return null;
		}

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

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {
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
			this.set_state({ visible_userinfo_section: null });

			if (callback) callback(result);
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

	process_render_pagination(currentPage, total, pageSize, onChange) {
		return (
			<div className="nector-rewards-pagination">
				<antd.Pagination
					showSizeChanger={false}
					current={currentPage}
					total={total}
					pageSize={pageSize}
					onChange={onChange}
					itemRender={(page, type, originalElement) => {
						if (type !== "page") return originalElement;

						return (
							<div className="nector-center" style={{ height: "100%" }}>
								<div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: page === currentPage ? "#666" : "#ccc" }}></div>
							</div>
						);
					}}
				/>
			</div>
		);
	}

	process_triggers_list_data() {
		return (this.props.triggers && this.props.triggers.items || []).map(item => ({ ...item, key: item._id }));
	}

	process_offers_list_data() {
		let offers = {};
		(this.props.businessoffers && this.props.businessoffers.items || []).map(item => ({ ...item, key: item._id })).forEach(offer => {

			offers[offer._id] = offer;
		});

		(this.props.internaloffers && this.props.internaloffers.items || []).map(item => ({ ...item, key: item._id })).forEach(offer => {

			offers[offer._id] = offer;
		});

		return Object.values(offers);
	}

	process_wallettransactions_list_data() {
		return (this.props.wallettransactions && this.props.wallettransactions.items || []).map(item => ({ ...item, key: item._id }));
	}

	process_coupons_list_data() {
		return (this.props.coupons && this.props.coupons.items || []).map(item => ({ ...item, key: item._id }));
	}

	on_show_userinfo_section(key) {
		let finalkey = null;
		if (key && key !== this.state.visible_userinfo_section) finalkey = key;
		this.set_state({ visible_userinfo_section: finalkey });

		if (key === "wallettransactions" && this.state.visible_userinfo_section !== key && (collection_helper.validate_is_null_or_undefined(this.props.wallettransactions?.count) && collection_helper.validate_is_null_or_undefined(this.props.wallettransactions?.items))) {
			this.api_merchant_list_wallettransactions({ page: this.state.wallettransactions_page, limit: this.state.wallettransactions_limit });
		} else if (key === "coupons" && this.state.visible_userinfo_section !== key && (collection_helper.validate_is_null_or_undefined(this.props.coupons?.count) && collection_helper.validate_is_null_or_undefined(this.props.coupons?.items))) {
			this.api_merchant_list_coupons({ page: this.state.coupons_page, limit: this.state.coupons_limit });
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
		const search_params = collection_helper.process_url_params(this.props.location.search);

		const dataSource = (this.props.websdkinfos && this.props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));
		const triggers = this.process_triggers_list_data();
		const offers = this.process_offers_list_data();
		const wallettransactions = this.process_wallettransactions_list_data();
		const coupons = this.process_coupons_list_data();

		const websdk_config_arr = dataSource.filter(x => x.name === "websdk_config") || [];
		const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
		const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

		const rewardspage_config_arr = dataSource.filter(x => x.name === "rewardspage_config") || [];
		const rewardspage_config = rewardspage_config_arr.length > 0 ? rewardspage_config_arr[0].value : null;

		const has_user = (this.props.lead && this.props.lead._id) || false;

		const wallets = this.props.lead.wallets || this.props.lead.devwallets || [];
		const picked_wallet = wallets.length > 0 ? wallets[0] : {
			available: "0",
			reserve: "0",
		};

		const business_uri = search_params.get("business_uri");
		const business_name = websdk_config.business_name || this.props.entity.name || (business_uri ? new URL(business_uri).hostname : "");

		if (!rewardspage_config) {
			return null;
		}

		return (
			<div className="nector-rewards-page-container" style={{ height: "100vh" }}>
				{(rewardspage_config.banner?.image_url || rewardspage_config.banner?.mobile_image_url) && (
					<div className="nector-rewards-banner">
						{(rewardspage_config.banner?.redirect_url) ? (
							<a href={rewardspage_config.banner?.redirect_url} target="_blank" style={{ display: "block" }} rel="noreferrer">
								<picture>
									{rewardspage_config.banner?.mobile_image_url && <source media="(max-width: 768px)" srcSet={rewardspage_config.banner?.mobile_image_url} />}
									{rewardspage_config.banner?.image_url && <source media="(min-width: 769px)" srcSet={rewardspage_config.banner?.image_url} />}
									<img src={rewardspage_config.banner?.image_url || rewardspage_config.banner?.mobile_image_url} />
								</picture>
							</a>
						) : (
							<picture>
								{rewardspage_config.banner?.mobile_image_url && <source media="(max-width: 768px)" srcSet={rewardspage_config.banner?.mobile_image_url} />}
								{rewardspage_config.banner?.image_url && <source media="(min-width: 769px)" srcSet={rewardspage_config.banner?.image_url} />}
							</picture>
						)}
					</div>
				)}

				{/* User Points Section */}
				{has_user && (
					<div ref={this.userinfo_section_ref} className="nector-rewards-section nector-rewards-user-info nector-center">
						<div className="nector-rewards-user-info-coins nector-center">
							<antd.Typography.Text className="nector-rewards-user-info-coins-subtitle">You Have</antd.Typography.Text>
							<antd.Typography.Title className="nector-rewards-user-info-coins-title" level={3}>{Number(picked_wallet.available)} Coins</antd.Typography.Title>
						</div>

						<div className="nector-rewards-user-info-btns nector-center">
							<Button rounded onClick={() => {
								if (this.redeem_section_ref.current) this.redeem_section_ref.current.scrollIntoView({ behavior: "smooth" });
							}}>REDEEM NOW</Button>
							<Button rounded onClick={() => this.on_show_userinfo_section("wallettransactions")}>WALLET HISTORY</Button>
							<Button rounded onClick={() => this.on_show_userinfo_section("coupons")}>COUPONS</Button>
						</div>

						<antd.Collapse
							className="nector-rewards-user-info-collapse"
							activeKey={this.state.visible_userinfo_section}
							bordered={false}
							collapsible={false}
						>
							<antd.Collapse.Panel key="wallettransactions" className="nector-rewards-collapse-panel" showArrow={false}>
								<antd.List
									locale={{ emptyText: "There is no history at the moment." }}
									dataSource={wallettransactions}
									loading={this.state.wallettransactions_loading}
									bordered={false}
									size="small"
									renderItem={(item, index) => <ViewForm.ListWalletTransactionItem {...this.props} item={item} websdk_config={websdk_config} is_last_item={index === wallettransactions?.length - 1} />}
								/>

								{(wallettransactions.length < this.props.wallettransactions?.count) && this.process_render_pagination(this.state.wallettransactions_page, this.props.wallettransactions?.count || 0, this.state.wallettransactions_limit, (page, pageSize) => this.api_merchant_list_wallettransactions({ page, limit: this.state.wallettransactions_limit }))}
							</antd.Collapse.Panel>

							<antd.Collapse.Panel key="coupons" className="nector-rewards-collapse-panel" showArrow={false}>
								<antd.List
									locale={{ emptyText: "No coupons found." }}
									dataSource={coupons}
									loading={this.state.coupons_loading}
									bordered={false}
									size="small"
									renderItem={(item, index) => <ViewForm.ListCouponItem {...this.props} item={item} is_last_item={index === coupons?.length - 1} />}
								/>

								{(coupons.length < this.props.coupons?.count) && this.process_render_pagination(this.state.coupons_page, this.props.coupons?.count || 0, this.state.coupons_limit, (page, pageSize) => this.api_merchant_list_coupons({ page, limit: this.state.coupons_limit }))}
							</antd.Collapse.Panel>
						</antd.Collapse>
					</div>
				)}

				{/* Steps section */}
				<div className="nector-rewards-section nector-rewards-steps nector-center">
					<antd.Typography.Title className="nector-rewards-steps-title" level={2}>{rewardspage_config.steps_section?.title}</antd.Typography.Title>

					<div className="nector-rewards-steps-items">
						{["one", "two", "three"].map((step, index) => (
							<div key={step} className="nector-rewards-steps-item">
								<div className="nector-rewards-steps-item-step nector-center" style={{ backgroundColor: websdk_config.business_color, color: websdk_config.text_color }}>{index + 1}</div>

								<antd.Typography.Title level={4}>{rewardspage_config.steps_section[`step${step}_title`]}</antd.Typography.Title>

								<antd.Typography.Text>{rewardspage_config.steps_section[`step${step}_description`]}</antd.Typography.Text>
							</div>
						))}
					</div>
				</div>

				{/* Earn Section */}
				<div className="nector-rewards-section nector-rewards-earn nector-center">
					<antd.Typography.Title className="nector-rewards-earn-title" level={2}>{rewardspage_config.earn_section?.title}</antd.Typography.Title>

					<div className="nector-rewards-earn-items">
						{triggers?.length > 0 && triggers.map((trigger) => (
							<ViewForm.EarnItem key={trigger._id} websdk_config={websdk_config} trigger={trigger} activities={this.props.triggers?.activities || []} has_user={has_user} api_merchant_create_triggeractivities={this.api_merchant_create_triggeractivities} api_merchant_count_activities={this.api_merchant_count_activities} />
						))}
					</div>

					{(triggers.length < this.props.triggers?.count) && this.process_render_pagination(this.state.triggers_page, this.props.triggers?.count || 0, this.state.triggers_limit, (page, pageSize) => this.api_merchant_list_triggers({ page, limit: this.state.triggers_limit }))}
				</div>

				{/* Redeem Section */}
				{(offers?.length > 0) && <div ref={this.redeem_section_ref} className="nector-rewards-section nector-rewards-redeem nector-center">
					<antd.Typography.Title className="nector-rewards-redeem-title" level={2}>{rewardspage_config.redeem_section?.title}</antd.Typography.Title>

					<ul style={{ margin: "30px 0" }}>
						<li>Click the redeem button to generate the code</li>
						<li>Use your code at checkout to get the discount</li>
						{has_user && <li>View you redeemed coupons <a style={{ color: "darkblue" }} onClick={() => this.userinfo_section_ref?.current?.scrollIntoView({ behavior: "smooth" })}>here</a></li>}
					</ul>

					<div className="nector-rewards-redeem-items">
						{(offers.map((offer) => (
							<ViewForm.RedeemItem {...this.props} key={offer._id} websdk_config={websdk_config} offer={offer} has_user={has_user} api_merchant_create_offerredeems={this.api_merchant_create_offerredeems} />
						)))}
					</div>

					<div className="nector-rewards-redeem-button">
						<Button type="primary" size="large" shape="round" href={rewardspage_config.redeem_section?.redeem_btn_redirect_url || undefined}>{rewardspage_config.redeem_section?.redeem_btn_text}</Button>
					</div>
				</div>}

				<div style={{ textAlign: "center", padding: "10px 0", backgroundColor: "#eee" }}>
					<antd.Typography.Text className="nector-pretext">Powered By <a href="https://nector.io" target="_blank" className="nector-text" style={{ textDecoration: "underline" }} rel="noreferrer">Nector</a></antd.Typography.Text>
				</div>
			</div>
		);
	}
}

RewardComponent.propTypes = properties;

export default RewardComponent;