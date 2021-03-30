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

	// mounted
	componentDidMount() {
		axios_wrapper.init();
		security_wrapper.init();

		// init reducers
		this.api_open_get_systeminfos(this.props);
		this.api_merchant_get_leads(this.props);
	}

	// unmount
	componentWillUnmount() {

	}

	api_open_get_systeminfos(props) {
		const search_params = collection_helper.process_url_params(props.location.search);
		const base_url = search_params.get("base_url") || null;
		const base_endpoint = search_params.get("base_endpoint") || "nector-delegate";

		const authorization = search_params.get("authorization") || null;

		if (collection_helper.validate_is_null_or_undefined(base_url) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_GET_LEAD,
			base_url: base_url,
			endpoint: base_endpoint,
			params: {},
			authorization: authorization,
			attributes: {
				method: "get_systeminfos",
				query: {},
				params: {},
				body: {}
			}
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {

		});
	}

	api_merchant_get_leads(props) {
		const search_params = collection_helper.process_url_params(props.location.search);
		const base_url = search_params.get("base_url") || null;
		const base_endpoint = search_params.get("base_endpoint") || "nector-delegate";

		const authorization = search_params.get("authorization") || null;

		const lead_id = search_params.get("lead_id") || null;
		const customer_id = search_params.get("customer_id") || null;
		const email = search_params.get("email") || null;
		const mobile = search_params.get("mobile") || null;

		let method = null;
		if (collection_helper.validate_not_null_or_undefined(lead_id) === true) method = "get_leads";
		else if (collection_helper.validate_not_null_or_undefined(customer_id) === true) method = "get_leads_by_customer_id";
		else if (collection_helper.validate_not_null_or_undefined(email) === true) method = "get_leads_by_email";
		else if (collection_helper.validate_not_null_or_undefined(mobile) === true) method = "get_leads_by_mobile";

		if (collection_helper.validate_is_null_or_undefined(base_url) === true) return null;
		if (collection_helper.validate_is_null_or_undefined(method) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_GET_LEAD,
			base_url: base_url,
			endpoint: base_endpoint,
			params: {},
			authorization: authorization,
			attributes: {
				method: method,
				query: {},
				params: {},
				body: {}
			}
		};

		if (method === "get_leads") opts.attributes.params.id = lead_id;
		if (method === "get_leads_by_customer_id") opts.attributes.query.customer_id = customer_id;
		if (method === "get_leads_by_email") opts.attributes.query.email = email;
		if (method === "get_leads_by_mobile") opts.attributes.query.mobile = mobile;

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
			<antd.Layout>
				<antd.Layout.Content style={{ padding: "1%" }}>
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