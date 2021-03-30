/* eslint-disable react/prop-types */
//from system
import React from "react";

import * as antd from "antd";

// eslint-disable-next-line no-unused-vars
const DesktopRenderListItem = (item) => {
	return (
		<antd.List.Item>
			<antd.Card>Desktop Card Content</antd.Card>
		</antd.List.Item>
	);
};

export {
	DesktopRenderListItem
};