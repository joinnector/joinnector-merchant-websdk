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
const MobileRenderListItem = (item, props) => {
	// const default_search_params = collection_helper.get_default_params(props.location.search);
	const wallets = props.lead.wallets || props.lead.devwallets || [];

	const _picked_wallet = wallets.filter(x => x._id == item.wallet_id);
	const picked_wallet = _picked_wallet.length > 0 ? _picked_wallet[0] : {
		available: "",
		reserve: "",
	};

	return (
		<antd.List.Item>
			<antd.List.Item.Meta
				avatar={item.operation === "cr" ? (<react_hero_icons.HiPlusCircle className="nector-icon" style={{ color: "#000" }} />) : <react_hero_icons.HiMinusCircle className="nector-icon" style={{ color: "#000" }} />}
				title={<div>
					<antd.Typography.Paragraph style={{ fontSize: "1em", fontWeight: 600, marginBottom: 2, display: "block" }}>{collection_helper.get_text_from_wallettransaction_type_amount(item.type, item.amount)}</antd.Typography.Paragraph>
					<antd.Typography.Text style={{ fontSize: "0.7em", display: "block" }}>{collection_helper.get_moment()(item.created_at).format("MMMM Do YYYY, h:mm:ss a")}</antd.Typography.Text>
				</div>}
				description={<div>
					<antd.Typography.Text style={{ fontSize: "0.6em", color: "#00000080", marginBottom: 2, display: "block" }}> {collection_helper.get_string_templater()(constant_helper.get_setting_constant().WALLET_TRANSACTION_TITLE_MAP[item.type], { type: item.type, amount: Number(item.amount), operation: collection_helper.get_text_from_wallettransaction_operation(item.operation) })}</antd.Typography.Text>
				</div>}
			/>
			<b>{collection_helper.get_text_from_wallettransaction_operation(item.operation)} {Number(item.amount)}</b>
		</antd.List.Item>
	);
};

export {
	MobileRenderListItem
};