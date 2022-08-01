/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//from system
import React, { useState } from "react";

import * as antd from "antd";
import * as antd_icons from "@ant-design/icons";

import * as react_ri_icons from "react-icons/ri";
import * as react_fi_icons from "react-icons/fi";
import * as react_antd_icons from "react-icons/ai";

import collection_helper from "../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);

	const dataSource = (props.websdkinfos && props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));
	const websdk_config_arr = dataSource.filter(x => x.name === "websdk_config") || [];
	const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
	const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

	const is_available = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	const expire_text = (is_available && item.expire) ? (Number(expires_in) > 0 ? `Expires in ${expires_in} days` : "Expires today") : ((is_available && !item.expire) ? "Available" : "Expired");

	const uploads = item.uploads || [];
	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };

	const base_coin_amount = Number((item.rule && item.rule.coin_amount) || 0);
	const coin_amount = (base_coin_amount / (Number(props.entity?.conversion_factor || 1) || 1)).toFixed(0);

	return (
		<antd.List.Item onClick={() => props.on_offer(item)}>
			<antd.List.Item.Meta
				avatar={<react_ri_icons.RiCoupon3Fill className="nector-subtitle" style={{ color: "#777" }} />}

				title={(
					<div className="nector-cursor-pointer" style={{ display: "flex", alignItems: "center" }}>
						<div style={{ flex: "1 0 0" }}>
							<antd.Typography.Paragraph className="nector-pretext" style={{ marginBottom: 2, display: "block", fontWeight: 500 }}>{item.name}</antd.Typography.Paragraph>
							<antd.Typography.Paragraph className="nector-lighttext" style={{ marginBottom: 2, display: "block" }}>Used by {Number(item.availed || 1)} buyer(s) in last 7 days</antd.Typography.Paragraph>
						</div>

						<div className="nector-subtext" style={{ color: "#444" }}>
							{collection_helper.get_safe_amount(coin_amount)} coins <react_antd_icons.AiOutlineRight className="nector-text" style={{ color: "#444" }} />
						</div>
					</div>
				)}
			/>
		</antd.List.Item>
	);
};

const MobileRenderDiscounts = (props) => {
	const { items = [], loading = false, websdk_config, initial_number_of_items_to_show = 3 } = props;
	const [show_more_items, set_show_more_items] = useState(false);
	const items_to_show = show_more_items ? items : items.slice(0, initial_number_of_items_to_show);

	const has_offer = websdk_config.hide_offer === true ? false : true;

	const sanitizedprops = collection_helper.get_lodash().omit(props, ["style", "className", "body_style"]);

	const on_show_items_toggle = () => {
		set_show_more_items(prev => !prev);
	};

	return (
		<div>
			<div style={props.body_style || {}}>
				<div className="nector-cursor-pointer" style={{ display: "flex", alignItems: "center", marginBottom: 10 }} onClick={() => has_offer && props.on_offerlist()}>
					<div style={{ flex: 1 }}>
						<antd.Typography.Text className="nector-text" style={{ fontWeight: 600, display: "flex", gap: 10 }}>
							Discounts for you
						</antd.Typography.Text>
					</div>

					{(has_offer) && <div className="nector-center nector-subtext nector-cursor-pointer nector-shimmer-animation" style={{ color: "#444", backgroundColor: "#eee", padding: "5px 10px", borderRadius: 4, gap: 4, border: "1px solid #000" }}>
						View More
					</div>}
				</div>

				<antd.List
					className="nector-list-with-divider"
					locale={{ emptyText: "We did not find anything at the moment, please try after sometime in case experiencing any issues." }}
					dataSource={items_to_show}
					loading={loading}
					bordered={false}
					renderItem={(item) => MobileRenderListItem(item, { ...sanitizedprops, item: item, websdk_config: websdk_config })}
				/>
			</div>

			{(items.length > initial_number_of_items_to_show) && (
				<div className="nector-center nector-subtext nector-cursor-pointer" style={{ borderTop: "1px solid #eee", padding: 10, gap: 5 }} onClick={on_show_items_toggle}>
					{show_more_items
						? <><span>Show Less</span> <antd_icons.ArrowUpOutlined /></>
						: <><span>Show More</span> <antd_icons.ArrowDownOutlined /></>
					}
				</div>
			)}
		</div>
	);
};

export {
	MobileRenderListItem, MobileRenderDiscounts
};