/* eslint-disable react/prop-types */
//from system
import React from "react";

import * as antd from "antd";

// import * as react_material_icons from "react-icons/md";
import * as react_font_awesome from "react-icons/fa";


import collection_helper from "../../../../helper/collection_helper";
// import constant_helper from "../../../../helper/constant_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const uploads = item.uploads || [];
	
	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };
	
	return (
		<antd.List.Item>
			<antd.List.Item.Meta
				avatar={<antd.Image style={{ width: 70, height: 70 }} src={picked_upload.link} />}
				title={<div>
					<antd.Typography.Paragraph style={{ fontSize: "1.3em", fontWeight: 600, marginBottom: 2, display: "block" }}>{item.name}</antd.Typography.Paragraph>
				</div>}
				description={<div>
					<antd.Typography.Text style={{ fontSize: "0.8em", color: "#00000080", marginBottom: 2, display: "block" }}>{item.description}</antd.Typography.Text>
					<antd.Button onClick={() => props.on_offer(item)} style={{ fontSize: "0.8em", display: "block", textAlign: "center"}} type="primary" shape="circle"><react_font_awesome.FaPlay size={15}/></antd.Button>
				</div>}
			/>
		</antd.List.Item>
	);
};

export {
	MobileRenderListItem
};