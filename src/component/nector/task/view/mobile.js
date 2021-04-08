/* eslint-disable react/prop-types */
//from system
import React from "react";
import random_color from "randomcolor";
import * as framer_motion from "framer-motion";

import * as antd from "antd";

import collection_helper from "../../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	// const formated_date = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment()).format("MMMM Do, YYYY");
	// const is_available = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	// const expires_in = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	// const text_style = expires_in > 0 ? (expires_in > 3 ? { color: "green" } : { color: "orange" }) : { color: "red" };
	// const expire_text = (is_available && item.expire) ? `Ends ${formated_date}` : ((is_available && !item.expire) ? "Campaign running" : "Campaign expired");

	const uploads = item.uploads || [];

	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };

	const hexcolor = random_color({ luminosity: "dark" });

	return (
		<framer_motion.motion.div
			key={item._id}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.9 }}
			transition={{ type: "spring", stiffness: 300 }}>
			<antd.List.Item style={{ marginRight: 10 }} onClick={() => props.on_task(item)}>
				<antd.Card style={{ height: 75, width: 200, borderRadius: 5, background: `linear-gradient(90deg,rgba(0,0,0,.9) 0,${hexcolor})` }} bordered={false}>
					<div style={{ display: "flex", flex: 1 }}>
						<div style={{ flex: 1, cursor: "pointer" }}>
							<antd.Typography.Paragraph style={{ fontSize: "1em", marginBottom: 2, fontWeight: 600, display: "block", color: "#ffffff" }}>{collection_helper.get_limited_text(item.name, 20)}</antd.Typography.Paragraph>
							{/* <antd.Typography.Text style={{ fontSize: "0.8em", display: "block", color: "#f2f2f2" }}>{expire_text}</antd.Typography.Text> */}
						</div>
						<antd.Avatar size={40} style={{ marginRight: -20, marginTop: -15 }} src={picked_upload.link} />
					</div>
				</antd.Card>
			</antd.List.Item>
		</framer_motion.motion.div>
	);
};

export {
	MobileRenderListItem
};