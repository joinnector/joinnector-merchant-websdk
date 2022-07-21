/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";

import * as antd from "antd";
import * as antd_icons from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, FreeMode } from "swiper";
import * as react_game_icons from "react-icons/gi";

// Import Swiper styles
import "swiper/swiper-bundle.css";
import "swiper/modules/free-mode/free-mode.min.css";
import "swiper/modules/pagination/pagination.min.css";

import PreventScroll from "../../../component/nector/common/prevent_scroll";

import collection_helper from "../../../helper/collection_helper";

export function MobileRenderOffers(props) {
	const { items, title, view_all_text_color = "black", show_pagination = false, enable_scroll = false, websdk_config, loading = false, show_loader = true } = props;
	const swiper = useRef(null);

	const is_touch_device = window.matchMedia("(hover: none)").matches;

	const onWheel = (e) => {
		if (!swiper.current || enable_scroll === false) return;

		if (e.deltaY < 0) {
			// scroll up
			swiper.current.slidePrev(300, false);
		} else if (e.deltaY > 0) {
			// scroll down
			swiper.current.slideNext(300, false);
		}
	};

	const swiper_modules = [FreeMode];
	if (is_touch_device === false && show_pagination == true) swiper_modules.push(Pagination);

	return (
		<div>
			{(loading || items?.length > 0) && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
				{title ? <antd.Typography.Text style={{ fontSize: "1.3em", fontWeight: 500 }}>{title}</antd.Typography.Text> : <div></div>}
				{items && items.length > 6 ? (
					<a style={{ fontSize: "0.9em", color: view_all_text_color }} onClick={props.on_offerlist}>View All</a>
				) : null}
			</div>}

			{(loading && show_loader) && (
				<antd.Skeleton active paragraph={{ rows: 4 }} />
			)}

			{(!loading && items?.length > 0) && <PreventScroll disabled={!enable_scroll}>
				<div
					onWheel={onWheel}
					style={{ position: "relative" }}
				>
					<Swiper
						spaceBetween={15}
						slidesPerView={"auto"}
						onSwiper={(s) => { swiper.current = s; }}
						modules={swiper_modules}
						pagination={{
							clickable: true,
						}}
						freeMode={true}
						grabCursor={true}
						className="nector-offer-swiper"
						onSliderMove={() => console.log("slider move even")}
					>
						{items && items.slice(0, 6).map((item) => (
							<SwiperSlide key={item.key}>
								<MobileRenderOfferItem {...props} item={item} />
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</PreventScroll>}
		</div>
	);
}

export function MobileRenderOfferItem(props) {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const { item, websdk_config } = props;

	const uploads = item.uploads || [];
	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };

	const is_available = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	const expire_text = (is_available && item.expire) ? (Number(expires_in) > 0 ? `Expires in ${expires_in} days` : "Expires today") : ((is_available && !item.expire) ? null : "Expired");

	const base_coin_amount = Number((item.rule && item.rule.coin_amount) || 0);
	const coin_amount = Math.round(base_coin_amount / (Number(props.entity?.conversion_factor || 1) || 1));

	const offermeta = {
		picked_upload,
		expire_text,
		coin_amount,
	};

	if (props.offertype === "businessoffers")
		return <MobileRenderBusinessOfferItem {...props} {...offermeta} />;
	else if (props.offertype === "internaloffers")
		return <MobileRenderInternalOfferItem {...props} {...offermeta} />;
	else if (props.offertype === "recommendedoffers")
		return <MobileRenderRecommendedOfferItem {...props} {...offermeta} />;
	else if (props.offertype === "topoffers")
		return <MobileRenderTopOfferItem {...props} {...offermeta} />;
}

export function MobileRenderBusinessOfferItem(props) {
	const { item, websdk_config, picked_upload, expire_text, coin_amount } = props;

	const is_external = (item.rule_type && item.rule_type === "external") || false;
	const is_multiplier = (item.rule && item.rule.is_multiplier) || false;
	const min_fiat_value = Number((item.rule && item.rule.fiat_range && item.rule.fiat_range.min) || 0);
	const max_fiat_value = Number((item.rule && item.rule.fiat_range && item.rule.fiat_range.max) || 0);

	let offertext = "";
	if (is_external === false) {
		if (!is_multiplier && min_fiat_value !== max_fiat_value) offertext += "Upto";
		if (item?.rule?.fiat_class === "amount") offertext += " ₹";
		offertext += max_fiat_value;
		if (item?.rule?.fiat_class === "percent") offertext += "%";
		offertext += " Off";
		offertext = offertext.trim();
	}

	return (
		<div
			className="nector-business-offer-card"
			style={{ width: 240, maxWidth: 240, minHeight: 175, height: "100%", backgroundColor: "white", borderRadius: 12, display: "flex", boxShadow: "3px 3px 15px -3px rgba(0,0,0,0.15)", overflow: "hidden" }}
		>
			<div className="nector-center nector-subtitle" style={{ backgroundColor: "#f15502", width: 50, paddingRight: 10, writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)", textTransform: "uppercase", flexShrink: 0, color: "white" }}>
				{is_external ? "OFFER" : ""}
				{!is_external ? offertext : ""}
			</div>

			<div style={{ display: "flex", flexDirection: "column", padding: "10px 15px", flex: "1 0 0" }}>
				<div className="nector-center" style={{ justifyContent: "flex-start", gap: 10, marginBottom: 5 }}>
					<div style={{ border: "1px solid #eee", padding: 2, backgroundColor: "white", height: "28px", width: "28px", display: "flex" }}>
						<img src={picked_upload.link} style={{ height: "100%", width: "100%", objectFit: "contain" }} />
					</div>

					<antd.Typography.Text className="nector-subtext">{item.brand || ""}</antd.Typography.Text>
				</div>

				<div style={{ display: "flex", flexDirection: "column", flex: "1 0 auto" }}>
					<antd.Typography.Text className="nector-text" style={{ fontWeight: 500 }}>{item.name}</antd.Typography.Text>

					<div style={{ borderTop: "1px dotted #ddd", margin: "5px 0" }}></div>

					{item.description && <antd.Typography.Text className="nector-subtext" style={{ marginBottom: 2, display: "block" }}> {collection_helper.get_limited_text(item.description, 50)}</antd.Typography.Text>}
				</div>

				<div style={{ marginTop: 5, display: "flex", justifyContent: "space-between" }}>
					<span className="nector-subtitle" style={{ display: "inline-block", color: websdk_config?.business_color || "#f5a623" }}>
						<react_game_icons.GiTwoCoins className="nector-subtitle" /> {coin_amount}
					</span>

					<div className="nector-center" style={{ width: 30, height: 30, borderRadius: "50%" }} onClick={() => props.on_offer(item)}
					>
						<antd_icons.ArrowRightOutlined className="nector-text" style={{ color: websdk_config?.business_color }} />
					</div>
				</div>
			</div>
		</div>
	);
}

export function MobileRenderInternalOfferItem(props) {
	const { item, websdk_config, picked_upload, expire_text, coin_amount } = props;

	const backgroundcolor = collection_helper.get_color_from_text_length(item?.name || "");
	const bg_gradient = `linear-gradient(to bottom right, ${collection_helper.adjust_color(backgroundcolor, 25)}, ${backgroundcolor})`;
	const textcolor = "white";

	return (
		<div
			style={{ width: 260, maxWidth: 260, minHeight: 150, height: "100%", padding: 15, backgroundImage: bg_gradient, backgroundColor: backgroundcolor, borderRadius: 4, display: "flex", flexDirection: "column", boxShadow: "3px 3px 15px -3px rgba(0,0,0,0.15)" }}
		>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
				<div className="nector-center" style={{ border: "1px solid #eee", padding: 5, backgroundColor: "white", height: "48px", width: "48px", borderRadius: "50%" }}>
					<img src={picked_upload.link} style={{ height: "85%", width: "85%", objectFit: "contain" }} />
				</div>

				{(expire_text) && <antd.Typography.Text className="nector-subtext" style={{ marginBottom: 2, display: "block", color: textcolor, border: "1px dotted " + textcolor, padding: "2px 4px" }}> {expire_text}</antd.Typography.Text>}
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: 5, flex: "1 0 auto", margin: "10px 0" }}>
				{/* {item.brand && <antd.Typography.Text className="nector-subtext" style={{ color: "black" }}>{item.brand}</antd.Typography.Text>} */}

				<antd.Typography.Text className="nector-text" style={{ fontWeight: 500, color: textcolor }}>{item.name}</antd.Typography.Text>

				{item.description && <antd.Typography.Text className="nector-subtext" style={{ marginBottom: 2, display: "block", color: textcolor }}> {collection_helper.get_limited_text(item.description, 50)}</antd.Typography.Text>}
			</div>

			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<span className="nector-subtitle" style={{ color: textcolor }}>
					<react_game_icons.GiTwoCoins className="nector-subtitle" /> {coin_amount}
				</span>

				<div
					className="nector-center"
					style={{ width: 30, height: 30, borderRadius: "50%" }}
					onClick={() => props.on_offer(item)}
				>
					<antd_icons.ArrowRightOutlined className="nector-subtitle" style={{ color: textcolor }} />
				</div>
			</div>
		</div>
	);
}

export function MobileRenderRecommendedOfferItem(props) {
	const { item, websdk_config, picked_upload, expire_text, coin_amount } = props;

	const backgroundcolor = collection_helper.get_color_from_text_length(item?.name || "");
	const textcolor = "white";

	return (
		<div
			style={{ width: 260, maxWidth: 260, minHeight: 150, height: "100%", padding: 15, backgroundColor: backgroundcolor, borderRadius: 4, display: "flex", flexDirection: "column", boxShadow: "3px 3px 15px -3px rgba(0,0,0,0.15)" }}
		>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
				<div style={{ border: "1px solid #eee", padding: 5, backgroundColor: "white", height: "36px", width: "fit-content", maxWidth: "100%", borderRadius: 6 }}>
					<img src={picked_upload.link} style={{ height: "100%", width: "auto" }} />
				</div>

				{(expire_text) && <antd.Typography.Text className="nector-subtext" style={{ marginBottom: 2, display: "block", color: textcolor, border: "1px dotted " + textcolor, padding: "2px 4px" }}> {expire_text}</antd.Typography.Text>}
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: 5, flex: "1 0 auto", margin: "10px 0" }}>
				{/* {item.brand && <antd.Typography.Text className="nector-subtext" style={{ color: "black" }}>{item.brand}</antd.Typography.Text>} */}

				<antd.Typography.Text className="nector-text" style={{ fontWeight: 500, color: textcolor }}>{item.name}</antd.Typography.Text>

				{item.description && <antd.Typography.Text className="nector-subtext" style={{ marginBottom: 2, display: "block", color: textcolor }}> {collection_helper.get_limited_text(item.description, 50)}</antd.Typography.Text>}
			</div>

			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<span className="nector-subtitle" style={{ color: textcolor }}>
					<react_game_icons.GiTwoCoins className="nector-subtitle" /> {coin_amount}
				</span>

				<div
					className="nector-center"
					style={{ width: 30, height: 30, borderRadius: "50%" }}
					onClick={() => props.on_offer(item)}
				>
					<antd_icons.ArrowRightOutlined className="nector-subtitle" style={{ color: textcolor }} />
				</div>
			</div>
		</div>
	);
}

export function MobileRenderTopOfferItem(props) {
	const { item, websdk_config, picked_upload, expire_text, coin_amount } = props;

	const backgroundcolor = "white";
	const textcolor = "black";

	return (
		<div
			style={{ width: 260, maxWidth: 260, minHeight: 150, height: "100%", padding: 15, backgroundColor: backgroundcolor, borderRadius: 4, display: "flex", flexDirection: "column", boxShadow: "3px 3px 15px -3px rgba(0,0,0,0.15)" }}
		>
			<div style={{ display: "flex" }}>
				<div style={{ display: "flex", flexDirection: "column", flex: "1 0 0", marginRight: 5 }}>
					{item.brand && <antd.Typography.Text className="nector-subtext" style={{ color: "black" }}>{item.brand}</antd.Typography.Text>}

					<antd.Typography.Text className="nector-text" style={{ fontWeight: 500, color: textcolor }}>{item.name}</antd.Typography.Text>
				</div>

				<div className="nector-center" style={{ border: "1px solid #eee", padding: 5, backgroundColor: "white", height: "48px", width: "48px", maxWidth: "100%", borderRadius: 6 }}>
					<img src={picked_upload.link} style={{ height: "100%", width: "100%", objectFit: "contain" }} />
				</div>
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: 5, flex: "1 0 auto", margin: "10px 0" }}>
				{item.description && <antd.Typography.Text className="nector-subtext" style={{ marginBottom: 2, display: "block", color: textcolor }}> {collection_helper.get_limited_text(item.description, 50)}</antd.Typography.Text>}
			</div>

			{/* <div className="nector-center" style={{ justifyContent: "space-between", gap: 10 }}>
				<div className="nector-center" style={{ display: "flex", alignSelf: "flex-start", backgroundColor: websdk_config?.business_color, borderRadius: 12, padding: "5px 10px" }} onClick={() => props.on_offer(item)}>
					<span className="nector-subtitle" style={{ color: websdk_config?.text_color }}>
						<react_game_icons.GiTwoCoins className="nector-subtitle" /> {coin_amount}
					</span>

					<div className="nector-center" style={{ marginLeft: 5, width: 30, height: 30, borderRadius: "50%" }}>
						<antd_icons.RightOutlined className="nector-subtext" style={{ color: websdk_config?.text_color }} />
					</div>
				</div>
			</div> */}

			<div style={{ marginTop: 5, display: "flex", justifyContent: "space-between" }}>
				<span className="nector-subtitle" style={{ display: "inline-block", color: websdk_config?.business_color || "#f5a623" }}>
					<react_game_icons.GiTwoCoins className="nector-subtitle" /> {coin_amount}
				</span>

				<div className="nector-center" style={{ width: 30, height: 30, borderRadius: "50%" }} onClick={() => props.on_offer(item)}
				>
					<antd_icons.ArrowRightOutlined className="nector-subtitle" style={{ color: websdk_config?.business_color }} />
				</div>
			</div>
		</div>
	);
}