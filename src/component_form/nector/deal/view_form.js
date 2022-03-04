/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//from system
import React from "react";
import ReactLinkify from "react-linkify";
import ReactSwipeButton from "react-swipe-button";

import * as antd from "antd";

// Core modules imports are same as usual
import { Navigation, Pagination } from "swiper";
// Direct React component imports
import { Swiper, SwiperSlide } from "swiper/react/swiper-react.js";

// Styles must use direct files imports
import "swiper/swiper.scss"; // core Swiper
import "swiper/modules/navigation/navigation.scss"; // Navigation module
import "swiper/modules/pagination/pagination.scss"; // Pagination module

import collection_helper from "../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const wallets = props.lead.wallets || props.lead.devwallets || [];

	const is_available = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	const expire_text = (is_available && item.expire) ? (Number(expires_in) > 0 ? `Expires in ${expires_in} days` : "Expires today") : ((is_available && !item.expire) ? "Available" : "Expired");

	const uploads = item.uploads || [];
	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };
	const picked_wallet = wallets.length > 0 ? wallets[0] : {
		available: "0",
		reserve: "0",
	};

	const redeem_price = Number(item.coin_amount || 0).toFixed(0);

	return (
		<antd.List.Item onClick={() => props.on_deal(item)}>
			<antd.List.Item.Meta
				avatar={<antd.Avatar className="nector-brand-icon" style={{ background: "#eeeeee", borderRadius: 10, height: 40, width: 70, border: "3px solid #eeeeee" }} src={picked_upload.link} />}
				title={<div>
					<antd.Typography.Paragraph style={{ fontSize: "1em", fontWeight: 600, marginBottom: 2, display: "block" }}>{collection_helper.get_lodash().capitalize(item.name)}</antd.Typography.Paragraph>
					<antd.Tag color="orange">{redeem_price} Coins</antd.Tag>
					<antd.Typography.Text style={{ fontSize: "0.7em", display: "block" }}>{expire_text}</antd.Typography.Text>
				</div>}
				description={<div>
					<antd.Typography.Text style={{ fontSize: "0.6em", color: "#00000080", marginBottom: 2, display: "block" }}> {collection_helper.get_limited_text(item.description, 50)}</antd.Typography.Text>
				</div>}
			/>
		</antd.List.Item>
	);
};

// eslint-disable-next-line no-unused-vars
const MobileRenderViewItem = (props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const item = props.action_item;
	const wallets = props.lead.wallets || props.lead.devwallets || [];

	const websdkinfos = (props.websdkinfos && props.websdkinfos.items) || [];
	const is_wallet_disabled = websdkinfos.filter(x => x.name === "websdk_disable_wallet" && x.value === true).length > 0 || false;

	const is_available = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	const expire_text = (is_available && item.expire) ? (Number(expires_in) > 0 ? `Expires in ${expires_in} days` : "Expires today") : ((is_available && !item.expire) ? "Available" : "Expired");

	const uploads = item.uploads || [];
	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };
	const picked_wallet = wallets.length > 0 ? wallets[0] : {
		available: "0",
		reserve: "0",
	};

	const redeem_price = Number(item.coin_amount || 0).toFixed(0);

	const redeem_deal = () => {
		if (Number(redeem_price) > Number(picked_wallet.available)) {
			collection_helper.show_message("Insufficient coins", "info");
			return props.toggle_drawer();
		}

		return props.api_merchant_create_dealredeems({ deal_id: item._id, wallet_id: picked_wallet._id });
	};

	return (
		<div>
			<div style={{ textAlign: "center", }}>
				<img src={picked_upload.link} style={{ background: "#eeeeee", borderRadius: 10, height: 75, width: 150, border: "3px solid #eeeeee" }} />
			</div>

			<div style={{ borderBottom: "1px solid #eeeeee", margin: "10px 0px" }} />

			<antd.Typography.Paragraph style={{ fontSize: "0.8em" }}>{expire_text}</antd.Typography.Paragraph>

			{/* <antd.Space direction="vertical"> */}
			<h3><b>{collection_helper.get_lodash().capitalize(item.name)}</b></h3>
			{
				(wallets.length > 0 && is_wallet_disabled === false) && props.drawer_visible && (<div style={{ margin: "20px 0px" }}>
					<ReactSwipeButton text={`Redeem for ${redeem_price}`} text_unlocked={"Processing your reward"} color={"#000"} onSuccess={redeem_deal} />
				</div>)
			}
			<div>
				{
					item.description && (
						<div style={(wallets.length > 0 && is_wallet_disabled === false) ? { paddingTop: 70 } : { padding: 0 }}>
							<b style={{ borderBottom: "1px solid #eeeeee" }}>Description </b>
							<div style={{ margin: 5 }} />
							<ReactLinkify componentDecorator={(decoratedHref, decoratedText, key) => (
								<a target="_blank" rel="noopener noreferrer" href={decoratedHref} key={key}>
									{decoratedText}
								</a>
							)}>
								<p style={{ fontSize: "0.8em", cursor: "pointer", whiteSpace: "pre-wrap" }}>{item.description}</p>
							</ReactLinkify>

							<div style={{ margin: 5 }} />
							{
								item.hits && (<div>
									<b style={{ borderBottom: "1px solid #eeeeee" }}>Redeemed </b>
									<div style={{ margin: 5 }} />
									<a target="_blank" rel="noopener noreferrer">
										<span style={{ fontSize: "0.8em" }}>{Number(item.hits)} Time(s) on this app </span>
									</a>
								</div>)
							}

						</div>
					)
				}
			</div>
		</div>
	);
};

function DealSwiperListItem(props) {
	const item = props.deal;

	const default_search_params = collection_helper.get_default_params(props.location.search);
	const wallets = props.lead.wallets || props.lead.devwallets || [];

	const is_available = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	const expire_text = (is_available && item.expire) ? (Number(expires_in) > 0 ? `Expires in ${expires_in} days` : "Expires today") : ((is_available && !item.expire) ? "Available" : "Expired");

	const uploads = item.uploads || [];
	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };
	const picked_wallet = wallets.length > 0 ? wallets[0] : {
		available: "0",
		reserve: "0",
	};

	const redeem_price = Number(item.coin_amount || 0).toFixed(0);

	return (
		<div style={{ borderRadius: 10, border: "1px solid #ddd", padding: 10, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }} onClick={() => props.on_deal(item)}>
			<div>
				<antd.Typography.Text style={{ fontSize: "12px", color: "#000aa" }} className="wrap-text">{item.brand}</antd.Typography.Text>
				<antd.Typography.Title style={{ fontSize: "14px", marginTop: 0 }} className="wrap-text">{item.name}</antd.Typography.Title>
			</div>

			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<div style={{ flex: "1 0" }}>
					<antd.Tag color="orange">{redeem_price} Coins</antd.Tag>
					<antd.Typography.Text style={{ fontSize: "0.7em", display: "block", marginTop: 5 }}>{expire_text}</antd.Typography.Text>
				</div>

				<div style={{ flex: "1 0", textAlign: "right" }}>
					<img src={picked_upload.link} style={{ maxWidth: "100%%", width: "auto", maxHeight: "40px" }} />
				</div>
			</div>
		</div>
	);
}

function DealSwiperComponent(props) {
	const deals = (props.deals && props.deals.items) || [];

	return (
		<Swiper
			spaceBetween={15}
			slidesPerView="auto"
			style={{ width: "100%" }}
		>
			{deals.map(deal => (
				<SwiperSlide key={deal._id} style={{ width: 215, height: 150 }}>
					<DealSwiperListItem {...props} deal={deal} />
				</SwiperSlide>
			))}
		</Swiper>
	);
}

export {
	MobileRenderListItem, MobileRenderViewItem, DealSwiperComponent
};