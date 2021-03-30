//from system
import React from "react";

import * as react_router_dom from "react-router-dom";

// containers

import AuthenticatedContainer from "../container/misc/authenticated_container";
// import NotAuthenticatedContainer from "../container/misc/not_authenticated_container";

import AppContainer from "../container/app_container";


import ProfileContainer from "../container/account/profile_container";

import DealListContainer from "../container/deal/list_container";
import TaskListContainer from "../container/task/list_container";
import SwapListContainer from "../container/swap/list_container";
import WalletListContainer from "../container/wallet/list_container";
import WalletTransactionListContainer from "../container/wallettransaction/list_container";
import ReviewListContainer from "../container/review/list_container";
import TaskActivityListContainer from "../container/taskactivity/list_container";
import NotificationListContainer from "../container/notification/list_container";
import CouponListContainer from "../container/coupon/list_container";

import NotFoundContainer from "../container/misc/not_found_container";
import MaintenanceContainer from "../container/misc/maintenance_container";

const initialize_route = () => (
	<AppContainer>
		<react_router_dom.Switch>
			<AuthenticatedContainer exact path="/profile" component={ProfileContainer} />

			<AuthenticatedContainer exact path="/deal-list" component={DealListContainer} />
			<AuthenticatedContainer exact path="/task-list" component={TaskListContainer} />
			<AuthenticatedContainer exact path="/swap-list" component={SwapListContainer} />
			<AuthenticatedContainer exact path="/coupon-list" component={CouponListContainer} />
			<AuthenticatedContainer exact path="/wallet-list" component={WalletListContainer} />
			<AuthenticatedContainer exact path="/wallettransaction-list" component={WalletTransactionListContainer} />
			<AuthenticatedContainer exact path="/review-list" component={ReviewListContainer} />
			<AuthenticatedContainer exact path="/taskactivity-list" component={TaskActivityListContainer} />
			<AuthenticatedContainer exact path="/notification-list" component={NotificationListContainer} />
			<react_router_dom.Route path='/404' component={NotFoundContainer} />
			<react_router_dom.Route path='/maintenance' component={MaintenanceContainer} />
			<react_router_dom.Redirect from='*' to='/404' />
		</react_router_dom.Switch>
	</AppContainer>
);

export default initialize_route;