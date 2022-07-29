/* eslint-disable indent */
/* eslint-disable no-unused-vars */
//from system
import React from "react";

import { ScrollMenu } from "react-horizontal-scrolling-menu";
import prop_types from "prop-types";
import * as react_material_icons from "react-icons/md";
import * as react_game_icons from "react-icons/gi";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";

import * as analytics from "../../analytics";

import * as ViewForm from "../../component_form/nector/offer/view_form";
import * as MiscViewForm from "../../component_form/nector/misc/view_form";

import Button from "./common/button";

import * as antd from "antd";
import { InView } from "react-intersection-observer";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	offerbrandinfos: prop_types.object.isRequired,
	offercategoryinfos: prop_types.object.isRequired,
	websdkinfos: prop_types.object.isRequired,

	businessoffers: prop_types.object.isRequired,
	recommendedoffers: prop_types.object.isRequired,
	internaloffers: prop_types.object.isRequired,
	topoffers: prop_types.object.isRequired,

	entity: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class OfferListComponent extends React.Component {
	constructor(props) {
		super(props);

		const params = collection_helper.process_url_params(this.props.location.search);
		params.set("offertype", params.get("offertype") || "businessoffers");
		this.props.history.replace(`?${params.toString()}`);

		this.state = {
			drawer_visible: false,

			action: "view",
			action_item: null,

			active_key: params.get("offertype"),

			loading: false,

			category: "All",

			page: 1,
			limit: 10,
		};

		this.process_list_data = this.process_list_data.bind(this);
		this.process_get_offertype_info = this.process_get_offertype_info.bind(this);

		this.on_offer = this.on_offer.bind(this);

		this.on_signup = this.on_signup.bind(this);
		this.on_signin = this.on_signin.bind(this);
		this.on_tab_change = this.on_tab_change.bind(this);

		this.toggle_drawer = this.toggle_drawer.bind(this);

		this.render_offer_item = this.render_offer_item.bind(this);
		this.render_drawer_action = this.render_drawer_action.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		// eslint-disable-next-line no-undef

		const params = collection_helper.process_url_params(this.props.location.search);
		const active_key = params.get("offertype");
		if (active_key && active_key != this.state.active_key) this.setState({ active_key: active_key });
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	UNSAFE_componentWillReceiveProps(nextProps) {
		const oldparams = collection_helper.process_url_params(this.props.location.search);
		const params = collection_helper.process_url_params(nextProps.location.search);
		if (params.get("offertype") !== oldparams.get("offertype") && params.get("offertype")) this.setState({ active_key: params.get("offertype") });
	}

	// unmount
	componentWillUnmount() {
		const search_params = collection_helper.process_url_params(this.props.location.search);
		if (search_params.get("visibility") === "private") {
			// clear offers
			this.props.app_action.internal_generic_dispatch({
				event: constant_helper.get_app_constant().API_MERCHANT_LIST_OFFER_DISPATCH,
				attributes: {}
			});
		}
	}

	render_offer_item(item, websdk_config) {
		return (
			<InView
				threshold={0.75}
				fallbackInView={false}
				triggerOnce={true}
				onChange={(inView, entry) => {
					if (inView === true) {
						analytics.capture_event(constant_helper.get_app_constant().COLLECTFRONT_EVENTS.OFFER_VIEW, item.entity_id, "offers", item._id);
					}
				}}
			>
				{({ inView, ref, entry }) => (
					<div
						ref={ref}
					>
						{ViewForm.MobileRenderListItem(item, { ...this.props, on_offer: this.on_offer, websdk_config })}
					</div>
				)}
			</InView>
		);
	}

	process_list_data(offertype) {
		return (this.props[offertype] && this.props[offertype].items || []).map(item => ({ ...item, key: item._id }));
	}

	process_get_offertype_info(offertype, websdk_config) {
		switch (offertype) {
			case "businessoffers":
				return {
					title: "For You"
				};
			case "internaloffers":
				return {
					title: "Exclusive"
				};
			case "recommendedoffers":
				return {
					title: "Recommended"
				};
			case "topoffers":
				return {
					title: "Top"
				};
		}
	}

	// eslint-disable-next-line no-unused-vars
	on_offer(record) {
		const has_user = (this.props.lead && this.props.lead._id) || false;

		if (has_user) {
			const opts = {
				event: constant_helper.get_app_constant().INTERNAL_DISPATCH,
				append_data: false,
				attributes: {
					key: "offer",
					value: {
						...record
					}
				}
			};

			// eslint-disable-next-line no-unused-vars
			this.props.app_action.internal_generic_dispatch(opts, (result) => {
				const search_params = collection_helper.process_url_params(this.props.location.search);
				search_params.set("offer_id", record._id);
				this.props.history.push(`/nector/offer?${search_params.toString()}`);
			});

			analytics.capture_event(constant_helper.get_app_constant().COLLECTFRONT_EVENTS.OFFER_CLICK, record.entity_id, "offers", record._id);

			require("../../analytics")
				.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_offer_open_request, {
					offer_id: record._id
				});
		} else {
			this.set_state({ action: "dead_click" });
			this.toggle_drawer();
		}
	}

	on_signup(signup_link) {
		analytics.send_events({ event: constant_helper.get_app_constant().COLLECTFRONT_EVENTS.SIGNUP_CLICK, entity_id: this.props.entity._id, id_type: "entities", id: this.props.entity._id, incr_by: 1 });

		setTimeout(() => {
			window.open(signup_link, "_parent");
		}, 150);
	}

	on_signin(e, signin_link) {
		e.preventDefault();

		analytics.send_events({ event: constant_helper.get_app_constant().COLLECTFRONT_EVENTS.SIGNIN_CLICK, entity_id: this.props.entity._id, id_type: "entities", id: this.props.entity._id, incr_by: 1 });

		setTimeout(() => {
			window.open(signin_link, "_parent");
		}, 150);
	}

	on_tab_change(active_key) {
		this.setState({ active_key: active_key });

		const params = collection_helper.process_url_params(this.props.location.search);
		params.set("offertype", active_key);
		this.props.history.replace(`?${params.toString()}`);
	}

	toggle_drawer() {
		// eslint-disable-next-line no-unused-vars
		this.setState((state, props) => ({
			drawer_visible: !state.drawer_visible
		}));
	}

	render_drawer_action() {
		if (this.state.action === "dead_click") {
			return <MiscViewForm.MobileRenderDeadClickViewItem {...this.props} drawer_visible={this.state.drawer_visible} toggle_drawer={this.toggle_drawer} on_signin={this.on_signin} on_signup={this.on_signup} />;
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
		const search_params = collection_helper.process_url_params(this.props.location.search);

		const dataSource = (this.props.websdkinfos && this.props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));

		const websdk_config_arr = dataSource.filter(x => x.name === "websdk_config") || [];
		const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
		const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

		let offertypes = ["businessoffers"];
		if (websdk_config?.hide_offer === false) offertypes = offertypes.concat(["internaloffers", "recommendedoffers", "topoffers"]);

		const offertype = this.state.active_key;
		const is_loading = this.props[offertype]?.loading || false;

		const wallets = this.props.lead.wallets || this.props.lead.devwallets || [];

		const picked_wallet = wallets.length > 0 ? wallets[0] : {
			available: "0",
			reserve: "0",
		};

		const data_source = this.process_list_data(offertype);

		const has_user = (this.props.lead && this.props.lead._id) || false;

		const drawerClassName = has_user ? "" : "nector-signup-drawer";

		return (
			<div>
				<div>
					<antd.Card className="nector-card" style={{ padding: 0, minHeight: "10%", borderBottom: "1px solid #eeeeee00" }} bordered={false}>
						<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
								<div style={{ display: "flex" }} onClick={() => this.props.history.goBack()}>
									<h1><react_material_icons.MdKeyboardBackspace className="nector-icon" style={{ background: "#eee", color: "#000", borderRadius: 6 }}></react_material_icons.MdKeyboardBackspace></h1>
								</div>

								{has_user && <div className="nector-wallet-point-design" onClick={this.on_wallettransactionlist}>
									<react_game_icons.GiTwoCoins className="nector-text" style={{ color: websdk_config.business_color }} /> {collection_helper.get_safe_amount(picked_wallet.available)}
								</div>}
							</div>
						</antd.PageHeader>

						<div style={{ marginTop: 20 }}>
							<antd.Tabs
								className="nector-offer-tabs"
								activeKey={this.state.active_key}
								onChange={this.on_tab_change}
								animated={false}>
								{offertypes.map((offertype) => (
									<antd.Tabs.TabPane tab={this.process_get_offertype_info(offertype, websdk_config).title} key={offertype}>
										<antd.List
											// grid={{ gutter: 8, xs: 2, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
											locale={{ emptyText: "We did not find anything at the moment, please try after sometime in case experiencing any issues." }}
											dataSource={data_source}
											loading={is_loading}
											bordered={false}
											size="small"
											renderItem={(item, index) => this.render_offer_item(item, websdk_config)}
										/>
									</antd.Tabs.TabPane>
								))}
							</antd.Tabs>
						</div>
					</antd.Card>
				</div>
				{/* </ReactPullToRefresh> */}

				<antd.Drawer className={drawerClassName} placement="bottom" onClose={this.toggle_drawer} visible={this.state.drawer_visible} closable={false} destroyOnClose={true}>
					{this.render_drawer_action()}
				</antd.Drawer>
			</div>
		);
	}
}

OfferListComponent.propTypes = properties;

export default OfferListComponent;