/* eslint-disable react/prop-types */
//from system
import React from "react";

import * as antd from "antd";

import collection_helper from "../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const deal = item.deal || item.devdeal || {};
	const discount = item.discount || item.devdiscount || {};

	const connecteditem = item.parent_type === "deals" ? deal : discount;

	const is_available = collection_helper.convert_to_moment_utc_from_datetime(connecteditem.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(connecteditem.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	const expire_text = (is_available && connecteditem.expire) ? (Number(expires_in) > 0 ? `Expires in ${expires_in} days` : "Expires today") : ((is_available && !connecteditem.expire) ? "Available" : "Expired");

	const uploads = connecteditem.uploads || [];
	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };

	return (
		<antd.List.Item onClick={() => props.on_coupon(item)}>
			<antd.List.Item.Meta
				avatar={<antd.Avatar className="nector-brand-icon" style={{ background: "#eeeeee", borderRadius: 10, height: 40, width: 70, border: "3px solid #eeeeee" }} src={picked_upload.link} />}
				title={<div>
					<antd.Typography.Paragraph style={{ fontSize: "1em", fontWeight: 600, marginBottom: 2, display: "block" }}>{collection_helper.get_lodash().capitalize(connecteditem.name)}</antd.Typography.Paragraph>
					<antd.Typography.Text style={{ fontSize: "0.7em", display: "block" }}>{expire_text}</antd.Typography.Text>
				</div>}
				description={<div>
					<antd.Typography.Text style={{ fontSize: "0.6em", color: "#00000080", marginBottom: 2, display: "block" }}> {collection_helper.get_limited_text(connecteditem.description, 50)}</antd.Typography.Text>
				</div>}
			/>
		</antd.List.Item>
	);
};

export {
	MobileRenderListItem
};