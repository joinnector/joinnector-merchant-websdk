/* eslint-disable react/prop-types */
//from system
import React from "react";

import * as antd from "antd";

import collection_helper from "../../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const DesktopRenderListItem = (item, props) => {
	const is_available = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	const text_style = expires_in > 0 ? (expires_in > 3 ? { color: "green" } : { color: "orange" }) : { color: "red" };
	const expire_text = (is_available && item.expire) ? `Campaign ends in ${expires_in} days` : ((is_available && !item.expire) ? "Campaign running" : "Campaign expired");

	const uploads = item.uploads || [];

	const picked_upload = uploads.length > 0 ? uploads[0] : { link: "https://res.cloudinary.com/esternetwork/image/upload/v1617280550/nector/images/logowhite.svg" };

	return (
		<antd.List.Item onClick={() => props.on_taskactivity(item)}>
			<div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
				<antd.List.Item.Meta
					avatar={<antd.Avatar src={picked_upload.link} />}
					title={<div>
						<antd.Typography.Paragraph style={{ fontSize: "1em", fontWeight: 600, marginBottom: 2, display: "block" }}>{collection_helper.get_limited_text(item.name, 40)}</antd.Typography.Paragraph>
						<antd.Typography.Text style={{ fontSize: "0.8em", display: "block", ...text_style }}>{expire_text}</antd.Typography.Text>
					</div>}
					description={<div>
						<antd.Typography.Text style={{ fontSize: "0.8em", color: "#00000070", marginBottom: 2, display: "block" }}>Complete {item.count} activities to get rewarded</antd.Typography.Text>
					</div>}
				/>
			</div>
		</antd.List.Item>
	);
};

export {
	DesktopRenderListItem
};