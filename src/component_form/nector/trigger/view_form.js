/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//from system
import React from "react";
import * as react_material_icons from "react-icons/md";

import * as antd from "antd";

import * as analytics from "../../../analytics";
import constant_helper from "../../../helper/constant_helper";
import collection_helper from "../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props, is_last_item) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);

	const dataSource = (props.websdkinfos && props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));
	const websdk_config_arr = dataSource.filter(x => x.name === "websdk_config") || [];
	const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
	const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

	const content = item?.content;

	const on_triggercontent_link_click = () => {
		if (content.execute_after && content.execute_after === "link_click") {
			props.api_merchant_create_triggeractivities({ trigger_id: item._id });
		}

		if (item.content_type === "social") {
			analytics.capture_event(constant_helper.get_app_constant().COLLECTFRONT_EVENTS.SOCIAL_CLICK, props.entity._id, "entities", props.entity._id);
		}
	};

	if (!content) return null;

	return (
		<antd.List.Item style={{ borderBottom: !is_last_item ? "1px solid #eee" : "none" }}>
			<antd.List.Item.Meta
				avatar={<i className={`fa ${content.fa_icon || "fa-smile-o"} nector-subtitle`} style={{ color: websdk_config.business_color }}></i>}
				title={<div style={{ marginTop: -3, marginLeft: -5 }}>
					<antd.Typography.Text className="nector-text" style={{ display: "block" }}>{collection_helper.get_lodash().capitalize(content.name)}</antd.Typography.Text>
				</div>}
				description={<div style={{ marginLeft: -5, marginRight: 5 }}>
					<antd.Typography.Text className="nector-subtext" style={{ color: "#00000080", marginBottom: 2, display: "block" }}> {content.description}</antd.Typography.Text>
				</div>}
			/>

			{(content.redirect_link) && <div style={{ marginRight: 10 }} onClick={on_triggercontent_link_click}>
				<a target="_blank" rel="noopener noreferrer" href={content.redirect_link}><react_material_icons.MdKeyboardBackspace className="nector-backspace-rotate nector-subtitle" style={{ color: websdk_config.business_color }} /></a>
			</div>}
		</antd.List.Item>
	);
};

export {
	MobileRenderListItem
};