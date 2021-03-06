//from system
import React from "react";
import { m, LazyMotion, domAnimation } from "framer-motion";

import prop_types from "prop-types";

import * as redux from "redux";
import * as react_redux from "react-redux";
import * as react_router_dom from "react-router-dom";

import * as  app_action from "../../store/action/app_action";

import ReferralComponent from "../../component/nector/referral_component";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	businessinfos: prop_types.object.isRequired,
	websdkinfos: prop_types.object.isRequired,
	actioninfos: prop_types.object.isRequired,
	entity: prop_types.object.isRequired,
	referral_triggers: prop_types.object.isRequired,
	triggers: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};


class ReferralContainer extends React.Component {

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
			<LazyMotion features={domAnimation}>
				<m.div
					initial={{ y: -100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 100, opacity: 0 }}>
					<ReferralComponent {...this.props} />
				</m.div>
			</LazyMotion>
		);
	}
}

ReferralContainer.propTypes = properties;

const map_state_to_props = state => ({
	systeminfos: state.app_reducer.systeminfos,
	businessinfos: state.app_reducer.businessinfos,
	websdkinfos: state.app_reducer.websdkinfos,
	actioninfos: state.app_reducer.actioninfos,
	entity: state.app_reducer.entity,
	lead: state.app_reducer.lead,
	referral_triggers: state.app_reducer.referral_triggers,
	triggers: state.app_reducer.triggers,
});

const map_dispatch_to_props = dispatch => ({
	app_action: redux.bindActionCreators(app_action, dispatch)
});

export default react_router_dom.withRouter(react_redux.connect(map_state_to_props, map_dispatch_to_props, null, { pure: false })(ReferralContainer));