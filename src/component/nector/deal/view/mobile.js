/* eslint-disable react/prop-types */
//from system
import React from "react";

import * as antd from "antd";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item) => {
	return (
		<antd.List.Item>
			<antd.Layout>
				<antd.Card> Mobile Card Content </antd.Card>
			</antd.Layout>
		</antd.List.Item>
	);
};

export {
	MobileRenderListItem
};