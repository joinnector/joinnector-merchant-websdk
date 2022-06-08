/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//from system
import React from "react";
import * as react_material_icons from "react-icons/md";
import * as react_name_icons from "react-icons/im";

import * as antd from "antd";
import * as antd_icons from "@ant-design/icons";

import collection_helper from "../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);

	const uploads = item.uploads || [];
	const picked_upload = uploads.length > 0 ? uploads[0] : { link: null };

	const dataSource = (props.websdkinfos && props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));
	const websdk_config_arr = dataSource.filter(x => x.name === "websdk_config") || [];
	const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
	const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

	return (
		<antd.List.Item>
			<antd.List.Item.Meta
				avatar={<i className={`fa ${item.fa_icon || "fa-smile-o"}`} style={{ marginLeft: 5, fontSize: 30, color: websdk_config.business_color }}></i>}
				title={<div>
					<antd.Typography.Paragraph style={{ fontSize: "1em", fontWeight: 600, marginBottom: 2, display: "block" }}>{collection_helper.get_lodash().capitalize(item.name)}</antd.Typography.Paragraph>
				</div>}
				description={<div>
					<antd.Typography.Text style={{ fontSize: "0.9em", color: "#00000080", marginBottom: 2, display: "block" }}> {item.description}</antd.Typography.Text>
				</div>}
			/>
			<div onClick={() => props.api_merchant_create_triggeractivities({ trigger_id: item.trigger_id })}>
				{
					item.uri && (
						<a target="_blank" rel="noopener noreferrer" href={item.uri}><react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ color: websdk_config.business_color, fontSize: 25 }} /></a>
					)
				}
			</div>
		</antd.List.Item>
	);
};

export {
	MobileRenderListItem
};