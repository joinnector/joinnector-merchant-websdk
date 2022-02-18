//from system
import React from "react";

import * as react_dom from "react-dom";
import * as history from "history"; // static app
import * as react_router_dom from "react-router-dom";
import * as react_redux from "react-redux";


import index_route from "./route/index_route";
import index_store from "./store/index_store";


import "antd/dist/antd.less";
import "./style/app.less";

// const import_css = () => {
// 	// eslint-disable-next-line no-undef
// 	console.log(window.location.search);
// 	return null;
// };

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

// eslint-disable-next-line no-undef
window.addEventListener("message", function (event) {
	// Need to check for safety as we are going to process only our messages
	// So Check whether event with data(which contains any object) contains our message here its "FrameHeight"
	if (event.data == "FrameHeight") {

		//event.source contains parent page window object 
		//which we are going to use to send message back to main page here "abc.com/page"

		//parentSourceWindow = event.source;

		//Calculate the maximum height of the page
		// eslint-disable-next-line no-undef
		var body = document.body, html = document.documentElement;
		var height = Math.max(body.scrollHeight, body.offsetHeight,
			html.clientHeight, html.scrollHeight, html.offsetHeight);

		// Send height back to parent page "abc.com/page"
		event.source.postMessage({ "FrameHeight": height }, "*");       
	}
});