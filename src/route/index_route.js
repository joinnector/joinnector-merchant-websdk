//from system
import React from "react";

import * as react_router_dom from "react-router-dom";
import * as framer_motion from "framer-motion";

// containers

import AppContainer from "../container/app_container";

import * as NectorContainer from "../container/nector"; 

const initialize_route = () => (
	<AppContainer>
		<framer_motion.AnimatePresence exitBeforeEnter>
			<react_router_dom.Switch>
				<react_router_dom.Route exact path="/nector/profile" component={NectorContainer.ProfileContainer} />
				<react_router_dom.Route exact path="/nector/coupon-list" component={NectorContainer.CouponListContainer} />
				<react_router_dom.Route exact path="/nector/coupon" component={NectorContainer.CouponContainer} />
				<react_router_dom.Route exact path="/nector/deal-list" component={NectorContainer.DealListContainer} />
				<react_router_dom.Route exact path="/nector/deal" component={NectorContainer.DealContainer} />
				<react_router_dom.Route exact path="/nector/offer-list" component={NectorContainer.OfferListContainer} />
				<react_router_dom.Route exact path="/nector/notification-list" component={NectorContainer.NotificationListContainer} />
				<react_router_dom.Route exact path="/nector/surprise-list" component={NectorContainer.SurpriseListContainer} />

				<react_router_dom.Route exact path="/nector/task-list" component={NectorContainer.TaskListContainer} />
				<react_router_dom.Route exact path="/nector/taskactivity-list" component={NectorContainer.TaskActivityListContainer} />
				<react_router_dom.Route exact path="/nector/wallettransaction-list" component={NectorContainer.WalletTransactionListContainer} />
				{/* <react_router_dom.Redirect from='*' to='/nector/deal-list' /> */}
			</react_router_dom.Switch>
		</framer_motion.AnimatePresence>
	</AppContainer>
);

export default initialize_route;