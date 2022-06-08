/* eslint-disable react/prop-types */
import React from "react";
import * as antd from "antd";
import { useSelector } from "react-redux";

import collection_helper from "../../../helper/collection_helper";

function Button(props) {
	const dataSource = useSelector(state => state.app_reducer.websdkinfos);
	const websdk_config_arr = dataSource && dataSource.items && Array.isArray(dataSource.items) ? dataSource.items.filter(x => x.name === "websdk_config") || [] : [];
	const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
	const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

	return (
		<antd.Button {...props} style={{ backgroundColor: websdk_config.business_color, border: `1px solid ${websdk_config.business_color}`, ...(props.style) }}>
			{props.children}
		</antd.Button>
	);
}

export default Button;