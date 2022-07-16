/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//from system
import React, { useState } from "react";

import * as antd from "antd";

import collection_helper from "../../../helper/collection_helper";
import constant_helper from "../../../helper/constant_helper";

import Button from "../../../component/nector/common/button";
import IconText from "../../../component/nector/common/icon_text";

// eslint-disable-next-line no-unused-vars
const MobileRenderDeadClickViewItem = (props) => {

	const dataSource = (props.websdkinfos && props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));
	const websdk_config_arr = dataSource.filter(x => x.name === "websdk_config") || [];
	const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
	const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

	return (
		<div style={{ width: "90%", margin: "0 auto" }}>
			<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
				<antd.Typography.Text className="nector-subtitle" style={{ textAlign: "center", marginBottom: 10, }}>{collection_helper.validate_not_null_or_undefined(websdk_config?.content?.main_cta_title) ? websdk_config?.content?.main_cta_title : constant_helper.get_app_constant().DEFAULT_WEBSDK_CONFIG.content.main_cta_title}</antd.Typography.Text>
				<antd.Typography.Text className="nector-subtext" style={{ display: "block", textAlign: "center" }}>{collection_helper.validate_not_null_or_undefined(websdk_config?.content?.main_cta_subtitle) ? websdk_config?.content?.main_cta_subtitle : constant_helper.get_app_constant().DEFAULT_WEBSDK_CONFIG.content.main_cta_subtitle}</antd.Typography.Text>
			</div>

			{(websdk_config_options.signup_link) && <div style={{ marginTop: 15, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
				<Button type="primary" style={{ width: "85%", paddingTop: 8, paddingBottom: 8, height: "auto", borderRadius: 6, }} onClick={() => this.on_signup(websdk_config_options.signup_link)}>Sign Up To Get Free Coins</Button>
				{(websdk_config_options.login_link) && <antd.Typography.Text className="nector-subtext" style={{ display: "block", marginTop: 10 }}>Already have an account? <a href="#" className="nector-text" style={{ textDecoration: "underline" }} onClick={(e) => this.on_signin(e, websdk_config_options.login_link)}>Login</a></antd.Typography.Text>}
			</div>}

			{(!websdk_config_options.signup_link && websdk_config_options.login_link) && <div style={{ marginTop: 15, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
				<Button type="primary" style={{ width: "85%", paddingTop: 8, paddingBottom: 8, height: "auto", borderRadius: 6, }} onClick={(e) => this.on_signin(e, websdk_config_options.login_link)}>Login To Redeem Offers</Button>
			</div>}
		</div>
	);
};


export {
	MobileRenderDeadClickViewItem
};