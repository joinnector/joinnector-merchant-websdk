/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//from system
import React from "react";

import * as antd from "antd";

import collection_helper from "../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const wallets = props.lead.wallets || props.lead.devwallets || [];
	const websdk_config = props.websdk_config || {};
	const item = props.item;

	const is_available = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	const expire_text = (is_available && item.expire) ? (Number(expires_in) > 0 ? `Expires in ${expires_in} days` : "Expires today") : ((is_available && !item.expire) ? "Available" : "Expired");

	const uploads = item.uploads || [];
	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };
	const picked_wallet = wallets.length > 0 ? wallets[0] : {
		available: "0",
		reserve: "0",
	};

	const base_coin_amount = Number((item.rule && item.rule.coin_amount) || 0);
	const coin_amount = (base_coin_amount / (Number(props.entity?.conversion_factor || 1) || 1)).toFixed(0);

	return (
		<antd.List.Item className="nector-list-item nector-cursor-pointer" style={{ padding: "15px 0", paddingRight: 10 }} onClick={() => props.on_offer(item)}>
			<antd.List.Item.Meta
				avatar={<antd.Avatar shape="square" style={{ height: "auto", width: 70, borderRadius: 0 }} src={picked_upload.link} />}
				title={(
					<div>
						<antd.Typography.Paragraph className="nector-text" style={{ marginBottom: 2, display: "block", fontWeight: 500 }}>{item.name}</antd.Typography.Paragraph>

						{/* <antd.Typography.Text className="nector-subtext" style={{ color: "#00000080", marginBottom: 2, display: "block" }}> {collection_helper.get_limited_text(item.description, 50)}</antd.Typography.Text> */}

						{(item.category) && <span className="nector-center nector-subtext" style={{ display: "inline-flex", backgroundColor: "#dce3e8", borderRadius: 20, padding: "3px 15px", margin: "5px 0", color: "#5b7282" }}>
							{collection_helper.convert_to_string_first_capital_from_any_string(item.category)}
						</span>}
					</div>
				)}
				description={(
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10 }}>
						{/* <antd.Tag color="orange" style={{ padding: "3px 10px" }}>{coin_amount} Coins</antd.Tag> */}

						<div className="nector-pretext" style={{ backgroundColor: websdk_config.business_color, color: websdk_config.text_color, padding: "5px 12px", borderRadius: 4 }}>
							{coin_amount} Coins
						</div>

						<antd.Typography.Text className="nector-lighttext" style={{ display: "block" }}>{expire_text}</antd.Typography.Text>
					</div>
				)}
			/>
		</antd.List.Item>
	);
};

export {
	MobileRenderListItem
};