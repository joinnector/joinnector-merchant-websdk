/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//from system
import React from "react";
import ReactLinkify from "react-linkify";
import ReactSwipeButton from "react-swipe-button";
import * as react_material_icons from "react-icons/md";
import * as framer_motion from "framer-motion";

import * as antd from "antd";

import collection_helper from "../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderEditProfileItem = (props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);

	const action_item = props.lead.metadetail || {};

	const [form] = antd.Form.useForm();

	React.useEffect(() => {
		form.setFieldsValue({
			...action_item,
			dob: action_item.dob ? collection_helper.get_moment()(action_item.dob) : "",
		});
	}, [form, {
		...action_item,
		dob: action_item.dob ? collection_helper.get_moment()(action_item.dob) : "",
	}]);

	const on_finish = (values) => {
		props.toggle_drawer();
		props.api_merchant_update_leads({ ...values, _id: props.lead._id });
	};

	return (
		<div>
			<div style={{ textAlign: "center" }}>
				<antd.Alert message="Double check before clicking on the save button. Only name, address and zipcode can be changed once details are saved." type="warning"></antd.Alert>
			</div>

			<div style={{ borderBottom: "1px solid #eeeeee", margin: "20px 0px" }} />

			<antd.Form form={form} onFinish={on_finish}>
				<antd.Form.Item label="Name" initialValue={props.lead.name} name="name" rules={[{ required: false, message: "Please enter a value" }]} hasFeedback labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
					<antd.Input />
				</antd.Form.Item>

				<antd.Form.Item label="Email" initialValue={action_item.email} name="email" rules={[{ type: "email", message: "Please enter valid email" }, { required: false, message: "Please enter a value" }]} hasFeedback labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
					<antd.Input disabled={action_item.email !== null} />
				</antd.Form.Item>

				<antd.Form.Item label="Mobile" initialValue={action_item.mobile} name="mobile" rules={[{ required: false, message: "Please enter a value" }]} hasFeedback labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
					<antd.Input disabled={action_item.mobile !== null} />
				</antd.Form.Item>

				<antd.Form.Item label="Date of birth" initialValue={action_item.dob ? collection_helper.get_moment()(action_item.dob) : ""} name="dob" rules={[{ required: false, message: "Please enter a value" }]} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
					<antd.DatePicker disabled={action_item.dob !== null} />
				</antd.Form.Item>

				<antd.Form.Item label="Country" name="country" initialValue={action_item.country} rules={[{ required: false, message: "Please enter a value" }]} hasFeedback labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
					<antd.Select disabled={action_item.country !== null}>
						{(props.systeminfos && props.systeminfos.country_code || []).map(code => <antd.Select.Option key={code} value={code}>{code}</antd.Select.Option>)}
					</antd.Select>
				</antd.Form.Item>

				<antd.Form.Item label="Gender" name="gender" initialValue={action_item.gender} rules={[{ required: false, message: "Please enter a value" }]} hasFeedback labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
					<antd.Select disabled={action_item.gender !== null}>
						{(props.systeminfos && props.systeminfos.gender_type || []).map(code => <antd.Select.Option key={code} value={code}>{code}</antd.Select.Option>)}
					</antd.Select>
				</antd.Form.Item>

				<antd.Form.Item>
					<antd.Button type="primary" htmlType="submit" size="middle" style={{ width: "100%" }}> Save </antd.Button>
				</antd.Form.Item>

			</antd.Form>

		</div>
	);
};


export {
	MobileRenderEditProfileItem
};