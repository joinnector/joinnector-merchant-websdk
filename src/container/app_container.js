/* eslint-disable no-unused-vars */
//from system
import prop_types from "prop-types";
import React from "react";

import * as antd from "antd";
import * as react_redux from "react-redux";
import * as react_router_dom from "react-router-dom";
import * as redux from "redux";
import * as app_action from "../store/action/app_action";

import collection_helper from "../helper/collection_helper";
import constant_helper from "../helper/constant_helper";

import axios_wrapper from "../wrapper/axios_wrapper";
import security_wrapper from "../wrapper/security_wrapper";
import * as analytics from "../analytics";


const properties = {
	children: prop_types.object.isRequired,
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	entity: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};


class AppContainer extends React.Component {

	constructor(props) {
		super(props);

		this.api_merchant_get_aggreegateddetails = this.api_merchant_get_aggreegateddetails.bind(this);
		this.api_merchant_get_aggreegatedoffers = this.api_merchant_get_aggreegatedoffers.bind(this);
		this.api_merchant_get_entities = this.api_merchant_get_entities.bind(this);
		this.api_merchant_get_leads = this.api_merchant_get_leads.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// eslint-disable-next-line react/no-deprecated
	UNSAFE_componentWillMount() {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		axios_wrapper.init(default_search_params.api_key);
		security_wrapper.init();
	}

	// mounted
	componentDidMount() {
		this.api_merchant_get_aggreegateddetails();

		this.events_timer_id = setInterval(() => {
			analytics.discover_and_emit_events();
		}, collection_helper.get_lodash().random(10000, 11000));
		// the interval is random to avoid double processing of events in case multiple nector iframes on same hostpage (ex. websdk & reviews together)
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	// unmount
	componentWillUnmount() {
		if (this.events_timer_id) {
			clearInterval(this.events_timer_id);
			this.events_timer_id = null;
		}
	}

	api_merchant_get_aggreegateddetails() {
		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_GET_AGGREEGATEDDETAILS,
			url: url,
			endpoint: "api/v2/merchant/aggreegateddetails",
			append_data: false,
			has_algo: collection_helper.validate_not_null_or_undefined(default_search_params.api_key_algo),
			params: {},
		};

		this.props.app_action.api_generic_get(opts, (result) => {
			if (result.meta.status === "success"
				&& result.data
				&& result.data.businessinfos
				&& result.data.businessinfos.entity
				&& result.data.businessinfos.entity._id) {
				const opts = {
					event: constant_helper.get_app_constant().INTERNAL_DISPATCH,
					append_data: false,
					attributes: {
						key: "entity",
						value: result.data.businessinfos.entity
					}
				};

				// eslint-disable-next-line no-unused-vars
				this.props.app_action.internal_generic_dispatch(opts);
				analytics.capture_event(constant_helper.get_app_constant().COLLECTFRONT_EVENTS.WEBSDK_VIEW, result.data.businessinfos.entity._id, "entities", result.data.businessinfos.entity._id);
			} else {
				this.api_merchant_get_entities();
			}

			// fetch leads
			this.api_merchant_get_leads();
		});
	}

	api_merchant_get_entities() {
		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_GET_ENTITY,
			url: url,
			endpoint: `api/v2/merchant/entities/${collection_helper.process_new_uuid()}`,
			append_data: false,
			has_algo: collection_helper.validate_not_null_or_undefined(default_search_params.api_key_algo),
			params: {},
		};

		this.props.app_action.api_generic_get(opts, (result) => {
			if (result.meta.status === "success" && result.data && result.data.item && result.data.item._id) analytics.capture_event(constant_helper.get_app_constant().COLLECTFRONT_EVENTS.WEBSDK_VIEW, result.data.item._id, "entities", result.data.item._id);
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
			&& collection_helper.validate_is_null_or_undefined(lead_id)) {
			this.props.app_action.internal_generic_dispatch({
				event: constant_helper.get_app_constant().API_MERCHANT_GET_LEAD,
				attributes: {}
			});

			this.api_merchant_get_aggreegatedoffers();

			return null;
		}

		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_GET_LEAD,
			url: url,
			endpoint: `api/v2/merchant/leads/${lead_id}`,
			append_data: false,
			has_algo: collection_helper.validate_not_null_or_undefined(default_search_params.api_key_algo),
			params: {
				...lead_params
			},
		};

		this.props.app_action.api_generic_get(opts, (result) => {
			if (result.meta.status !== "success") {
				this.props.app_action.internal_generic_dispatch({
					event: constant_helper.get_app_constant().API_MERCHANT_GET_LEAD,
					attributes: {}
				});
			}

			const tier = result?.data?.item?.tier || null;
			this.api_merchant_get_aggreegatedoffers(tier);
		});
	}

	api_merchant_get_aggreegatedoffers(tier = null) {
		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		let time_segment = collection_helper.get_time_segment();

		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_GET_AGGREEGATEDOFFERS,
			url: url,
			endpoint: "api/v2/merchant/aggreegatedoffers",
			append_data: false,
			has_algo: collection_helper.validate_not_null_or_undefined(default_search_params.api_key_algo),
			params: {
				tier: tier,
				time_segment: time_segment
			},
		};

		this.props.app_action.api_generic_get(opts);
	}

	set_state(values) {
		// eslint-disable-next-line no-unused-vars
		this.setState((state, props) => ({
			...state,
			...values,
		}));
	}

	render() {
		return (
			<antd.Layout style={{ padding: 0 }}>
				<antd.Layout.Content style={{ padding: 0, }}>
					{this.props.children}
				</antd.Layout.Content>
			</antd.Layout>
		);
	}
}

AppContainer.propTypes = properties;

const map_state_to_props = state => ({
	systeminfos: state.app_reducer.systeminfos,
	entity: state.app_reducer.entity,
	lead: state.app_reducer.lead,
});

const map_dispatch_to_props = dispatch => ({
	app_action: redux.bindActionCreators(app_action, dispatch),
});

export default react_router_dom.withRouter(react_redux.connect(map_state_to_props, map_dispatch_to_props, null, { pure: false })(AppContainer));