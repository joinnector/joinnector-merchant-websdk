/* eslint-disable react/prop-types */
//from system
import React from "react";

import * as antd from "antd";

// import * as react_material_icons from "react-icons/md";
import * as react_font_awesome from "react-icons/fa";

import collection_helper from "../../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const DesktopRenderListItem = (item, props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const uploads = item.uploads || [];
	const wallets = props.lead.wallets || props.lead.devwallets || [];

	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };
	const picked_wallet = wallets.length > 0 ? wallets[0] : {
		available: "0",
		reserve: "0",
		currency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") },
		devcurrency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") }
	};

	return (
		<antd.List.Item>
			<antd.List.Item.Meta
				avatar={<antd.Image style={{ width: 70, height: 70 }} src={picked_upload.link} />}
				title={<div>
					<antd.Typography.Paragraph style={{ fontSize: "1.3em", fontWeight: 600, marginBottom: 2, display: "block" }}>{item.name}</antd.Typography.Paragraph>
				</div>}
				description={<div>
					<antd.Typography.Text style={{ fontSize: "0.8em", color: "#00000080", marginBottom: 2, display: "block" }}>{item.description}</antd.Typography.Text>
					<antd.Typography.Text style={{ fontSize: "1.1em", fontWeight: 600, display: "block" }}>{Math.ceil(Number(item.sell_price || 0) / (picked_wallet.currency || picked_wallet.devcurrency).conversion_factor || 1).toFixed((picked_wallet.currency || picked_wallet.devcurrency).place || 1)} {collection_helper.get_lodash().upperFirst((picked_wallet.currency || picked_wallet.devcurrency).currency_code)}</antd.Typography.Text>
					<antd.Button onClick={() => props.on_offer(item)} style={{ fontSize: "0.8em", display: "block", textAlign: "center"}} type="primary" shape="circle"><react_font_awesome.FaPlay size={15}/></antd.Button>
				</div>}
			/>
		</antd.List.Item>
	);
};

export {
	DesktopRenderListItem
};