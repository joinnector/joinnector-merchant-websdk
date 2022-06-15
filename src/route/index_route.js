/* eslint-disable no-undef */
//from system
import React, { Suspense, lazy } from "react";

import * as react_router_dom from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// containers

import AppContainer from "../container/app_container";

import * as NectorContainer from "../container/nector";
import FullPageLoader from "../component/nector/common/full_page_loader";

const initialize_route = () => {

	return (<AppContainer>
		<AnimatePresence exitBeforeEnter>
			<Suspense fallback={<FullPageLoader />}>
				<react_router_dom.Switch>
					<react_router_dom.Route exact path="/nector" component={NectorContainer.HomeContainer} />
					<react_router_dom.Route exact path="/nector/wallettransaction-list" component={NectorContainer.WalletTransactionListContainer} />
					<react_router_dom.Route exact path="/nector/offer-list" component={NectorContainer.OfferListContainer} />
					<react_router_dom.Route exact path="/nector/coupon-list" component={NectorContainer.CouponListContainer} />

					<react_router_dom.Route exact path="/nector/waystoearn-list" component={NectorContainer.WaysToEarnListContainer} />

					<react_router_dom.Route exact path="/nector/review-list" component={lazy(() => import("../container/nector/review_container"))} />

					<react_router_dom.Route exact path="/nector/user" component={NectorContainer.ProfileContainer} />
					<react_router_dom.Route exact path="/nector/coupon" component={NectorContainer.CouponContainer} />
					<react_router_dom.Route exact path="/nector/referral" component={NectorContainer.ReferralContainer} />

					<react_router_dom.Redirect from='*' to={`/nector/${window.location.search}`} />
				</react_router_dom.Switch>
			</Suspense>
		</AnimatePresence>
	</AppContainer>
	);
};

export default initialize_route;