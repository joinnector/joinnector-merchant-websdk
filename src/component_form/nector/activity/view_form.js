/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//from system
import React from "react";
import * as react_ai_icons from "react-icons/ai";

import * as antd from "antd";

import * as analytics from "../../../analytics";
import constant_helper from "../../../helper/constant_helper";
import collection_helper from "../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props, is_last_item) => {

	const dataSource = (props.websdkinfos && props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));
	const websdk_config_arr = dataSource.filter(x => x.name === "websdk_config") || [];
	const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
	const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

	const meta = item.meta || {};

	if (Object.keys(meta).length < 1) return null;

	let title = meta.is_triggerer === true ? `Referred by ${meta.referredbyname || "your friend"}` : `You referred ${meta.referredtoname || "your friend"}`;
	let description = meta.is_processed === false ? `Will be processed on ${meta.execute_after === "make_transaction" ? "first transaction" : meta.execute_after}` : "Congratulations! Referral reward processed";

	if (!title || !description) return null;

	return (
		<antd.List.Item style={{ borderBottom: !is_last_item ? "1px solid #eee" : "none" }}>
			<antd.List.Item.Meta
				avatar={meta.is_processed === true ? (<react_ai_icons.AiOutlineCheckCircle className="nector-title" style={{ color: meta.is_processed === true ? "green" : "red" }} />) : <react_ai_icons.AiOutlineClockCircle className="nector-title" style={{ color: meta.is_processed === true ? "green" : "orange" }} />}

				title={<div style={{ marginLeft: -5 }}>
					<antd.Typography.Paragraph className="nector-text" style={{ marginBottom: 2, display: "block" }}>{title}</antd.Typography.Paragraph>
					<antd.Typography.Text className="nector-subtext" style={{ display: "block" }}>{collection_helper.get_moment()(item.created_at).format("MMMM Do YYYY, h:mm:ss a")}</antd.Typography.Text>
				</div>}

				description={<div style={{ marginLeft: -5, marginRight: 5 }}>
					<antd.Typography.Text className="nector-subtext" style={{ color: "#00000080", marginBottom: 2, display: "block" }}> {description}</antd.Typography.Text>
				</div>}
			/>

		</antd.List.Item>
	);
};

export {
	MobileRenderListItem
};