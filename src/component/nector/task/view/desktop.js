/* eslint-disable react/prop-types */
//from system
import React from "react";
// import random_gradient from "random-gradient";
// import random_color from "randomcolor";
import * as framer_motion from "framer-motion";

import * as antd from "antd";

import collection_helper from "../../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const DesktopRenderListItem = (item, props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	// const formated_date = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment()).format("MMMM Do, YYYY");
	// const is_available = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	// const expires_in = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	// const text_style = expires_in > 0 ? (expires_in > 3 ? { color: "green" } : { color: "orange" }) : { color: "red" };
	// const expire_text = (is_available && item.expire) ? `Ends ${formated_date}` : ((is_available && !item.expire) ? "Campaign running" : "Campaign expired");

	const uploads = item.uploads || [];

	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };

	// const hexcolor = random_color({ luminosity: "dark", seed: (item.name || "nector") });

	return (
		<framer_motion.motion.div
			key={item._id}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.9 }}
			transition={{ type: "spring", stiffness: 300 }}>
			<antd.List.Item style={{ marginRight: 10 }} onClick={() => props.on_task(item)}>
				<div style={{ display: "flex", flex: 1, flexDirection: "column", textAlign: "center" }}>
					<antd.Tooltip title={item.name}>
						<antd.Avatar size={70} src={picked_upload.link} />
					</antd.Tooltip>
				</div>
			</antd.List.Item>
		</framer_motion.motion.div>
	);
};

export {
	DesktopRenderListItem
};