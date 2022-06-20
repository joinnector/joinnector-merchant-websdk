/* eslint-disable react/prop-types */
import React, { useState } from "react";
import * as react_ai_icons from "react-icons/ai";

import * as antd from "antd";

import Button from "../../../component/nector/common/button";

function CollectReviewCreateForm(props) {
	const [form] = antd.Form.useForm();

	const [files, setFiles] = useState([]);

	const onFinish = (values) => {
		const finalvalues = {
			...values,
			name: "user",
			reference_product_id: String(props.product.reference_product_id),
			reference_product_source: props.product.reference_product_source,
			files
		};

		props.api_merchant_create_triggeractivities(finalvalues, form);
	};

	return (
		<antd.Form form={form} onFinish={onFinish}>
			<antd.Form.Item name="rating" label="Your Rating" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} rules={[{ required: true, message: "Please select a rating" }, { type: "number", min: 0.3, message: "Please give a rating greater than 0" }]} shouldUpdate hasFeedback>
				<antd.Rate />
			</antd.Form.Item>

			<antd.Form.Item name="title" label="Review Title" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} rules={[{ required: true, message: "Please enter the review title" }]} hasFeedback>
				<antd.Input placeholder="Enter the review title" style={{ padding: "8px 12px", borderRadius: 4 }} />
			</antd.Form.Item>

			<antd.Form.Item name="description" label="Review Body" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} rules={[{ required: true, message: "Please enter the review body" }]} hasFeedback>
				<antd.Input.TextArea placeholder="Enter the review body" style={{ padding: "8px 12px", borderRadius: 4 }} />
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
					maxCount={3}
				>
					{(files.length < 3) && <div>
						<react_ai_icons.AiOutlineCamera className="nector-subtitle" />
						<div className="nector-subtext" style={{ marginTop: 8 }}>Add Images</div>
					</div>}
				</antd.Upload>
			</div>

			<Button type="primary" style={{ width: "100%", height: 38, borderRadius: 4 }} htmlType="submit" loading={props.submitting || false}>
				Submit
			</Button>
		</antd.Form>
	);
}

export default CollectReviewCreateForm;