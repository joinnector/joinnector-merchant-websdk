/* eslint-disable react/prop-types */
//from system
import React from "react";

import * as antd from "antd";

import collection_helper from "../../../../helper/collection_helper";
import constant_helper from "../../../../helper/constant_helper";

// eslint-disable-next-line no-unused-vars
const DesktopRenderListItem = (item, props) => {
	return (
		<antd.List.Item>
			<antd.List.Item.Meta
				avatar={<antd.Avatar icon={constant_helper.get_setting_constant().NOTIFICATION_AVATAR_MAP[item.event]} />}
				title={<div>
					<antd.Typography.Paragraph style={{ fontSize: "1em", fontWeight: 600, marginBottom: 2, display: "block" }}>{item.title}</antd.Typography.Paragraph>
					<antd.Typography.Text style={{ fontSize: "0.8em", display: "block" }}>{collection_helper.get_moment()(item.created_at).format("MMMM Do YY, h:mm:ss a")}</antd.Typography.Text>
				</div>}
				description={<div>
					<antd.Typography.Text style={{ fontSize: "0.8em", color: "#00000070", marginBottom: 2, display: "block" }}>{item.description}</antd.Typography.Text>
				</div>}
			/>
		</antd.List.Item>
	);
};

export {
	DesktopRenderListItem
};