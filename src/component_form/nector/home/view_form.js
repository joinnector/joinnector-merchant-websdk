/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//from system
import React from "react";

import * as antd from "antd";

import * as react_fa_icons from "react-icons/fa";
import * as react_tb_icons from "react-icons/tb";
import * as react_antd_icons from "react-icons/ai";
import * as react_bs_icons from "react-icons/bs";

import Button from "../../../component/nector/common/button";

import collection_helper from "../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props, is_last_item) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const wallets = props.lead.wallets || props.lead.devwallets || [];

	const dataSource = (props.websdkinfos && props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));
	const websdk_config_arr = dataSource.filter(x => x.name === "websdk_config") || [];
	const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
	const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

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
		<antd.List.Item style={{ borderBottom: !is_last_item ? "1px solid #eee" : "none" }} onClick={() => props.on_offer(item)}>
			<antd.List.Item.Meta
				title={(
					<div style={{ display: "flex", alignItems: "center" }}>
						<div style={{ flex: "1 0 0" }}>
							<antd.Typography.Paragraph className="nector-pretext" style={{ marginBottom: 2, display: "block", fontWeight: "bold" }}>{item.name}</antd.Typography.Paragraph>
							<antd.Typography.Paragraph className="nector-lighttext" style={{ marginBottom: 2, display: "block" }}>Used by {Number(item.availed || 1)} buyer(s) in last 7 days</antd.Typography.Paragraph>
						</div>

						<div style={{ marginLeft: "auto" }}>
							<Button className="nector-subtext" size="small" style={{ color: "white", borderRadius: 3, marginRight: 15 }}>{collection_helper.get_safe_amount(coin_amount)} coins</Button>
							<react_antd_icons.AiOutlineRight className="nector-text" style={{ color: websdk_config.business_color || "#000" }} />
						</div>
					</div>
				)}
			/>
		</antd.List.Item>
	);
};

function MobileRenderActionCards(props) {
	const { shadow = false } = props;

	return (
		<div style={{ display: "flex", gap: 15 }}>
			<div style={{ flex: "1 0 0", backgroundColor: "white", padding: "10px 20px", borderRadius: 8, position: "relative", overflow: "hidden", cursor: "pointer", boxShadow: shadow ? "3px 5px 30px -10px rgba(0,0,0,0.6)" : "unset" }} onClick={props.on_offerlist}>
				<div className="nector-text" style={{ fontWeight: 500, color: "#475569" }}>
					<div>Browse</div>
					<div>All Offers</div>
				</div>

				<div style={{ position: "absolute", bottom: 5, right: 5 }}>
					<react_tb_icons.TbDiscount2 style={{ color: "#eee", fontSize: 38 }} />
				</div>
			</div>

			<div style={{ flex: "1 0 0", backgroundColor: "white", padding: "10px 20px", borderRadius: 8, position: "relative", overflow: "hidden", cursor: "pointer", boxShadow: shadow ? "3px 5px 30px -10px rgba(0,0,0,0.6)" : "unset" }} onClick={() => props.on_instructionlist("waystoearn")}>
				<div className="nector-text" style={{ fontWeight: 500, color: "#475569" }}>
					<div>Ways</div>
					<div>To Earn</div>
				</div>

				<div style={{ position: "absolute", bottom: 10, right: 10 }}>
					<react_fa_icons.FaCoins style={{ color: "#eee", fontSize: 32 }} />
				</div>
			</div>
		</div>
	);
}

export {
	MobileRenderListItem, MobileRenderActionCards
};