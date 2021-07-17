/* eslint-disable react/prop-types */
//from system
import React from "react";

import * as antd from "antd";

import collection_helper from "../../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const DesktopRenderListItem = (item, props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const uploads = item.uploads || [];

	const is_available = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	const expire_text = (is_available && item.expire) ? (Number(expires_in) > 0 ? `Expires in ${expires_in} days` : "Expires today") : ((is_available && !item.expire) ? "Available" : "Expired");

	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };

	// const hexcolor = random_color({ luminosity: "dark", seed: (item.name || "nector") });

	return (
		<antd.List.Item onClick={() => props.on_task(item)}>
			<antd.List.Item.Meta
				avatar={<antd.Avatar size={50} src={picked_upload.link} />}
				title={<div>
					<antd.Typography.Paragraph style={{ fontSize: "1em", fontWeight: 600, marginBottom: 2, display: "block" }}>{item.name}</antd.Typography.Paragraph>
					<antd.Typography.Text style={{ fontSize: "0.8em", display: "block" }}>{expire_text}</antd.Typography.Text>
				</div>}
				description={<div>
					<antd.Typography.Text style={{ fontSize: "0.8em", color: "#00000080", marginBottom: 2, display: "block" }}>{item.description}</antd.Typography.Text>
				</div>}
			/>
		</antd.List.Item>
	);
};

export {
	DesktopRenderListItem
};