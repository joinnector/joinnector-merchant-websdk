//from system
import React from "react";

import * as react_router_dom from "react-router-dom";

// containers

import AppContainer from "../container/app_container";

import * as NectorContainer from "../container/nector"; 

const initialize_route = () => (
	<AppContainer>
		<react_router_dom.Switch>
			<react_router_dom.Route exact path="/nector/profile" component={NectorContainer.ProfileContainer} />
			<react_router_dom.Route exact path="/nector/coupon" component={NectorContainer.CouponContainer} />
			<react_router_dom.Route exact path="/nector/deal-list" component={NectorContainer.DealListContainer} />
			<react_router_dom.Route exact path="/nector/deal" component={NectorContainer.DealContainer} />
			<react_router_dom.Route exact path="/nector/notification-list" component={NectorContainer.NotificationListContainer} />
			<react_router_dom.Route exact path="/nector/task-list" component={NectorContainer.TaskListContainer} />
			<react_router_dom.Route exact path="/nector/taskactivity-list" component={NectorContainer.TaskActivityListContainer} />
			<react_router_dom.Route exact path="/nector/wallettransaction-list" component={NectorContainer.WalletTransactionListContainer} />
			{/* <react_router_dom.Redirect from='*' to='/nector/deal-list' /> */}
		</react_router_dom.Switch>
	</AppContainer>
);

export default initialize_route;