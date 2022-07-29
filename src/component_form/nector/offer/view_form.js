/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//from system
import React, { useState } from "react";
import ReactLinkify from "react-linkify";
import ReactSwipeButton from "react-swipe-button";
import * as react_game_icons from "react-icons/gi";
import * as react_bs_icons from "react-icons/bs";

import * as antd from "antd";

import collection_helper from "../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);
	const wallets = props.lead.wallets || props.lead.devwallets || [];

	const dataSource = (props.websdkinfos && props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));
	const websdk_config_arr = dataSource.filter(x => x.name === "websdk_config") || [];
	const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
	const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

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
			onClick={() => props.on_offer(item)}>
			<antd.List.Item.Meta
				avatar={
					<div>
						<antd.Avatar shape="square" style={{ height: "auto", width: 70, borderRadius: 0 }} src={picked_upload.link} />
						{(Number(expires_in) < 5 && expire_text) && <div className="nector-lighttext" style={{ backgroundColor: "#fadcd9", color: "#a1170b", display: "block", position: "absolute", top: 0, right: 0, padding: "3px 10px", borderRadius: "0 0 0 8px" }}><react_bs_icons.BsClockHistory /></div>}
					</div>
				}
				title={(
					<div>
						<div>
							<antd.Typography.Paragraph className="nector-text" style={{ marginBottom: 2, display: "block", fontWeight: 500 }}>{item.name}</antd.Typography.Paragraph>
							<antd.Typography.Text className="nector-subtext" style={{ color: "#000000AA", margin: "4px 0", display: "block" }}> {collection_helper.get_limited_text(item.description, 50)}</antd.Typography.Text>
						</div>

						<div className="nector-wallet-point-design nector-pretext" style={{ fontWeight: "bold" }}>
							<react_game_icons.GiTwoCoins className="nector-text" style={{ color: websdk_config.business_color }} /> {collection_helper.get_safe_amount(coin_amount)}
						</div>
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
	const wallets = props.lead.wallets || props.lead.devwallets || [];

	const dataSource = (props.websdkinfos && props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));
	const websdk_config_arr = dataSource.filter(x => x.name === "websdk_config") || [];
	const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
	const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

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
			return collection_helper.show_message("Insufficient coins", "info");
		}

		let derivedsteps = parseInt(selected_coin_amount / coin_amount);
		if (maxallowedsteps < derivedsteps) {
			return collection_helper.show_message(`Only ${maxallowedsteps} steps are allowed`, "info");
		}

		if (is_multiplier === false) derivedsteps = 1;

		return props.api_merchant_create_offerredeems({ offer_id: item._id, wallet_id: picked_wallet._id, step: derivedsteps, coin_amount: selected_coin_amount, fiat_value: (min_fiat_value * derivedsteps), fiat_class: (item.rule && item.rule.fiat_class) });
	};

	const external_offer_redeem = () => {
		if (coin_amount > Number(picked_wallet.available)) {
			return collection_helper.show_message("Insufficient coins", "info");
		}

		return props.api_merchant_create_offerredeems({ offer_id: item._id, wallet_id: picked_wallet._id, step: 1, coin_amount: coin_amount, fiat_value: null, fiat_class: null });
	};

	return (
		<div>
			<div style={{ display: "flex", flexDirection: "column", marginBottom: 20, alignItems: "start" }}>
				<antd.Typography.Text className="nector-title">{item.name}</antd.Typography.Text>
			</div>

			{is_external && (
				<div className="clearfix nector-shimmer-animation infinite" style={{ margin: "20px 0px" }}>
					<ReactSwipeButton text={`Slide to redeem for ${coin_amount} coins`} text_unlocked={"Processing your reward        "} color={"#000"} onSuccess={external_offer_redeem} />
				</div>
			)}

			{!is_external && (
				<div className="clearfix" style={{ margin: "20px 0px" }}>
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

					<div className="clearfix nector-shimmer-animation infinite">
						<ReactSwipeButton text={`Slide to redeem for ${is_multiplier ? selected_coin_amount : coin_amount} coins`} text_unlocked={"Processing your reward        "} color={"#000"} onSuccess={redeem_offer} />
					</div>
				</div>
			)}
		</div>
	);
};


export {
	MobileRenderListItem, MobileRenderViewItem
};