//from system
import React from "react";
import { m, LazyMotion, domAnimation } from "framer-motion";
import * as react_sizeme from "react-sizeme";

import prop_types from "prop-types";

import * as redux from "redux";
import * as react_redux from "react-redux";
import * as react_router_dom from "react-router-dom";

import * as  app_action from "../../store/action/app_action";

import OfferListComponent from "../../component/nector/offerlist_component";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	offerbrandinfos: prop_types.object.isRequired,
	offercategoryinfos: prop_types.object.isRequired,
	websdkinfos: prop_types.object.isRequired,

	entity: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,
	offers: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};


class OfferListContainer extends React.Component {

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
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -100, opacity: 0 }}>
					<react_sizeme.SizeMe>
						{({ size }) => <OfferListComponent {...this.props} size_info={size} />}
					</react_sizeme.SizeMe>
				</m.div>
			</LazyMotion>
		);
	}
}

OfferListContainer.propTypes = properties;

const map_state_to_props = state => ({
	systeminfos: state.app_reducer.systeminfos,
	offerbrandinfos: state.app_reducer.offerbrandinfos,
	offercategoryinfos: state.app_reducer.offercategoryinfos,
	websdkinfos: state.app_reducer.websdkinfos,

	entity: state.app_reducer.entity,
	lead: state.app_reducer.lead,
	offers: state.app_reducer.offers,
});

const map_dispatch_to_props = dispatch => ({
	app_action: redux.bindActionCreators(app_action, dispatch)
});

export default react_router_dom.withRouter(react_redux.connect(map_state_to_props, map_dispatch_to_props, null, { pure: false })(OfferListContainer));