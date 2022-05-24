/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//from system
import React, { useState } from "react";
import ReactLinkify from "react-linkify";
import ReactSwipeButton from "react-swipe-button";

import * as antd from "antd";

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

	const coin_amount = Number((item.rule && item.rule.coin_amount) || 0).toFixed(0);

	return (
		<antd.List.Item onClick={() => props.on_offer(item)}>
			<antd.List.Item.Meta
				avatar={<antd.Avatar className="nector-brand-icon" style={{ background: "#eeeeee", borderRadius: 10, height: 40, width: 70, border: "3px solid #eeeeee" }} src={picked_upload.link} />}
				title={<div>
					<antd.Typography.Paragraph style={{ fontSize: "1em", fontWeight: 600, marginBottom: 2, display: "block" }}>{collection_helper.get_lodash().capitalize(item.name)}</antd.Typography.Paragraph>
					<antd.Tag color="orange">{coin_amount} Coins</antd.Tag>
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

	const websdk_config = (props.websdkinfos && props.websdkinfos.items) || [];
	const websdk_config_options = websdk_config.length > 0 ? websdk_config[0].value : {};

	const has_wallet = (wallets.length > 0 && (websdk_config_options.hide_wallet || false) !== true) || false;

	const is_available = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(item.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	const expire_text = (is_available && item.expire) ? (Number(expires_in) > 0 ? `Expires in ${expires_in} days` : "Expires today") : ((is_available && !item.expire) ? "Available" : "Expired");

	const uploads = item.uploads || [];
	const picked_upload = uploads.length > 0 ? uploads[0] : { link: default_search_params.placeholder_image };
	const picked_wallet = wallets.length > 0 ? wallets[0] : {
		available: "0",
		reserve: "0",
	};

	// based on the type
	const is_external = (item.rule_type && item.rule_type === "external") || false;

	if (is_external) {
		const coin_amount = Number((item.rule && item.rule.coin_amount) || 0).toFixed(0);

		const redeem_offer = () => {
			if (coin_amount > Number(picked_wallet.available)) return collection_helper.show_message("Insufficient coins", "info");
			return props.api_merchant_create_offerredeems({ offer_id: item._id, wallet_id: picked_wallet._id });
		};

		return (
			<div>
				<div style={{ textAlign: "center", }}>
					<img src={picked_upload.link} style={{ background: "#eeeeee", borderRadius: 10, height: 75, width: 150, border: "3px solid #eeeeee" }} />
				</div>

				<div style={{ borderBottom: "1px solid #eeeeee", margin: "10px 0px" }} />

				<antd.Typography.Paragraph style={{ fontSize: "0.8em" }}>{expire_text}</antd.Typography.Paragraph>

				<h3><b>{collection_helper.get_lodash().capitalize(item.name)}</b></h3>
				{
					has_wallet && props.drawer_visible && (<div style={{ margin: "20px 0px" }}>
						<ReactSwipeButton text={`Redeem for ${coin_amount}`} text_unlocked={"Processing your reward"} color={"#000"} onSuccess={redeem_offer} />
					</div>)
				}
				<div>
					{
						item.description && (
							<div style={has_wallet ? { paddingTop: 70 } : { padding: 0 }}>
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
									item.availed && (<div>
										<b style={{ borderBottom: "1px solid #eeeeee" }}>Redeemed </b>
										<div style={{ margin: 5 }} />
										<a target="_blank" rel="noopener noreferrer">
											<span style={{ fontSize: "0.8em" }}>{Number(item.availed)} Time(s) on this app </span>
										</a>
									</div>)
								}

							</div>
						)
					}
				</div>
			</div>
		);
	} else {
		const coin_amount = Number((item.rule && item.rule.coin_amount) || 0).toFixed(0);
		const min_fiat_amount = Number((item.rule && item.rule.fiat_range && item.rule.fiat_range.min) || 0);
		const max_fiat_amount = Number((item.rule && item.rule.fiat_range && item.rule.fiat_range.max) || 0);
		const maxallowedsteps = is_external ? 1 : parseInt(max_fiat_amount / min_fiat_amount);
		const is_multipler = (item.rule && item.rule.is_multipler) || false;

		const [selected_coin_amount, set_selected_coin_amount] = useState(coin_amount); // only used for rule which allow this to be multipler

		const redeem_offer = () => {
			const derivedsteps = parseInt(selected_coin_amount / coin_amount);
			if (selected_coin_amount > Number(picked_wallet.available)) return collection_helper.show_message("Insufficient coins", "info");
			if (!is_multipler && selected_coin_amount > coin_amount) return collection_helper.show_message("Multiplier not supported", "info");
			if (is_multipler && derivedsteps > 10) return collection_helper.show_message("Maximum 10 steps are allowed", "info");
			if (maxallowedsteps < derivedsteps) return collection_helper.show_message(`Only ${maxallowedsteps} steps are allowed`, "info");

			return props.api_merchant_create_offerredeems({ offer_id: item._id, wallet_id: picked_wallet._id, step: derivedsteps });
		};

		return (
			<div>
				<div style={{ textAlign: "center", }}>
					<img src={picked_upload.link} style={{ background: "#eeeeee", borderRadius: 10, height: 75, width: 150, border: "3px solid #eeeeee" }} />
				</div>

				<div style={{ borderBottom: "1px solid #eeeeee", margin: "10px 0px" }} />

				<antd.Typography.Paragraph style={{ fontSize: "0.8em" }}>{expire_text}</antd.Typography.Paragraph>

				<h3><b>{collection_helper.get_lodash().capitalize(item.name)}</b></h3>
				{
					has_wallet && props.drawer_visible && (<div style={{ margin: "20px 0px" }}>
						{is_multipler && (
							<div style={{ marginBottom: 20 }}>
								<antd.Typography.Text style={{ fontSize: "0.8em" }}>Please choose the amount of coins to use for availing the offer</antd.Typography.Text>

								<antd.Slider
									defaultValue={coin_amount}
									min={coin_amount}
									max={(coin_amount * maxallowedsteps) > Number(picked_wallet.available) ? coin_amount * Math.floor(Number(picked_wallet.available) / coin_amount) : coin_amount * (coin_amount * maxallowedsteps)}
									step={coin_amount}
									marks={{
										[coin_amount]: {
											style: {
												fontSize: "0.8em",
												opacity: 0.7
											},
											label: coin_amount
										}
									}}
									included={true}
									value={selected_coin_amount}
									onChange={(value) => set_selected_coin_amount(value)}
								/>

								<antd.Typography.Text>You will get a discount of <strong>{((selected_coin_amount / coin_amount) * min_fiat_amount).toFixed(2)}</strong> for redeeming <strong>{selected_coin_amount} coins</strong></antd.Typography.Text>
							</div>
						)}

						<ReactSwipeButton text={`Redeem for ${is_multipler ? selected_coin_amount : coin_amount}`} text_unlocked={"Processing your reward"} color={"#000"} onSuccess={redeem_offer} />
					</div>)
				}
				<div>
					{
						item.description && (
							<div style={has_wallet ? { paddingTop: 70 } : { padding: 0 }}>
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
									item.availed && (<div>
										<b style={{ borderBottom: "1px solid #eeeeee" }}>Redeemed </b>
										<div style={{ margin: 5 }} />
										<a target="_blank" rel="noopener noreferrer">
											<span style={{ fontSize: "0.8em" }}>{Number(item.availed)} Time(s) on this app </span>
										</a>
									</div>)
								}

							</div>
						)
					}
				</div>
			</div>
		);
	}
};


export {
	MobileRenderListItem, MobileRenderViewItem
};