/* eslint-disable react/prop-types */
//from system
import React from "react";

import * as antd from "antd";
import * as antd_icons from "@ant-design/icons";

import collection_helper from "../../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props) => {
	const task = props.task && Object.keys(props.task).length > 0 ? props.task : {
		name: "",
		description: "",
		count: "0",
		expire: null,
		uploads: [{ link: "https://res.cloudinary.com/esternetwork/image/upload/v1617280550/nector/images/logowhite.svg" }],
	};

	const timeline_text = Number(item.remaining_count) > 0 ? `Complete ${item.remaining_count} more activity to get rewarded` : "Congratulations, we have rewarded you for completing this campaign";
	const timeline_icon = Number(item.remaining_count) > 0 ? item.remaining_count : <antd_icons.CheckCircleFilled style={{ background: "transparent", color: "green", fontSize: "2em" }} />;
	const timeline_color = Number(item.remaining_count) > 0 ? (Number(item.remaining_count) > 1 ? "grey" : "blue") : "green";

	return (
		<antd.List.Item>
			<antd.List.Item.Meta
				avatar={
					<antd.Badge count={timeline_icon} style={{ background: timeline_color }}/>
				}
				title={<div>
					<antd.Typography.Paragraph style={{ fontSize: "1em", fontWeight: 600, marginBottom: 2, display: "block" }}>{timeline_text}</antd.Typography.Paragraph>
					<antd.Typography.Text style={{ fontSize: "0.8em", display: "block" }}>{collection_helper.get_moment()(item.created_at).format("MMMM Do YY, h:mm:ss a")}</antd.Typography.Text>
				</div>}
				description={<div>
					<antd.Typography.Text style={{ fontSize: "0.8em", color: "#00000070", marginBottom: 2, display: "block" }}>{task.name}</antd.Typography.Text>
				</div>}
			/>
		</antd.List.Item>
	);
};

export {
	MobileRenderListItem
};