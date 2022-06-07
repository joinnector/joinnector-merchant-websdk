//from system
import React from "react";
import * as framer_motion from "framer-motion";
import * as react_sizeme from "react-sizeme";

import prop_types from "prop-types";

import * as redux from "redux";
import * as react_redux from "react-redux";
import * as react_router_dom from "react-router-dom";

import * as  app_action from "../../store/action/app_action";

import WaysToEarnListComponent from "../../component/nector/waystoearnlist_component";

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


class WaysToEarnListContainer extends React.Component {

	constructor(props) {
		super(props);
	}

	// mounted
	componentDidMount() {

	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	render() {
		return (
			<framer_motion.motion.div
				initial={{ y: 100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: -100, opacity: 0 }}>
				<react_sizeme.SizeMe>
					{({ size }) => <WaysToEarnListComponent {...this.props} size_info={size} />}
				</react_sizeme.SizeMe>
			</framer_motion.motion.div>
		);
	}
}

WaysToEarnListContainer.propTypes = properties;

const map_state_to_props = state => ({
	systeminfos: state.app_reducer.systeminfos,
	websdkinfos: state.app_reducer.websdkinfos,
	lead: state.app_reducer.lead,
	instructions: state.app_reducer.instructions,
});

const map_dispatch_to_props = dispatch => ({
	app_action: redux.bindActionCreators(app_action, dispatch)
});

export default react_router_dom.withRouter(react_redux.connect(map_state_to_props, map_dispatch_to_props, null, { pure: false })(WaysToEarnListContainer));