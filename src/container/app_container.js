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


const properties = {
	children: prop_types.object.isRequired,
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};


class AppContainer extends React.Component {

	constructor(props) {
		super(props);

		this.api_open_get_systeminfos = this.api_open_get_systeminfos.bind(this);
		this.api_merchant_get_leads = this.api_merchant_get_leads.bind(this);
		this.set_state = this.set_state.bind(this);
	}

	// eslint-disable-next-line react/no-deprecated
	componentWillMount() {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		axios_wrapper.init(default_search_params.url, default_search_params.api_key, default_search_params.api_secret);
		security_wrapper.init();
	}

	// mounted
	componentDidMount() {
		// init reducers
		this.api_open_get_systeminfos();
		this.api_merchant_get_leads();
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	api_open_get_systeminfos() {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_OPEN_GET_SYSTEMINFOS,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			attributes: {
				delegate_attributes: {
					method: "get_systeminfos",
					body: {},
					params: {},
					query: {},
				},
				regular_attributes: {
					...axios_wrapper.get_wrapper().get("", "system", "info")
				}
			}
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {

		});
	}

	api_merchant_get_leads() {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);

		const lead_id = search_params.get("lead_id") || null;
		const customer_id = search_params.get("customer_id") || null;
		const email = search_params.get("email") || null;
		const mobile = search_params.get("mobile") || null;

		let method = null;
		if (collection_helper.validate_not_null_or_undefined(lead_id) === true) method = "get_leads";
		else if (collection_helper.validate_not_null_or_undefined(customer_id) === true) method = "get_leads_by_customer_id";
		else if (collection_helper.validate_not_null_or_undefined(email) === true) method = "get_leads_by_email";
		else if (collection_helper.validate_not_null_or_undefined(mobile) === true) method = "get_leads_by_mobile";

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;
		if (collection_helper.validate_is_null_or_undefined(method) === true) return null;

		let lead_params = {};
		let lead_query = {};
		if (method === "get_leads") {
			lead_params = { id: lead_id };
		} else if (method === "get_leads_by_customer_id") {
			lead_query = { customer_id: customer_id };
		} else if (method === "get_leads_by_email") {
			lead_query = { email: email };
		} else if (method === "get_leads_by_mobile") {
			lead_query = { mobile: mobile };
		}

		let regular_attributes = {};
		if (collection_helper.validate_not_null_or_undefined(lead_params.id) === true) {
			regular_attributes = axios_wrapper.get_wrapper().get(lead_id, "lead");
		} else if (collection_helper.validate_not_null_or_undefined(lead_query.customer_id) === true) {
			regular_attributes = axios_wrapper.get_wrapper().get_by("customer_id", customer_id, null, "lead");
		} else if (collection_helper.validate_not_null_or_undefined(lead_query.email) === true) {
			regular_attributes = axios_wrapper.get_wrapper().get_by("email", email, null, "lead");
		} else if (collection_helper.validate_not_null_or_undefined(lead_query.mobile) === true) {
			regular_attributes = axios_wrapper.get_wrapper().get_by("mobile", mobile, null, "lead");
		}

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_GET_LEAD,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			attributes: {
				delegate_attributes: {
					method: method,
					body: {},
					params: {
						...lead_params
					},
					query: {
						...lead_query
					},
				},
				regular_attributes: {
					...regular_attributes
				}
			}
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {

		});
	}

	set_state(values) {
		// eslint-disable-next-line no-unused-vars
		this.setState((state, props) => ({
			...state,
			...values,
		}));
	}

	render() {
		// const show_layout = [""].indexOf(this.props.location.pathname) > -1 ? false : true;
		return (
			// <antd.Layout>
			// <antd.Layout.Content style={{ padding: "1%" }}>
			<antd.Layout style={{ padding: 0 }}>
				<antd.Layout.Content style={{ padding: 0 }}>
					{this.props.children}
				</antd.Layout.Content>
			</antd.Layout>
		);
	}
}

AppContainer.propTypes = properties;

const map_state_to_props = state => ({
	systeminfos: state.app_reducer.systeminfos,
	lead: state.app_reducer.lead,
});

const map_dispatch_to_props = dispatch => ({
	app_action: redux.bindActionCreators(app_action, dispatch)
});

export default react_router_dom.withRouter(react_redux.connect(map_state_to_props, map_dispatch_to_props, null, { pure: false })(AppContainer));