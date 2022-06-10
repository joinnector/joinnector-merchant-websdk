/* eslint-disable no-unused-vars */
//from system
import React from "react";
import ReactRipples from "react-ripples";
// import ReactPullToRefresh from "react-simple-pull-to-refresh";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import prop_types from "prop-types";
import * as react_material_icons from "react-icons/md";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";
import axios_wrapper from "../../wrapper/axios_wrapper";

import * as ViewForm from "../../component_form/nector/instruction/view_form";
import Button from "./common/button";

import * as antd from "antd";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	websdkinfos: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,
	instructions: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class InstructionListComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,

			page: 1,
			limit: 10,
		};

		this.api_merchant_list_waystoearninstructions = this.api_merchant_list_waystoearninstructions.bind(this);
		this.api_merchant_get_leads = this.api_merchant_get_leads.bind(this);
		this.api_merchant_create_triggeractivities = this.api_merchant_create_triggeractivities.bind(this);

		this.process_list_data = this.process_list_data.bind(this);

		this.on_refresh = this.on_refresh.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		// eslint-disable-next-line no-undef


		this.on_refresh();
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.lead._id != this.props.lead._id) {
			this.api_merchant_list_waystoearninstructions({ page: 1, limit: 10, lead_id: nextProps.lead._id });
		}

		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	api_merchant_list_waystoearninstructions(values) {
		let list_filters = collection_helper.get_lodash().pick(collection_helper.process_objectify_params(this.props.location.search), ["sort", "sort_op", "page", "limit"]);

		this.set_state({ page: list_filters.page || values.page || 1, limit: list_filters.limit || values.limit || 10 });

		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_INSTRUCTION_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: values.append_data || false,
			attributes: {
				...axios_wrapper.get_wrapper().fetch({
					page: values.page || 1,
					limit: values.limit || 10,
					sort: values.sort || "score",
					sort_op: values.sort_op || "DESC",
					type: "ways_to_earn",
					...list_filters,
				}, "instruction")
			}
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {
			this.set_state({ loading: false });
		});
	}

	api_merchant_get_leads() {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);

		const lead_id = search_params.get("lead_id") || null;
		const customer_id = search_params.get("customer_id") || null;

		let method = null;
		if (collection_helper.validate_not_null_or_undefined(lead_id) === true) method = "get_leads";
		else if (collection_helper.validate_not_null_or_undefined(customer_id) === true) method = "get_leads_by_customer_id";

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;
		if (collection_helper.validate_is_null_or_undefined(method) === true) return null;

		let lead_params = {};
		let lead_query = {};
		if (method === "get_leads") {
			lead_params = { id: lead_id };
		} else if (method === "get_leads_by_customer_id") {
			lead_query = { customer_id: customer_id };
		}

		let attributes = {};
		if (collection_helper.validate_not_null_or_undefined(lead_params.id) === true) {
			attributes = axios_wrapper.get_wrapper().get(lead_id, "lead");
		} else if (collection_helper.validate_not_null_or_undefined(lead_query.customer_id) === true
			&& collection_helper.validate_not_null_or_undefined(default_search_params.identifier)) {
			attributes = axios_wrapper.get_wrapper().get_by("customer_id", collection_helper.process_key_join([default_search_params.identifier, customer_id], "-"), "lead");
		} else if (collection_helper.validate_not_null_or_undefined(lead_query.customer_id) === true) {
			attributes = axios_wrapper.get_wrapper().get_by("customer_id", customer_id, "lead");
		}

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_GET_LEAD,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			attributes: {
				...attributes
			}
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {

		});
	}

	api_merchant_create_triggeractivities(values) {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		const lead_id = this.props.lead._id;
		const trigger_id = values.trigger_id;

		if (collection_helper.validate_is_null_or_undefined(trigger_id) === true
			|| collection_helper.validate_is_null_or_undefined(lead_id) === true) return null;

		const triggeropts = {
			event: constant_helper.get_app_constant().API_SUCCESS_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				...axios_wrapper.get_wrapper().create({
					trigger_id: trigger_id,
					lead_id: lead_id
				}, "triggeractivity", "create")
			}
		};

		this.set_state({ loading: true });
		this.props.app_action.api_generic_post(triggeropts, (result) => {
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
				this.props.app_action.internal_generic_dispatch(wallettransactionopts, (result) => {

				});
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
				this.props.app_action.internal_generic_dispatch(couponopts, (result) => {

				});
			}
		});

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_instruction_follow_request, {
				trigger_id: trigger_id
			});
	}

	process_list_data() {
		return (this.props.instructions && this.props.instructions.items || []).map(item => ({ ...item, key: item._id }));
	}

	on_refresh(force = false) {
		if (force === true) {
			// to load the partial component
			this.set_state({ page: 1, limit: 10 });
			return new Promise(resolve => {
				this.api_merchant_list_waystoearninstructions({ page: 1, limit: 10 });
				return resolve(true);
			});
		}

		if (collection_helper.validate_is_null_or_undefined(this.props.instructions) === true
			|| collection_helper.validate_is_null_or_undefined(this.props.instructions.items) === true
			|| (collection_helper.validate_not_null_or_undefined(this.props.instructions.items) === true && this.props.instructions.items.length < 1)) {
			this.api_merchant_list_waystoearninstructions({ page: 1, limit: 10 });
		} else if (collection_helper.validate_not_null_or_undefined(this.props.instructions) === true
			&& collection_helper.validate_not_null_or_undefined(this.props.instructions.items) === true
			&& (collection_helper.validate_not_null_or_undefined(this.props.instructions.items) === true && this.props.instructions.items.length > 0)) {
			if (this.props.instructions.items[0].type !== "ways_to_earn") this.api_merchant_list_waystoearninstructions({ page: 1, limit: 10 });
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
		const data_source = this.process_list_data();
		const count = (this.props.instructions && this.props.instructions.count || 0);

		const render_load_more = () => {
			if (!this.state.loading) {
				if (Number(count) <= data_source.length) return <div />;
				return (<div style={{ textAlign: "center", padding: "2%", marginTop: 5, marginBottom: 5 }}>
					<Button type="primary" style={{ fontSize: "1em", }} onClick={() => this.api_merchant_list_waystoearninstructions({ page: Math.floor(Number(data_source.length) / this.state.limit) + 1, append_data: true })}>Load more</Button>
				</div>);
			} else {
				return <div />;
			}
		};

		return (
			<div>
				{/* <ReactPullToRefresh onRefresh={() => this.on_refresh(true)} pullingContent={""} refreshingContent={""}> */}
				<div>
					<antd.Card className="nector-card" style={{ padding: 0, minHeight: "10%", borderBottom: "1px solid #eeeeee00" }} bordered={false} bodyStyle={{ padding: 20, paddingBottom: 0 }}>
						<div style={{ display: "flex", marginBottom: 10 }} onClick={() => this.props.history.goBack()}>
							<h2><react_material_icons.MdKeyboardBackspace className="nector-icon" style={{ background: "#eee", color: "#000", borderRadius: 10 }}></react_material_icons.MdKeyboardBackspace></h2>
						</div>

						<div style={{ display: "flex", flex: 1, alignItems: "center", marginBottom: 20 }}>
							<div style={{ display: "flex", flex: 1 }}>
								<h1 style={{ marginBottom: "0" }}>Earn</h1>
							</div>
						</div>

						<antd.List
							locale={{ emptyText: "We did not find anything at the moment, please try after sometime in case experiencing any issues." }}
							dataSource={data_source}
							loading={this.state.loading}
							bordered={false}
							size="small"
							loadMore={render_load_more()}
							renderItem={(item, index) => ViewForm.MobileRenderListItem(item, { ...this.props, api_merchant_create_triggeractivities: this.api_merchant_create_triggeractivities }, index === data_source?.length - 1)}
						/>
					</antd.Card>
				</div>
				{/* </ReactPullToRefresh> */}
			</div>
		);
	}
}

InstructionListComponent.propTypes = properties;

export default InstructionListComponent;