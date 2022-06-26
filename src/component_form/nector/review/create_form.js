/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import * as react_ai_icons from "react-icons/ai";

import collection_helper from "../../../helper/collection_helper";

import * as antd from "antd";

function ReviewCreateForm(props) {
	const [form] = antd.Form.useForm();

	useEffect(() => {
		if (props.lead) {
			form.setFieldsValue({ name: props.lead.name || undefined, email: props.lead.email || undefined });
		}
	}, [props.lead]);

	const [files, setFiles] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);
	const [loading, setLoading] = useState(false);

	const onFinish = (values) => {
		const finalvalues = {
			...values,
			files: files
		};

		setLoading(true);
		props.api_merchant_create_triggeractivities(finalvalues, form, (result) => {
			setLoading(false);
			if (collection_helper.validate_is_null_or_undefined(result)) return;

			if (result.data.success === true) {
				setErrorMessage(null);

			}

			else if (result.meta.status === "error" && result.data.message && result.data.message.includes("already exists")) setErrorMessage("You have already submitted review for this product. Multiple reviews on same product is not allowed");
		});
	};

	return (
		<antd.Form form={form} onFinish={onFinish} style={{ margin: "0 auto", maxWidth: 600 }}>
			<antd.Typography.Title level={5}>Write A Review</antd.Typography.Title>

			<antd.Form.Item name="name" label="Name" labelCol={{ span: 24 }} wrapperCol={{ xs: { span: 24 }, sm: { span: 24 }, md: { span: 16 } }} rules={[{ required: true, message: "Please enter your name" }]} hasFeedback>
				<antd.Input placeholder="Enter your name" />
			</antd.Form.Item>

			<antd.Form.Item name="email" label="Email" labelCol={{ span: 24 }} wrapperCol={{ xs: { span: 24 }, sm: { span: 24 }, md: { span: 16 } }} rules={[{ required: true, message: "Please enter your email" }, { type: "email", message: "Please enter a valid email address" }]} shouldUpdate hasFeedback>
				<antd.Input disabled={collection_helper.validate_not_null_or_undefined(props.lead?.email)} placeholder="Enter your email address" />
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
					maxCount={3}>
					{(files.length < 3) && <div>
						<react_ai_icons.AiOutlinePlus />
						<div style={{ marginTop: 8 }}>Upload</div>
					</div>}
				</antd.Upload>
			</div>

			{
				errorMessage && (<div style={{ marginBottom: 24 }}>
					<antd.Alert
						message="Review Request"
						description={errorMessage}
						type="error"
						closable
						onClose={() => {
							form.resetFields(["rating", "title", "description"]);
							setErrorMessage(null);
						}}
					/>
				</div>)
			}

			<antd.Button type="primary" htmlType="submit" disabled={collection_helper.validate_not_null_or_undefined(errorMessage)} loading={loading}> Submit </antd.Button>
		</antd.Form>
	);
}

export default ReviewCreateForm;