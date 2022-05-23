/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";

import * as antd from "antd";
import * as antd_icons from "@ant-design/icons";

function ReviewCreateForm(props) {
	const [form] = antd.Form.useForm();

	const [files, setFiles] = useState([]);

	const onFinish = (values) => {
		props.api_merchant_create_triggeractivities({ ...values, files }, form);
	};

	return (
		<antd.Form form={form} onFinish={onFinish}>
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

			<div style={{ marginBottom: 24 }}>
				<antd.Typography.Text style={{ display: "block", marginBottom: 10 }}>Images</antd.Typography.Text>

				<antd.Upload
					name="image"
					fileList={files}
					listType="picture-card"
					beforeUpload={() => false}
					onChange={({ file, fileList, event }) => {
						setFiles(fileList);
					}}
					showUploadList={{
						showPreviewIcon: false
					}}
					maxCount={3}
				>
					{(files.length < 3) && <div>
						<antd_icons.PlusOutlined />
						<div style={{ marginTop: 8 }}>Upload</div>
					</div>}
				</antd.Upload>
			</div>

			<antd.Button type="default" htmlType="submit" loading={props.submitting || false}>
				Submit
			</antd.Button>
		</antd.Form>
	);
}

export default ReviewCreateForm;