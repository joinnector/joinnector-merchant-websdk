/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//from system
import React, { useState } from "react";
import ReactLinkify from "react-linkify";
import ReactSwipeButton from "react-swipe-button";
import * as react_game_icons from "react-icons/gi";

import * as antd from "antd";

import collection_helper from "../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const wallets = props.lead.wallets || props.lead.devwallets || [];
	const websdk_config = props.websdk_config || {};

	const is_available = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	const expire_text = (is_available && item.expire) ? (Number(expires_in) > 0 ? `Expires in ${expires_in}d` : "Expires today") : ((is_available && !item.expire) ? null : "Expired");

	const uploads = item.uploads || [];
	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };
	const picked_wallet = wallets.length > 0 ? wallets[0] : {
		available: "0",
		reserve: "0",
	};

	const base_coin_amount = Number((item.rule && item.rule.coin_amount) || 0);
	const coin_amount = (base_coin_amount / (Number(props.entity?.conversion_factor || 1) || 1)).toFixed(0);

	return (
		<antd.List.Item
			className="nector-list-item nector-offer-list-item nector-cursor-pointer"
			style={{ position: "relative", padding: "15px 10px", margin: "25px 5px", marginRight: 10, border: "1px solid #f2f2f2", borderRadius: 8, boxShadow: "rgba(0, 0, 0, 0.075) 0px 2px 12px", overflow: "hidden" }}
			onClick={() => props.on_offer(item)}
		>
			<antd.List.Item.Meta
				avatar={<antd.Avatar shape="square" style={{ height: "auto", width: 70, borderRadius: 0 }} src={picked_upload.link} />}
				title={(
					<div>
						<div>
							<antd.Typography.Paragraph className="nector-text" style={{ marginBottom: 2, display: "block", fontWeight: 500 }}>{item.name}</antd.Typography.Paragraph>

							{(item.category) && <span className="nector-center nector-subtext" style={{ display: "inline-flex", borderRadius: 20, color: "#586d7d" }}>
								&#x2022; {collection_helper.convert_to_string_first_capital_from_any_string(item.category)}
							</span>}

							<antd.Typography.Text className="nector-subtext" style={{ color: "#000000AA", margin: "4px 0", display: "block" }}> {collection_helper.get_limited_text(item.description, 50)}</antd.Typography.Text>
						</div>

						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10 }}>
							{/* <antd.Tag color="orange" style={{ padding: "3px 10px" }}>{coin_amount} Coins</antd.Tag> */}

							<div className="nector-center nector-pretext" style={{ gap: 4, backgroundColor: "#dce3e8", color: "#5b7282", padding: "5px 12px", borderRadius: 4 }}>
								<span><react_game_icons.GiTwoCoins className="nector-subtitle" style={{ color: "#5b7282" }} /></span>
								<span style={{ fontSize: 12 }}>{coin_amount}</span>
							</div>
						</div>

						{(expire_text) && <div className="nector-subtext nector-lighttext" style={{ backgroundColor: "#fadcd9", color: "#a1170b", display: "block", position: "absolute", bottom: 0, right: 0, padding: "3px 10px", borderRadius: "8px 0 0 0" }}>{expire_text}</div>}
					</div>
				)}
			/>
		</antd.List.Item>
	);
};

// eslint-disable-next-line no-unused-vars
const MobileRenderViewItem = (props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const item = props.item;
	const colors = props.colors;
	const wallets = props.lead.wallets || props.lead.devwallets || [];

	const websdk_config = (props.websdkinfos && props.websdkinfos.items) || [];
	const websdk_config_options = websdk_config.length > 0 ? websdk_config[0].value : {};

	const has_wallet = wallets.length > 0 || false;

	const picked_wallet = wallets.length > 0 ? wallets[0] : {
		available: "0",
		reserve: "0",
	};

	// based on the type
	const is_external = (item.rule_type && item.rule_type === "external") || false;

	const base_coin_amount = Number((item.rule && item.rule.coin_amount) || 0);
	const coin_amount = Math.round(base_coin_amount / (Number(props.entity?.conversion_factor || 1) || 1));

	const [selected_coin_amount, set_selected_coin_amount] = useState(coin_amount);

	React.useEffect(() => {
		let new_coin_amount = Math.round(base_coin_amount / (Number(props.entity?.conversion_factor || 1) || 1));
		set_selected_coin_amount(new_coin_amount);
	}, [Number(props.entity?.conversion_factor || 1), item]);

	const min_fiat_value = Number((item.rule && item.rule.fiat_range && item.rule.fiat_range.min) || 0);
	const max_fiat_value = Number((item.rule && item.rule.fiat_range && item.rule.fiat_range.max) || 0);
	const maxallowedsteps = parseInt(max_fiat_value / min_fiat_value);
	const is_multiplier = (item.rule && item.rule.is_multiplier) || false;

	let allowedsteps = 1;
	if (Number(picked_wallet.available) >= (coin_amount * maxallowedsteps)) allowedsteps = maxallowedsteps;
	if (Number(picked_wallet.available) < (coin_amount * maxallowedsteps)) allowedsteps = parseInt(Number(picked_wallet.available) / coin_amount);
	if (allowedsteps > 10) allowedsteps = 10;

	const available_balance = Number(picked_wallet.available);

	const redeem_offer = () => {
		if (selected_coin_amount > Number(picked_wallet.available)) {
			collection_helper.show_message("Insufficient coins", "info");
			return props.toggle_drawer();
		}

		let derivedsteps = parseInt(selected_coin_amount / coin_amount);
		if (maxallowedsteps < derivedsteps) {
			collection_helper.show_message(`Only ${maxallowedsteps} steps are allowed`, "info");
			return props.toggle_drawer();
		}

		if (is_multiplier === false) derivedsteps = 1;

		return props.api_merchant_create_offerredeems({ offer_id: item._id, wallet_id: picked_wallet._id, step: derivedsteps, coin_amount: selected_coin_amount, fiat_value: (min_fiat_value * derivedsteps), fiat_class: (item.rule && item.rule.fiat_class) });
	};

	const external_offer_redeem = () => {
		if (coin_amount > Number(picked_wallet.available)) {
			collection_helper.show_message("Insufficient coins", "info");
			return props.toggle_drawer();
		}

		return props.api_merchant_create_offerredeems({ offer_id: item._id, wallet_id: picked_wallet._id, step: 1, coin_amount: coin_amount, fiat_value: null, fiat_class: null });
	};

	return (
		<div>
			<div style={{ display: "flex", flexDirection: "column", marginBottom: 20, alignItems: "start" }}>
				<antd.Typography.Title style={{ fontSize: 24, fontWeight: "normal" }}>{item.name}</antd.Typography.Title>

				<div className="nector-center" style={{ display: "flex", gap: 6, padding: "8px 15px", backgroundColor: "#5b7282", color: "white", alignItems: "baseline", borderRadius: 4, fontSize: 14 }}>
					<span><react_game_icons.GiTwoCoins className="nector-subtitle" style={{ color: "white" }} /></span>
					<span>{selected_coin_amount}</span>
				</div>
			</div>

			{is_external && (
				has_wallet && (<div className="clearfix" style={{ margin: "20px 0px" }}>
					<ReactSwipeButton text={`Redeem for ${coin_amount} Coins`} text_unlocked={"Processing your reward"} color={"#000"} onSuccess={external_offer_redeem} />
				</div>)
			)}

			{!is_external && (
				has_wallet && (<div className="clearfix" style={{ margin: "20px 0px" }}>
					{is_multiplier && (
						<div style={{ marginBottom: 20 }}>
							<antd.Typography.Text className="nector-subtext">Please choose the amount of coins to use for availing the offer</antd.Typography.Text>

							<antd.Slider
								className="nector-offer-slider"
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
								tipFormatter={(value) => {
									return available_balance < value ? "Insufficient Balance" : value;
								}}
								included={true}
								value={selected_coin_amount}
								onChange={(value) => set_selected_coin_amount(value)}
							/>

							<antd.Typography.Paragraph className="nector-text">Use <strong>{selected_coin_amount} Coins</strong> to get discount of <strong> {(item.rule && item.rule.fiat_class) === "percent" ? "" : "Flat"} {((selected_coin_amount / coin_amount) * min_fiat_value).toFixed(0)}{(item.rule && item.rule.fiat_class) === "percent" ? "%" : ""} </strong> at checkout</antd.Typography.Paragraph>
						</div>
					)}

					<ReactSwipeButton text={`Redeem for ${is_multiplier ? selected_coin_amount : coin_amount} Coins`} text_unlocked={"Processing your reward"} color={"#000"} onSuccess={redeem_offer} />
				</div>)
			)}
		</div>
	);
};


export {
	MobileRenderListItem, MobileRenderViewItem
};