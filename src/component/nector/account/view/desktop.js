/* eslint-disable react/prop-types */
//from system
import React from "react";
import * as framer_motion from "framer-motion";
// import ReactRipples from "react-ripples";

import * as antd from "antd";

import collection_helper from "../../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const DesktopRenderListItem = (item, props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const deal = item.deal || item.devdeal || {};

	const is_available = collection_helper.convert_to_moment_utc_from_datetime(deal.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(deal.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	const ribbon_style = expires_in >= 0 ? (expires_in > 3 ? { color: "#008800" } : { color: "#ffa500" }) : { color: "#ff0000" };
	const expire_text = (is_available && deal.expire) ? (Number(expires_in) > 0 ? `Expires in ${expires_in} days` : "Expires today") : ((is_available && !deal.expire) ? "Available" : "Expired");

	const uploads = deal.uploads || [];
	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };

	return (
		<antd.List.Item onClick={() => props.on_coupon(item)}>
			<framer_motion.motion.div
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.9 }}
				transition={{ type: "spring", stiffness: 300 }}>
				<antd.Card style={{ height: 220, borderRadius: 5, width: "100%" }}>
					<div style={{ textAlign: "center" }}>
						<antd.Image
							width={150}
							height={75}
							src={picked_upload.link}
						/>
						<antd.Typography.Text style={{ fontSize: "0.8em", fontWeight: 600, display: "block", ...ribbon_style }}>{expire_text}</antd.Typography.Text>
					</div>
					<div style={{ position: "absolute", bottom: 0, left: 10, right: 10, marginBottom: "5%" }}>
						<antd.Typography.Text style={{ fontSize: "1.3em", marginBottom: 2, display: "block" }}>{collection_helper.get_limited_text(deal.name, 30)}</antd.Typography.Text>
					</div>
				</antd.Card>
			</framer_motion.motion.div>
		</antd.List.Item>
	);
};


// eslint-disable-next-line no-unused-vars
const DesktopRenderOptionListItem = (item, props) => {
	return (
		<antd.List.Item onClick={() => props.on_click(item)}>
			<framer_motion.motion.div
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.9 }}
				transition={{ type: "spring", stiffness: 300 }}>
				<antd.Card style={{ height: 50, borderRadius: 5, width: "100%" }}>
					<antd.Typography.Text style={{ fontSize: "1em", marginBottom: 2, display: "block" }}>{item.title}</antd.Typography.Text>
				</antd.Card>
			</framer_motion.motion.div>
		</antd.List.Item>
	);
};

export {
	DesktopRenderListItem, DesktopRenderOptionListItem
};