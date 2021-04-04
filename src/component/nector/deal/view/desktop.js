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
	const uploads = item.uploads || [];
	const wallets = props.lead.wallets || props.lead.devwallets || [];

	const picked_upload = uploads.length > 0 ? uploads[0] : { link: "https://res.cloudinary.com/esternetwork/image/upload/v1617280550/nector/images/logowhite.svg" };
	const picked_wallet = wallets.length > 0 ? wallets[0] : {
		available: "0",
		reserve: "0",
		currency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") },
		devcurrency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") }
	};

	return (
		<framer_motion.motion.div
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.9 }}
			transition={{ type: "spring", stiffness: 300 }}>
			<antd.List.Item onClick={() => props.on_deal(item)}>
				<antd.Card style={{ height: 180, borderRadius: 5, width: "100%" }}>
					<antd.List.Item.Meta
						avatar={<antd.Avatar src={picked_upload.link} />}
						title={<div>
							<antd.Typography.Paragraph style={{ fontSize: "1.3em", marginBottom: 2, display: "block" }}>{collection_helper.get_limited_text(item.name, 40)}</antd.Typography.Paragraph>
							<antd.Typography.Text style={{ fontSize: "1.1em", color: "#00000070", marginBottom: 2, display: "block", whiteSpace: "pre-wrap" }}>{collection_helper.get_limited_text(item.description, 50)}</antd.Typography.Text>
						</div>}
						description={<div>
							<antd.Typography.Text style={{ fontSize: "0.9em", fontWeight: 600, display: "block" }}>{(Number(item.sell_price) / (picked_wallet.currency || picked_wallet.devcurrency).conversion_factor).toFixed((picked_wallet.currency || picked_wallet.devcurrency).place)} {collection_helper.get_lodash().upperFirst((picked_wallet.currency || picked_wallet.devcurrency).currency_code)}</antd.Typography.Text>
						</div>}
					/>
				</antd.Card>
			</antd.List.Item>
		</framer_motion.motion.div>
	);
};


export {
	DesktopRenderListItem
};