/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//from system
import React from "react";
import * as react_material_icons from "react-icons/md";

import * as antd from "antd";

import collection_helper from "../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);

	return (
		<antd.List.Item style={{ padding: 4, }}>
			<antd.Card className="nector-instruction-card" style={{ padding: 0, }}>
				<div style={{ display: "flex", flex: 1, flexDirection: "row", alignItems: "center" }}>
					<div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
						<antd.Typography.Paragraph style={{ fontSize: "1em", fontWeight: 600, marginBottom: 2, display: "block" }}>{collection_helper.get_lodash().capitalize(item.name)}</antd.Typography.Paragraph>
						<antd.Typography.Text style={{ fontSize: "0.7em", display: "block" }}>{item.description}</antd.Typography.Text>
					</div>
					<div style={{ width: 10, }}>  </div>
					<div onClick={() => props.api_merchant_create_actionactivities({ action_id: item.action_id })}>
						{
							item.uri && (
								<a target="_blank" rel="noopener noreferrer" href={item.uri}><react_material_icons.MdKeyboardBackspace className="nector-icon backspace-rotate" style={{ color: "#000" }} /></a>
							)
						}
					</div>
				</div>
			</antd.Card>
		</antd.List.Item>
	);
};

export {
	MobileRenderListItem
};