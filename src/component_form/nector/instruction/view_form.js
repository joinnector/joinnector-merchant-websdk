/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//from system
import React from "react";
import * as react_material_icons from "react-icons/md";

import * as antd from "antd";

import collection_helper from "../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props, is_last_item) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);

	const uploads = item.uploads || [];
	const picked_upload = uploads.length > 0 ? uploads[0] : { link: null };

	const dataSource = (props.websdkinfos && props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));
	const websdk_config_arr = dataSource.filter(x => x.name === "websdk_config") || [];
	const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
	const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

	return (
		<antd.List.Item style={{ borderBottom: !is_last_item ? "1px solid #eee" : "none" }}>
			<antd.List.Item.Meta
				avatar={<i className={`fa ${item.fa_icon || "fa-smile-o"} nector-subtitle`} style={{ color: websdk_config.business_color }}></i>}
				title={<div style={{ marginTop: -3, marginLeft: -5 }}>
					<antd.Typography.Text className="nector-text" style={{ display: "block" }}>{collection_helper.get_lodash().capitalize(item.name)}</antd.Typography.Text>
				</div>}
				description={<div style={{ marginLeft: -5, marginRight: 5 }}>
					<antd.Typography.Text className="nector-subtext" style={{ color: "#00000080", marginBottom: 2, display: "block" }}> {item.description}</antd.Typography.Text>
				</div>}
			/>

			<div style={{ marginRight: 10 }} onClick={() => props.api_merchant_create_triggeractivities({ trigger_id: item.trigger_id })}>
				{
					item.uri && (
						<a target="_blank" rel="noopener noreferrer" href={item.uri}><react_material_icons.MdKeyboardBackspace className="nector-backspace-rotate nector-subtitle" style={{ color: websdk_config.business_color }} /></a>
					)
				}
			</div>
		</antd.List.Item>
	);
};

export {
	MobileRenderListItem
};