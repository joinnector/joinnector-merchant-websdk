/* eslint-disable react/prop-types */
//from system
import React from "react";

import * as antd from "antd";

// import * as react_material_icons from "react-icons/md";
// import * as react_font_awesome from "react-icons/fa";
import * as react_feature_icons from "react-icons/fi";


import collection_helper from "../../../../helper/collection_helper";
// import constant_helper from "../../../../helper/constant_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const NOTIFICATION_AVATAR_MAP = {
		deal_reward: <react_feature_icons.FiGift className="nector-icon" style={{ color: default_search_params.icon_color }} />,
		voucher_create: <react_feature_icons.FiGift className="nector-icon" style={{ color: default_search_params.icon_color }} />,
		task_activity_progress: <react_feature_icons.FiTrendingUp className="nector-icon" style={{ color: default_search_params.icon_color }} />,
		task_activity_completed: <react_feature_icons.FiCheckCircle className="nector-icon" style={{ color: default_search_params.icon_color }} />,
		surprise_activity_completed: <react_feature_icons.FiCheckCircle className="nector-icon" style={{ color: default_search_params.icon_color }} />,
		wallet_redeem: <react_feature_icons.FiChevronsUp className="nector-icon" style={{ color: default_search_params.icon_color }} />,
		wallet_reward: <react_feature_icons.FiChevronsDown className="nector-icon" style={{ color: default_search_params.icon_color }} />,
		wallet_swap: <react_feature_icons.FiMinus className="nector-icon" style={{ color: default_search_params.icon_color }} />,
		wallet_adjust: <react_feature_icons.FiAlertCircle className="nector-icon" style={{ color: default_search_params.icon_color }} />
	};

	return (
		<antd.List.Item>
			<antd.List.Item.Meta
				avatar={<antd.Avatar icon={NOTIFICATION_AVATAR_MAP[item.event]} />}
				title={<div>
					<antd.Typography.Paragraph style={{ fontSize: "1em", fontWeight: 600, marginBottom: 2, display: "block" }}>{item.title}</antd.Typography.Paragraph>
					<antd.Typography.Text style={{ fontSize: "0.8em", display: "block" }}>{collection_helper.get_moment()(item.created_at).format("MMMM Do YYYY, h:mm:ss a")}</antd.Typography.Text>
				</div>}
				description={<div>
					<antd.Typography.Text style={{ fontSize: "0.8em", color: "#00000070", marginBottom: 2, display: "block" }}>{item.description}</antd.Typography.Text>
				</div>}
			/>
		</antd.List.Item>
	);
};

export {
	MobileRenderListItem
};