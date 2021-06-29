/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//from system
import React from "react";
import * as framer_motion from "framer-motion";

import * as antd from "antd";
import * as antd_icons from "@ant-design/icons";

import collection_helper from "../../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const DesktopRenderListItem = (item, props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const uploads = item.uploads || [];
	const wallets = props.lead.wallets || props.lead.devwallets || [];

	const is_available = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	const ribbon_style = expires_in >= 0 ? (expires_in > 3 ? { color: "#008800" } : { color: "#ffa500" }) : { color: "#ff0000" };
	const expire_text = (is_available && item.expire) ? (Number(expires_in) > 0 ? `Expires in ${expires_in} days` : "Expires today") : ((is_available && !item.expire) ? "Available" : "Expired");

	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };
	const picked_wallet = wallets.length > 0 ? wallets[0] : {
		available: "0",
		reserve: "0",
		currency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") },
		devcurrency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") }
	};

	return (
		<framer_motion.motion.div
			key={item._id}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.9 }}
			transition={{ type: "spring", stiffness: 300 }}>
			<antd.Card key={item._id} style={{ borderRadius: 5, width: "100%" }} onClick={() => props.on_deal(item)}>
				<div className="nector-ant-image-img" style={{ textAlign: "center" }}>
					<antd.Image
						style={{ maxWidth: 150, height: 75 }}
						src={picked_upload.link}
					/>
				</div>
				<antd.Typography.Paragraph style={{ fontSize: "1.3em", marginBottom: 2, display: "block" }}>{collection_helper.get_limited_text(item.name, 40)}</antd.Typography.Paragraph>
				<antd.Typography.Text style={{ fontSize: "0.9em", color: "#00000070", marginBottom: 2, display: "block", whiteSpace: "pre-wrap" }}>{collection_helper.get_limited_text(item.description, 50)}</antd.Typography.Text>
				<antd.Typography.Text style={{ fontSize: "1.1em", fontWeight: 600, display: "block" }}>{(Number(item.sell_price) / (picked_wallet.currency || picked_wallet.devcurrency).conversion_factor).toFixed((picked_wallet.currency || picked_wallet.devcurrency).place)} {collection_helper.get_lodash().upperFirst((picked_wallet.currency || picked_wallet.devcurrency).currency_code)}</antd.Typography.Text>
			</antd.Card>
		</framer_motion.motion.div>
	);
};


export {
	DesktopRenderListItem
};