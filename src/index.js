//from system
import React from "react";

import * as react_dom from "react-dom";
import * as history from "history"; // static app
import * as react_router_dom from "react-router-dom";
import * as react_redux from "react-redux";


import index_route from "./route/index_route";
import index_store from "./store/index_store";


import "antd/dist/antd.css";
import "./style/app.css";

// eslint-disable-next-line no-undef
window.onload = () => {
	react_dom.render(
		<react_redux.Provider store={index_store()}>
			<react_router_dom.Router history={history.createBrowserHistory()}>
				{index_route()}
			</react_router_dom.Router>
		</react_redux.Provider>, 
		// eslint-disable-next-line no-undef
		document.getElementById("root")
	);
};
