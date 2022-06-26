/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import * as react_ai_icons from "react-icons/ai";

import collection_helper from "../../../helper/collection_helper";

import * as antd from "antd";

import Button from "../../../component/nector/common/button";

function CollectReviewCreateForm(props) {
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
			reference_product_id: String(props.product.reference_product_id),
			reference_product_source: props.product.reference_product_source,
			files
		};

		setLoading(true);
		// eslint-disable-next-line no-unused-vars
		props.api_merchant_create_triggeractivities(finalvalues, form, (result) => {
			setLoading(false);
			if (collection_helper.validate_is_null_or_undefined(result)) return;

			if (result.data.success === true){
				setErrorMessage(null);
				props.api_merchant_get_orders();
			}
			else if (result.meta.status === "error" && result.data.message && result.data.message.includes("already exists")) setErrorMessage("You have already submitted review for this product. Multiple reviews on same product is not allowed");
		});
	};

	return (
		<antd.Form form={form} onFinish={onFinish}>
			<antd.Form.Item name="name" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} rules={[{ required: true, message: "Please enter your name" }]} hasFeedback style={{ marginBottom: 16 }}>
				<antd.Input prefix={<antd.Typography.Text className="nector-text" style={{ color: "#888", paddingRight: 8, marginRight: 6, fontSize: "0.85em", borderRight: "1px solid #ddd" }}>Name </antd.Typography.Text>} style={{ padding: "8px 12px", borderRadius: 4 }} />
			</antd.Form.Item>

			<antd.Form.Item name="email" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} rules={[{ required: true, message: "Please enter your email" }, { type: "email", message: "Please enter a valid email address" }]} style={{ marginBottom: 16 }}>
				<antd.Input disabled={collection_helper.validate_not_null_or_undefined(props.lead?.email)} prefix={<antd.Typography.Text style={{ color: "#888", fontSize: "0.85em", paddingRight: 8, marginRight: 6, borderRight: "1px solid #ddd" }}>Email </antd.Typography.Text>} style={{ padding: "8px 12px", borderRadius: 4 }} />
			</antd.Form.Item>

			<antd.Form.Item name="rating" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} rules={[{ required: true, message: "Please select a rating" }, { type: "number", min: 0.3, message: "Please give a rating greater than 0" }]} shouldUpdate hasFeedback style={{ marginBottom: 16 }}>
				<antd.Rate style={{ padding: "8px 12px", borderRadius: 4 }} />
			</antd.Form.Item>

			<antd.Form.Item name="title" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} rules={[{ required: true, message: "Please enter the review title" }]} hasFeedback style={{ marginBottom: 16 }}>
				<antd.Input prefix={<antd.Typography.Text style={{ color: "#888", fontSize: "0.85em", paddingRight: 8, marginRight: 6, borderRight: "1px solid #ddd" }}>Review Title </antd.Typography.Text>} style={{ padding: "8px 12px", borderRadius: 4 }} />
			</antd.Form.Item>

			<antd.Form.Item name="description" label="Review Body" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} rules={[{ required: true, message: "Please enter the review description" }]} hasFeedback style={{ marginBottom: 16 }}>
				<antd.Input.TextArea rows={4} placeholder="Enter the review body" style={{ padding: "8px 12px", borderRadius: 4 }} />
			</antd.Form.Item>

			<div style={{ marginBottom: 24 }}>
				<antd.Upload
					name="image"
					fileList={files}
					listType="picture-card"
					beforeUpload={() => false}
					onChange={({ fileList }) => {
						setFiles(fileList);
					}}
					showUploadList={{
						showPreviewIcon: false
					}}
					maxCount={3}>
					{(files.length < 3) && <div>
						<react_ai_icons.AiOutlineCamera className="nector-subtitle" />
						<div className="nector-subtext" style={{ marginTop: 8 }}>Add Images</div>
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

			<Button type="primary" style={{ width: "100%", height: 38, borderRadius: 4 }} htmlType="submit" disabled={collection_helper.validate_not_null_or_undefined(errorMessage)} loading={loading}>
				Submit
			</Button>
		</antd.Form>
	);
}

export default CollectReviewCreateForm;