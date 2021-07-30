/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import Modal from "react-modal";
import * as antd from "antd";
import ScratchCard from "react-scratchcard";
import cardImage from "./card.jpg";
import collection_helper from "../../../../helper/collection_helper";
import * as react_material_icons from "react-icons/md";
import ReactRipples from "react-ripples";

Modal.setAppElement("#root");

const ScratchCardModal = (props) => {
	// eslint-disable-next-line react/prop-types
	const {visible, couponItemObj, onProps, onScratched, modalClose, on_coupon} = props;

	const default_search_params = collection_helper.get_default_params(onProps.location.search);
	const deal = couponItemObj.deal || couponItemObj.devdeal || {};

	const is_available = collection_helper.convert_to_moment_utc_from_datetime(deal.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(deal.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	const ribbon_style = expires_in >= 0 ? (expires_in > 3 ? { color: "#008800" } : { color: "#ffa500" }) : { color: "#ff0000" };
	const expire_text = (is_available && deal.expire) ? (Number(expires_in) > 0 ? `Expires in ${expires_in} days` : "Expires today") : ((is_available && !deal.expire) ? "Available" : "Expired");

	const uploads = deal.uploads || [];
	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };

	const settings = {
		image: cardImage,
		finishPercent: 50,
		onComplete: () => {onScratched();}
	};

	return (
		<antd.Modal footer={null} maskClosable mask closable={false} visible={visible} centered>
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
					<div style={{position: "absolute", bottom: 10, right: 10, marginBottom: "1%"}}>
						<antd.Button style={{ color: "black", borderRadius: "5px"}} onClick={() => on_coupon(couponItemObj)}>Know More</antd.Button>
					</div>
				</ScratchCard>
			</antd.Card>
		</antd.Modal>
	);
};

export default ScratchCardModal;