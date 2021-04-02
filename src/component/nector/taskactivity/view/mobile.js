/* eslint-disable react/prop-types */
//from system
import React from "react";

import * as antd from "antd";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props) => {
	
	return (
		<antd.List.Item>
			<antd.Card>Mobile Card Content</antd.Card>
		</antd.List.Item>
	);
};

export {
	MobileRenderListItem
};