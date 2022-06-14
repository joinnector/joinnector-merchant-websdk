/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//from system
import React from "react";

import * as antd from "antd";
import Button from "../../../component/nector/common/button";

// eslint-disable-next-line no-unused-vars
const MobileRenderApplyReferralCodeItem = (props) => {
	const [form] = antd.Form.useForm();

	const on_finish = (values) => {
		props.toggle_drawer();
		props.api_merchant_update_leadsreferredbyreferralcode({ ...values, _id: props.lead._id });
	};

	return (
		<div>
			<antd.Form form={form} onFinish={on_finish} style={{ width: "95%", margin: "0 auto" }}>
				<antd.Typography.Text style={{ display: "block", color: "#888", margin: "1em 0", fontSize: "0.85em" }}>Enter the referral code of your friend who referred you and get your reward!</antd.Typography.Text>

				<antd.Form.Item label="Referral Code" name="referred_by_referral_code" rules={[{ required: true, message: "Please enter the referral code" }]} hasFeedback labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
					<antd.Input />
				</antd.Form.Item>

				<antd.Form.Item>
					<Button type="primary" htmlType="submit" size="middle" style={{ width: "100%", height: "40px", borderRadius: 6 }}> Submit </Button>
				</antd.Form.Item>
			</antd.Form>
		</div>
	);
};


export {
	MobileRenderApplyReferralCodeItem as MobileRenderEditProfileItem
};