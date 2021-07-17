/* eslint-disable react/prop-types */
//from system
import React from "react";

import * as antd from "antd";

import collection_helper from "../../../../helper/collection_helper";
// import constant_helper from "../../../../helper/constant_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const uploads = item.uploads || [];

	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };

	// const hexcolor = random_color({ luminosity: "dark", seed: (item.name || "nector") });

	return (
		<antd.List.Item onClick={() => props.on_surprise(item)}>
			<antd.List.Item.Meta
				avatar={<antd.Avatar size={50} src={picked_upload.link} />}
				title={<div>
					<antd.Typography.Paragraph style={{ fontSize: "1em", fontWeight: 600, marginBottom: 2, display: "block" }}>{item.name}</antd.Typography.Paragraph>
				</div>}
				description={<div>
					<antd.Typography.Text style={{ fontSize: "0.8em", color: "#00000080", marginBottom: 2, display: "block" }}>{item.description}</antd.Typography.Text>
				</div>}
			/>
		</antd.List.Item>
	);
};

export {
	MobileRenderListItem
};