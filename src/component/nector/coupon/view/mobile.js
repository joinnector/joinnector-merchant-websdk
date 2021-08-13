/* eslint-disable react/prop-types */
//from system
import React from "react";
import * as framer_motion from "framer-motion";
import ScratchCard from "react-scratchcard";
// import ReactRipples from "react-ripples";

import card_image from "../resource/scratchcardone.png";

import * as antd from "antd";
import collection_helper from "../../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const deal = item.deal || item.devdeal || {};

	const is_available = collection_helper.convert_to_moment_utc_from_datetime(deal.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(deal.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	const ribbon_style = expires_in >= 0 ? (expires_in > 3 ? { color: "#008800" } : { color: "#ffa500" }) : { color: "#ff0000" };
	// const backgroundRibbon_style = expires_in >= 0 ? (expires_in > 3 ? { backgroundColor: "#008800" } : { backgroundColor: "#ffa500" }) : { backgroundColor: "#ff0000" };
	const expire_text = (is_available && deal.expire) ? (Number(expires_in) > 0 ? `Expires in ${expires_in} days` : "Expires today") : ((is_available && !deal.expire) ? "Available" : "Expired");

	const uploads = deal.uploads || [];
	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };

	const settings = {
		image: card_image,
		finishPercent: 50,
	};

	return (
		<antd.List.Item onClick={() => props.on_coupon(item)}>
			<framer_motion.motion.div
				className="scratch_card_container"
				key={item._id}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.9 }}
				transition={{ type: "spring", stiffness: 300 }}>
				<antd.Card style={{ height: 220, borderRadius: 5, width: "100%" }}>
					{
						item.status == "pending" ? (<ScratchCard {...settings}>
							<div className="nector-ant-image-img" style={{ textAlign: "center" }}>
								<antd.Image
									style={{ maxWidth: 150, height: 75 }}
									src={picked_upload.link}
								/>
								<antd.Typography.Text style={{ fontSize: "0.8em", fontWeight: 600, display: "block", ...ribbon_style }}>{expire_text}</antd.Typography.Text>
							</div>
							<div style={{ position: "absolute", bottom: 0, left: 10, right: 10, marginBottom: "5%" }}>
								<antd.Typography.Text style={{ fontSize: "1.3em", marginBottom: 2, display: "block" }}>{collection_helper.get_limited_text(deal.name, 30)}</antd.Typography.Text>
							</div>
						</ScratchCard>) : (<div>
							<div className="nector-ant-image-img" style={{ textAlign: "center" }}>
								<antd.Image
									style={{ maxWidth: 150, height: 75 }}
									src={picked_upload.link}
								/>
								<antd.Typography.Text style={{ fontSize: "0.8em", fontWeight: 600, display: "block", ...ribbon_style }}>{expire_text}</antd.Typography.Text>
							</div>
							<div style={{ position: "absolute", bottom: 0, left: 10, right: 10, marginBottom: "5%" }}>
								<antd.Typography.Text style={{ fontSize: "1.3em", marginBottom: 2, display: "block" }}>{collection_helper.get_limited_text(deal.name, 30)}</antd.Typography.Text>
							</div>
						</div>)
					}
				</antd.Card>
			</framer_motion.motion.div>
		</antd.List.Item>
	);
};

const MobileRenderDailog = (props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const deal = props.record.deal || props.record.devdeal || {};

	const is_available = collection_helper.convert_to_moment_utc_from_datetime(deal.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(deal.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	const ribbon_style = expires_in >= 0 ? (expires_in > 3 ? { color: "#008800" } : { color: "#ffa500" }) : { color: "#ff0000" };
	// const backgroundRibbon_style = expires_in >= 0 ? (expires_in > 3 ? { backgroundColor: "#008800" } : { backgroundColor: "#ffa500" }) : { backgroundColor: "#ff0000" };
	const expire_text = (is_available && deal.expire) ? (Number(expires_in) > 0 ? `Expires in ${expires_in} days` : "Expires today") : ((is_available && !deal.expire) ? "Available" : "Expired");

	const uploads = deal.uploads || [];
	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };

	const settings = {
		image: card_image,
		finishPercent: 50,
		onComplete: () => props.api_merchant_update_coupons(props.record)
	};

	return (
		<antd.Modal footer={null} visible={props.visible} closable={false} centered>
			<antd.Card style={{ height: 220, borderRadius: 5, width: "100%" }} >
				<ScratchCard {...settings}>
					<div className="nector-ant-image-img" style={{ textAlign: "center" }}>
						<antd.Image
							style={{ maxWidth: 150, height: 75 }}
							src={picked_upload.link}
						/>
						<antd.Typography.Text style={{ fontSize: "0.8em", fontWeight: 600, display: "block", ...ribbon_style }}>{expire_text}</antd.Typography.Text>
					</div>
					<div style={{ position: "absolute", bottom: 0, left: 10, right: 10, marginBottom: "5%" }}>
						<antd.Typography.Text style={{ fontSize: "1.5em", marginBottom: 2, display: "block" }}>{collection_helper.get_limited_text(deal.name, 22)}</antd.Typography.Text>
						<antd.Typography.Text style={{ fontSize: "1.1em", marginBottom: 2, display: "block" }} className="text_yellow">
							{collection_helper.get_limited_text(deal.description, 31)}
						</antd.Typography.Text>
					</div>
				</ScratchCard>
			</antd.Card>
		</antd.Modal>
	);
};

export {
	MobileRenderListItem, MobileRenderDailog
};