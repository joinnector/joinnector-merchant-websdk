/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//from system
import React from "react";
import * as react_icomoon_icons from "react-icons/im";
import * as react_hero_icons from "react-icons/hi";

import * as antd from "antd";

import collection_helper from "../../../helper/collection_helper";
import constant_helper from "../../../helper/constant_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props, is_last_item) => {
	// const default_search_params = collection_helper.get_default_params(props.location.search);
	const wallets = props.lead.wallets || props.lead.devwallets || [];

	const _picked_wallet = wallets.filter(x => x._id == item.wallet_id);
	const picked_wallet = _picked_wallet.length > 0 ? _picked_wallet[0] : {
		available: "",
		reserve: "",
	};

	const dataSource = (props.websdkinfos && props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));
	const websdk_config_arr = dataSource.filter(x => x.name === "websdk_config") || [];
	const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
	const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

	const wallettransaction_description = item.type === "redeem" ? `Your wallet has been ${item.type}ed by ${Number(item.amount)} coins` : `Congratulations! We have ${item.type}ed you ${Number(item.amount)} coins`;

	return (
		<antd.List.Item style={{ borderBottom: !is_last_item ? "1px solid #eee" : "none" }}>
			<antd.List.Item.Meta
				avatar={item.operation === "cr" ? (<react_hero_icons.HiPlusCircle className="nector-title" style={{ color: websdk_config.business_color }} />) : <react_hero_icons.HiMinusCircle className="nector-title" style={{ color: websdk_config.business_color }} />}

				title={<div style={{ marginLeft: -5 }}>
					<antd.Typography.Paragraph className="nector-text" style={{ marginBottom: 2, display: "block" }}>{item.title || collection_helper.get_text_from_wallettransaction_type_amount(item.type, item.amount)}</antd.Typography.Paragraph>
					<antd.Typography.Text className="nector-subtext" style={{ display: "block" }}>{collection_helper.get_moment()(item.created_at).format("MMMM Do YYYY, h:mm:ss a")}</antd.Typography.Text>
				</div>}

				description={<div style={{ marginLeft: -5, marginRight: 5 }}>
					<antd.Typography.Text className="nector-subtext" style={{ color: "#00000080", marginBottom: 2, display: "block" }}> {item.description || wallettransaction_description}</antd.Typography.Text>
				</div>}
			/>

			<span className="nector-subtext" style={{ color: item.operation === "cr" ? "green" : "red", paddingRight: 5 }}>
				{collection_helper.get_text_from_wallettransaction_operation(item.operation)} {Number(item.amount)}
			</span>
		</antd.List.Item>
	);
};

export {
	MobileRenderListItem
};