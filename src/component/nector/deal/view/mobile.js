/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//from system
import React from "react";
import * as framer_motion from "framer-motion";

import * as antd from "antd";
import * as antd_icons from "@ant-design/icons";

import collection_helper from "../../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props) => {
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
				<antd.Card style={{ height: 150, borderRadius: 5, width: "100%" }}>
					<antd.List.Item.Meta
						avatar={<antd.Avatar src={picked_upload.link} />}
						title={<div>
							<antd.Typography.Paragraph style={{ fontSize: "1.3em", marginBottom: 2, display: "block" }}>{collection_helper.get_limited_text(item.name, 30)}</antd.Typography.Paragraph>
							<antd.Typography.Text style={{ fontSize: "1.1em", color: "#00000070", marginBottom: 2, display: "block", whiteSpace: "pre-wrap" }}>{collection_helper.get_limited_text(item.description, 40)}</antd.Typography.Text>
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

const MobileBuyButton = (item) => {
	const x = framer_motion.useMotionValue(0);
	const xInput = [-100, 0, 100];
	const background = framer_motion.useTransform(
		x,
		xInput,
		["#ff008c", "#7700ff", "rgb(230, 255, 0)"]
	);

	const color = framer_motion.useTransform(x, xInput, [
		"rgb(211, 9, 225)",
		"rgb(68, 0, 255)",
		"rgb(3, 209, 0)"
	]);
	const tickPath = framer_motion.useTransform(x, [10, 100], [0, 1]);
	const crossPathA = framer_motion.useTransform(x, [-10, -55], [0, 1]);
	const crossPathB = framer_motion.useTransform(x, [-50, -100], [0, 1]);


	return (
		<framer_motion.motion.div style={{ background }}>
			<framer_motion.motion.div
				drag="x"
				dragConstraints={{ left: 0, right: 0 }}
				style={{ x }}
			>
				<svg className="progress-icon" viewBox="0 0 50 50">
					<framer_motion.motion.path
						fill="none"
						strokeWidth="2"
						stroke={color}
						d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
						style={{ translateX: 5, translateY: 5 }}
					/>
					<framer_motion.motion.path
						fill="none"
						strokeWidth="2"
						stroke={color}
						d="M14,26 L 22,33 L 35,16"
						strokeDasharray="0 1"
						style={{ pathLength: tickPath }}
					/>
					<framer_motion.motion.path
						fill="none"
						strokeWidth="2"
						stroke={color}
						d="M17,17 L33,33"
						strokeDasharray="0 1"
						style={{ pathLength: crossPathA }}
					/>
					<framer_motion.motion.path
						fill="none"
						strokeWidth="2"
						stroke={color}
						d="M33,17 L17,33"
						strokeDasharray="0 1"
						style={{ pathLength: crossPathB }}
					/>
				</svg>
			</framer_motion.motion.div>
		</framer_motion.motion.div>
	);
};

export {
	MobileRenderListItem,
	MobileBuyButton
};