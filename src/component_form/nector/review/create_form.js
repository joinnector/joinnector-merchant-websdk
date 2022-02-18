/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import * as antd from "antd";

function ReviewCreateForm(props) {
	const [form] = antd.Form.useForm();

	return (
		<antd.Form form={form} onFinish={(values) => {
			props.api_merchant_create_reviews(values);
			form.resetFields();
		}}>
			{/* Name and email only for guest users maybe */}
			<antd.Form.Item name="name" label="Name" labelCol={{ span: 24 }} wrapperCol={{ xs: { span: 24 }, sm: { span: 24 }, md: { span: 16 } }} rules={[{ required: true, message: "Please enter your name" }]} hasFeedback>
				<antd.Input placeholder="Enter your name" />
			</antd.Form.Item>

			<antd.Form.Item name="email" label="Email" labelCol={{ span: 24 }} wrapperCol={{ xs: { span: 24 }, sm: { span: 24 }, md: { span: 16 } }} rules={[{ required: true, message: "Please enter your email" }, { type: "email", message: "Please enter a valid email address" }]} shouldUpdate hasFeedback>
				<antd.Input placeholder="Enter your email address" />
			</antd.Form.Item>

			<antd.Form.Item name="rating" label="Your Rating" labelCol={{ span: 24 }} wrapperCol={{ xs: { span: 24 }, sm: { span: 24 }, md: { span: 16 } }} rules={[{ required: true, message: "Please select a rating" }, { type: "number", min: 0.3, message: "Please give a rating greater than 0" }]} shouldUpdate hasFeedback>
				<antd.Rate />
			</antd.Form.Item>

			<antd.Form.Item name="title" label="Review Title" labelCol={{ span: 24 }} wrapperCol={{ xs: { span: 24 }, sm: { span: 24 }, md: { span: 16 } }} rules={[{ required: true, message: "Please enter the review title" }]} hasFeedback>
				<antd.Input placeholder="Enter the review title" />
			</antd.Form.Item>

			<antd.Form.Item name="description" label="Review Body" labelCol={{ span: 24 }} wrapperCol={{ xs: { span: 24 }, sm: { span: 24 }, md: { span: 16 } }} rules={[{ required: true, message: "Please enter the review body" }]} hasFeedback>
				<antd.Input.TextArea placeholder="Enter the review body" />
			</antd.Form.Item>

			<antd.Button type="default" htmlType="submit">
				Submit
			</antd.Button>
		</antd.Form>
	);
}

export default ReviewCreateForm;