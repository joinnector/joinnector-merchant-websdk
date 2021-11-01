/* eslint-disable no-undef */
//from system
import React from "react";

import * as react_router_dom from "react-router-dom";
import * as framer_motion from "framer-motion";

// containers

import AppContainer from "../container/app_container";

import * as NectorContainer from "../container/nector";

const initialize_route = () => {

	return (<AppContainer>
		<framer_motion.AnimatePresence exitBeforeEnter>
			<react_router_dom.Switch>

				<react_router_dom.Route exact path="/nector" component={NectorContainer.HomeContainer} />
				<react_router_dom.Route exact path="/nector/wallettransaction-list" component={NectorContainer.WalletTransactionListContainer} />
				<react_router_dom.Route exact path="/nector/coupon-list" component={NectorContainer.CouponListContainer} />
				<react_router_dom.Route exact path="/nector/coupon" component={NectorContainer.CouponContainer} />
				<react_router_dom.Route exact path="/nector/deal-list" component={NectorContainer.DealListContainer} />
				<react_router_dom.Route exact path="/nector/instruction-list" component={NectorContainer.InstructionListContainer} />

				<react_router_dom.Redirect from='*' to={`/nector/${window.location.search}`} />
			</react_router_dom.Switch>
		</framer_motion.AnimatePresence>
	</AppContainer>
	);
};

export default initialize_route;