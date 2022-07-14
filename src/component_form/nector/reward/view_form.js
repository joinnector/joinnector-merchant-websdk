/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";

import * as antd from "antd";
import * as antd_icons from "@ant-design/icons";
import copy_to_clipboard from "copy-to-clipboard";
import ReactLinkify from "react-linkify";

import * as react_hero_icons from "react-icons/hi";
import * as react_material_icons from "react-icons/md";

import Button from "../../../component/nector/common/button";

import collection_helper from "../../../helper/collection_helper";
import useIsMobile from "../../../hooks/useIsMobile";

export function EarnItem(props) {
	const { trigger, activities, websdk_config, has_user } = props;
	const [show_overlay, set_show_overlay] = useState(false);

	const is_completed = Number(activities?.find(activity => activity.parent_id === trigger._id)?.count || 0) > 0;

	const is_touch_device = window.matchMedia("(hover: none)").matches;

	const on_container_click = () => {
		if (is_touch_device) set_show_overlay(true);
	};

	const hide_overlay = (e) => {
		e.stopPropagation();
		set_show_overlay(false);
	};

	const on_execute_after_link_click = (e) => {
		e.stopPropagation();

		if (trigger.content?.redirect_link) {
			window.open(trigger.content?.redirect_link, "_blank");

			if (trigger.content?.execute_after === "link_click") {
				props.api_merchant_create_triggeractivities({ trigger_id: trigger._id });
			}

			set_show_overlay(false);
		}
	};

	return (
		<div className="nector-rewards-earn-item" key={trigger._id} onClick={on_container_click}>
			<div className="nector-rewards-earn-item-icon nector-center" style={{ backgroundColor: websdk_config.business_color, color: websdk_config.text_color }}>
				{trigger?.content?.link_icon ? (
					<img src={trigger.content.link_icon} />
				) : trigger?.content?.fa_icon ? (
					<i className={`fa ${trigger.content.fa_icon} nector-subtitle`} style={{ color: websdk_config.text_color }}></i>
				) : null}
			</div>

			<antd.Typography.Title level={4} className="nector-rewards-earn-item-title">{trigger?.content?.name}</antd.Typography.Title>

			<antd.Typography.Text>{trigger?.content?.description}</antd.Typography.Text>

			{/* Login/Signup Overlay */}
			{!has_user && (<div className={`nector-rewards-earn-login-overlay nector-center ${show_overlay ? "force-show" : ""}`}>
				{(is_touch_device && show_overlay) && (
					<div className="close-button" onClick={hide_overlay}>
						<antd_icons.CloseOutlined style={{ color: "white" }} />
					</div>
				)}

				<antd.Button href={websdk_config.signup_link} target="_parent">Signup</antd.Button>
				<antd.Typography.Text style={{ color: "white" }}>
					Already have an account?{" "}
					<a href={websdk_config.login_link} target="_parent" style={{ color: "white", textDecoration: "underline" }}>Login</a>
				</antd.Typography.Text>
			</div>)}

			{has_user && (<div className={`nector-rewards-earn-login-overlay nector-center ${show_overlay ? "force-show" : ""}`}>
				{(is_touch_device && show_overlay) && (
					<div className="close-button" onClick={hide_overlay}>
						<antd_icons.CloseOutlined />
					</div>
				)}

				{(trigger.content?.redirect_link) && <>
					{(trigger.content_type === "social") && !is_completed && <antd.Typography.Text>
						Visit the link below and follow the page to get rewarded!
					</antd.Typography.Text>}

					{(trigger.content_type !== "social") && !is_completed && <antd.Typography.Text>
						Please visit the link below and complete the action to get rewarded!
					</antd.Typography.Text>}

					{is_completed && <antd.Typography.Text>
						You have already completed this action
					</antd.Typography.Text>}

					<antd.Button onClick={on_execute_after_link_click}>Visit Link</antd.Button>
				</>}

				{(!trigger.content?.redirect_link) && <>
					{!is_completed && <antd.Typography.Text>
						Please complete the action and you will be automatically rewarded!
					</antd.Typography.Text>}

					{is_completed && <antd.Typography.Text>
						You have already completed this action
					</antd.Typography.Text>}
				</>}
			</div>)}

			{has_user && is_completed && (
				<div className="nector-rewards-earn-item-completed-icon">
					<antd_icons.CheckCircleOutlined style={{ color: "green" }} />
				</div>
			)}
		</div>
	);
}

export function RedeemItem(props) {
	const { offer: item, websdk_config, has_user, is_own_offer = true } = props;
	const [show_overlay, set_show_overlay] = useState(false);
	const [redeemed_coupon, set_redeemed_coupon] = useState(null);
	const [loading, set_loading] = useState(false);
	const [flip_card, set_flip_card] = useState(false);
	const [show_back, set_show_back] = useState(false);

	const is_touch_device = window.matchMedia("(hover: none)").matches;

	const is_external = (item.rule_type && item.rule_type === "external") || false;

	const wallets = props.lead.wallets || props.lead.devwallets || [];
	const picked_wallet = wallets.length > 0 ? wallets[0] : {
		available: "0",
		reserve: "0",
	};

	const is_multiplier = (item.rule && item.rule.is_multiplier) || false;

	const base_coin_amount = Number((item.rule && item.rule.coin_amount) || 0);
	const coin_amount = Math.round(base_coin_amount / (Number(props.entity?.conversion_factor || 1) || 1));

	const [selected_coin_amount, set_selected_coin_amount] = useState(coin_amount);

	const min_fiat_value = Number((item.rule && item.rule.fiat_range && item.rule.fiat_range.min) || 0);
	const max_fiat_value = Number((item.rule && item.rule.fiat_range && item.rule.fiat_range.max) || 0);
	const maxallowedsteps = parseInt(max_fiat_value / min_fiat_value);

	let allowedsteps = 1;
	if (Number(picked_wallet.available) >= (coin_amount * maxallowedsteps)) allowedsteps = maxallowedsteps;
	if (Number(picked_wallet.available) < (coin_amount * maxallowedsteps)) allowedsteps = parseInt(Number(picked_wallet.available) / coin_amount);
	if (allowedsteps > 10) allowedsteps = 10;

	const is_available = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");
	const expire_text = (is_available && item.expire) ? (Number(expires_in) > 0 ? `Expires in ${expires_in} days` : "Expires today") : ((is_available && !item.expire) ? "Available" : "Expired");

	useEffect(() => {
		let new_coin_amount = Math.round(base_coin_amount / (Number(props.entity?.conversion_factor || 1) || 1));
		set_selected_coin_amount(new_coin_amount);
	}, [Number(props.entity?.conversion_factor || 1)]);

	useEffect(() => {
		set_flip_card(false);
		set_show_back(false);
	}, [item._id]);

	const redeem_offer = (e) => {
		e.stopPropagation();

		if (selected_coin_amount > Number(picked_wallet.available)) {
			collection_helper.show_message("Insufficient coins", "info");
		}

		let derivedsteps = parseInt(selected_coin_amount / coin_amount);
		if (maxallowedsteps < derivedsteps) {
			collection_helper.show_message(`Only ${maxallowedsteps} steps are allowed`, "info");
		}

		if (is_multiplier === false) derivedsteps = 1;

		set_loading(true);

		const callback = (result) => {
			set_loading(false);
			if (result?.data?.coupon?.value) {
				set_redeemed_coupon(result.data.coupon.value);
			}
		};

		if (is_external) {
			props.api_merchant_create_offerredeems({ offer_id: item._id, wallet_id: picked_wallet._id, step: 1, coin_amount: coin_amount, fiat_value: null, fiat_class: null }, callback);
		} else {
			props.api_merchant_create_offerredeems({ offer_id: item._id, wallet_id: picked_wallet._id, step: derivedsteps, coin_amount: selected_coin_amount, fiat_value: (min_fiat_value * derivedsteps), fiat_class: (item.rule && item.rule.fiat_class) }, callback);
		}
	};

	const on_container_click = () => {
		if (is_touch_device) set_show_overlay(true);
	};

	const hide_overlay = (e) => {
		e.stopPropagation();
		set_show_overlay(false);
	};

	const on_flip_card = (e) => {
		if (!has_user) return;
		if (flip_card) {
			setTimeout(() => set_show_back(false), 700);
		} else {
			set_show_back(true);
		}
		set_flip_card(prev => !prev);
	};

	return (
		<div key={item._id} className="nector-rewards-redeem-item-container">
			<div className={`nector-rewards-redeem-item ${has_user && is_multiplier ? "multiplier" : ""} ${flip_card ? "flip" : ""}`} onClick={on_container_click}>
				<div className="nector-rewards-redeem-item-front-side">
					<div className="nector-rewards-redeem-item-desc-container">
						{(is_external || !is_own_offer) && <antd.Typography.Title level={4} style={{ color: websdk_config.business_color }}>
							{item.name}
						</antd.Typography.Title>}

						{(!is_external && is_own_offer) && <antd.Typography.Title level={4} style={{ color: websdk_config.business_color }}>
							{!is_multiplier && min_fiat_value !== max_fiat_value ? "Upto" : ""}{" "}

							{item?.rule?.fiat_class === "amount" ? "₹" : ""}
							{!is_multiplier ? max_fiat_value : ""}
							{is_multiplier ? ((selected_coin_amount / coin_amount) * min_fiat_value).toFixed(0) : ""}
							{item?.rule?.fiat_class === "percent" ? "%" : ""}
							{item?.rule?.fiat_class ? " Off" : ""}
						</antd.Typography.Title>}

						<antd.Typography.Text className="nector-rewards-redeem-item-coins">{selected_coin_amount} Coins</antd.Typography.Text>

						{(redeemed_coupon) && <div className="nector-rewards-coupon-item-coupon-text">
							<antd.Typography.Text level={5}><strong>{redeemed_coupon}</strong></antd.Typography.Text>

							<react_material_icons.MdContentCopy className="nector-text" onClick={() => copy_to_clipboard(redeemed_coupon)} style={{ color: "#000", cursor: "pointer" }} />
						</div>}
					</div>

					<div className="nector-rewards-redeem-item-btns-container">
						{(has_user && is_multiplier) && (
							<antd.Slider
								defaultValue={coin_amount}
								min={coin_amount}
								max={(coin_amount * allowedsteps)}
								step={coin_amount}
								marks={{
									[coin_amount]: {
										style: {
											fontSize: "75%",
											opacity: 0.7
										},
										label: coin_amount
									}
								}}
								included={true}
								value={selected_coin_amount}
								onChange={(value) => set_selected_coin_amount(value)}
								trackStyle={{ backgroundColor: websdk_config.business_color }}
								handleStyle={{ borderColor: websdk_config.business_color }}
							/>
						)}

						{has_user
							? <Button className="nector-rewards-redeem-item-btn" loading={loading} disabled={Number(picked_wallet.available) < selected_coin_amount || redeemed_coupon} onClick={redeem_offer}>
								{redeemed_coupon !== null ? "Success!" : "Redeem"}
							</Button>
							: <div style={{ height: 50 }}></div>
						}
					</div>

					{!has_user && (<div className={`nector-rewards-earn-login-overlay nector-center ${show_overlay ? "force-show" : ""}`}>
						{(is_touch_device && show_overlay) && (
							<div className="close-button" onClick={hide_overlay}>
								<antd_icons.CloseOutlined style={{ color: "white" }} />
							</div>
						)}

						<antd.Button href={websdk_config.signup_link} target="_parent">Signup</antd.Button>
						<antd.Typography.Text style={{ color: "white" }}>
							Already have an account?{" "}
							<a href={websdk_config.login_link} target="_parent" style={{ color: "white", textDecoration: "underline" }}>Login</a>
						</antd.Typography.Text>
					</div>)}

					<div className="dashed-line"></div>

					<antd_icons.InfoCircleOutlined className="info-icon" onClick={on_flip_card} style={{ color: websdk_config.business_color }} />
				</div>

				<div className="nector-rewards-redeem-item-back-side" style={{ display: show_back ? "initial" : "none" }}>
					<div className="nector-rewards-redeem-item-description-container">
						<antd.Typography.Paragraph className="nector-subtext">{expire_text}</antd.Typography.Paragraph>

						<h3><b>{item.name}</b></h3>
						<div style={{ borderBottom: "1px solid #eeeeee", margin: "10px 0px" }} />

						<b style={{ borderBottom: "1px solid #eeeeee" }}>Description </b>
						<div style={{ margin: 5 }} />
						<ReactLinkify componentDecorator={(decoratedHref, decoratedText, key) => (
							<a target="_blank" rel="noopener noreferrer" href={decoratedHref} key={key}>
								{decoratedText}
							</a>
						)}>
							<p className="nector-subtext" style={{ cursor: "pointer", whiteSpace: "pre-wrap" }}>{item.description || "No Description Available"}</p>
						</ReactLinkify>

						<div style={{ margin: 5 }} />
						{
							item.availed ? (<div>
								<b style={{ borderBottom: "1px solid #eeeeee" }}>Redeemed </b>
								<div style={{ margin: 5 }} />
								<span className="nector-subtext">{Number(item.availed)} Time(s) on this app </span>
							</div>) : null
						}

						<antd_icons.CloseOutlined className="info-icon" onClick={on_flip_card} style={{ color: websdk_config.business_color }} />
					</div>
				</div>
			</div>
		</div>
	);
}

export function ListWalletTransactionItem(props) {
	const { item, websdk_config, is_last_item } = props;

	return (
		<antd.List.Item className="nector-rewards-wallettransaction-item" style={{ borderBottom: !is_last_item ? "1px solid #eee" : "none" }}>
			<antd.List.Item.Meta
				avatar={item.operation === "cr" ? (<react_hero_icons.HiPlusCircle className="nector-title" style={{ color: websdk_config.business_color }} />) : <react_hero_icons.HiMinusCircle className="nector-title" style={{ color: websdk_config.business_color }} />}

				title={<div style={{ marginLeft: -5 }}>
					<antd.Typography.Paragraph className="nector-text" style={{ marginBottom: 2, display: "block" }}>{Number(item.amount)} Points</antd.Typography.Paragraph>
				</div>}

				description={<div style={{ marginLeft: -5, marginRight: 5 }}>
					<antd.Typography.Text className="nector-subtext" style={{ color: "#00000080", marginBottom: 2, display: "block" }}> {item.title || collection_helper.get_text_from_wallettransaction_type_amount(item.type, item.amount)}</antd.Typography.Text>
				</div>}
			/>

			<antd.Typography.Text className="nector-subtext" style={{ display: "block" }} title={collection_helper.get_moment()(item.created_at).format("MMMM Do YYYY, h:mm:ss a")}>{collection_helper.get_moment()(item.created_at).format("MMMM Do YYYY")}</antd.Typography.Text>
		</antd.List.Item>
	);
}

export function ListCouponItem(props) {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const { item, is_last_item, websdk_config } = props;
	const is_mobile = useIsMobile();

	const [show_details, set_show_details] = useState(false);

	const offer = item.offer || {};
	const uploads = offer.uploads || [];
	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };

	const is_available = collection_helper.convert_to_moment_utc_from_datetime(offer.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(offer.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	const expire_text = (is_available && offer.expire) ? (Number(expires_in) > 0 ? `Expires in ${expires_in} days` : "Expires today") : ((is_available && !offer.expire) ? "Available" : "Expired");

	useEffect(() => {
		set_show_details(false);
	}, [item._id]);

	return (
		<antd.List.Item className="nector-rewards-coupon-item" style={{ borderBottom: !is_last_item ? "1px solid #eee" : "none" }}>
			<antd.List.Item.Meta
				avatar={<react_material_icons.MdLocalOffer className="nector-subtitle" style={{ color: websdk_config.business_color }} />}

				title={<div>
					<antd.Typography.Paragraph className="nector-text" style={{ marginBottom: 2, display: "block" }}>{collection_helper.get_lodash().capitalize(offer.name)}</antd.Typography.Paragraph>
				</div>}

				description={
					<div>
						<div className="nector-rewards-coupon-item-coupon-text">
							<antd.Typography.Text level={5}><strong>{item.value}</strong></antd.Typography.Text>

							<react_material_icons.MdContentCopy className="nector-text" onClick={() => copy_to_clipboard(item.value)} style={{ color: "#000", cursor: "pointer" }} />
						</div>

						<div>
							{is_mobile && <antd.Typography.Text className="nector-subtext" style={{ color: "#666" }}>{expire_text}</antd.Typography.Text>}
						</div>

						<div className="nector-rewards-coupon-item-description-container">
							<antd.Typography.Text className="nector-subtext" onClick={() => set_show_details(p => !p)}>Details <antd_icons.CaretDownOutlined /></antd.Typography.Text>

							<antd.Collapse
								className="nector-rewards-collapse"
								activeKey={show_details ? "details" : ""}
								bordered={false}
								collapsible={false}
							>
								<antd.Collapse.Panel key="details" className="nector-rewards-collapse-panel" showArrow={false}>
									<b style={{ borderBottom: "1px solid #eeeeee" }}>Description </b>
									<div style={{ margin: 5 }} />
									<ReactLinkify componentDecorator={(decoratedHref, decoratedText, key) => (
										<a target="_blank" rel="noopener noreferrer" href={decoratedHref} key={key}>
											{decoratedText}
										</a>
									)}>
										<p className="nector-subtext" style={{ cursor: "pointer", whiteSpace: "pre-wrap" }}>{offer.description || "No Description Available"}</p>
									</ReactLinkify>

									<div style={{ margin: 5 }} />
									{
										offer.availed ? (<div>
											<b style={{ borderBottom: "1px solid #eeeeee" }}>Redeemed </b>
											<div style={{ margin: 5 }} />
											<span className="nector-subtext">{Number(offer.availed)} Time(s) on this app </span>
										</div>) : null
									}
								</antd.Collapse.Panel>
							</antd.Collapse>
						</div>
					</div>
				}
			/>

			{!is_mobile && <div className="content">
				<antd.Typography.Text className="nector-subtext" style={{ color: "#666" }}>{expire_text}</antd.Typography.Text>
			</div>}
		</antd.List.Item>
	);
}