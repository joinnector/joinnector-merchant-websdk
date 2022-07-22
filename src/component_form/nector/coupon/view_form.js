/* eslint-disable react/prop-types */
//from system
import React from "react";

import * as antd from "antd";

import collection_helper from "../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const offer = item.offer || {};

	const is_available = collection_helper.convert_to_moment_utc_from_datetime(offer.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(offer.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	const expire_text = (is_available && offer.expire) ? (Number(expires_in) > 0 ? `Expires in ${expires_in} days` : "Expires today") : ((is_available && !offer.expire) ? "Available" : "Expired");

	const uploads = offer.uploads || [];
	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };

	return (
		<antd.List.Item className="nector-list-item" onClick={() => props.on_coupon(item)} style={{ marginTop: 10, paddingBottom: 20, borderBottom: "1px solid #eeeeee", cursor: "pointer" }}>
			<antd.List.Item.Meta
				avatar={<antd.Avatar shape="square" style={{ height: "auto", width: 70, borderRadius: 0 }} src={picked_upload.link} />}

				title={<div>
					<antd.Typography.Paragraph className="nector-text" style={{ marginBottom: 2, display: "block" }}>{offer.name}</antd.Typography.Paragraph>
					<antd.Typography.Text className="nector-subtext" style={{ display: "block" }}>{expire_text}</antd.Typography.Text>
				</div>}

				description={<div>
					<antd.Typography.Text className="nector-subtext" style={{ color: "#00000080", marginBottom: 2, display: "block" }}> {collection_helper.get_limited_text(offer.description, 50)}</antd.Typography.Text>
				</div>}
			/>
		</antd.List.Item>
	);
};

export {
	MobileRenderListItem
};