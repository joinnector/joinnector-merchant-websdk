//from system
import React from "react";

import prop_types from "prop-types";

import * as redux from "redux";
import * as react_redux from "react-redux";
import * as react_router_dom from "react-router-dom";

//from antd
import * as app_action from "../../store/action/app_action";

const properties = {
	location: prop_types.any.isRequired,
	history: prop_types.any.isRequired,
	path: prop_types.string.isRequired,

	systeminfos: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

class NotAuthenticatedContainer extends React.Component {
	render() {
		return (
			<react_router_dom.Route exact path={this.props.path} render={(props) => <this.props.component {...props} />} />
		);
	}
}

NotAuthenticatedContainer.propTypes = properties;

const map_state_to_props = state => ({
	systeminfos: state.app_reducer.systeminfos,
});

const map_dispatch_to_props = dispatch => ({
	app_action: redux.bindActionCreators(app_action, dispatch)
});

export default react_router_dom.withRouter(react_redux.connect(map_state_to_props, map_dispatch_to_props, null, { pure: false })(NotAuthenticatedContainer));