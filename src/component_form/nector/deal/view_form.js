/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//from system
import React from "react";
import ReactLinkify from "react-linkify";
import ReactSwipeButton from "react-swipe-button";
import * as react_material_icons from "react-icons/md";
import * as framer_motion from "framer-motion";

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
		currency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") },
		devcurrency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") }
	};

	const redeem_price = Math.ceil(Number(item.sell_price || 0) / (picked_wallet.currency || picked_wallet.devcurrency).conversion_factor || 1).toFixed((picked_wallet.currency || picked_wallet.devcurrency).place || 1);

	return (
		<antd.List.Item onClick={() => props.on_deal(item)}>
			<framer_motion.motion.div
				className="scratch_card_container"
				key={item._id}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.9 }}
				transition={{ type: "spring", stiffness: 300 }}>
				<antd.Card style={{ height: 235, borderRadius: 5, width: "100%", background: "#eeeeee", }}>
					<div>
						<div className="nector-ant-image-img" style={{ textAlign: "center" }}>
							<img src={picked_upload.link} style={{ background: "#fff", borderRadius: 10, height: 75, maxWidth: 150, border: "3px solid #eeeeee" }} />
							<antd.Typography.Paragraph style={{ fontSize: "0.7em", fontWeight: "bold" }}>{`${redeem_price}`} Coins | {expire_text}</antd.Typography.Paragraph>
						</div>

						<div style={{ position: "absolute", bottom: 0, left: 10, right: 10, marginBottom: "5%" }}>
							<antd.Typography.Text style={{ fontSize: "1.3em", marginBottom: 2, display: "block" }}>{collection_helper.get_limited_text(item.name, 30)}</antd.Typography.Text>
						</div>
					</div>
				</antd.Card>
			</framer_motion.motion.div>
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
		currency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") },
		devcurrency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") }
	};

	const redeem_price = Math.ceil(Number(item.sell_price || 0) / (picked_wallet.currency || picked_wallet.devcurrency).conversion_factor || 1).toFixed((picked_wallet.currency || picked_wallet.devcurrency).place || 1);

	const redeem_deal = () => {
		if (Number(redeem_price) > Number(picked_wallet.available)) {
			collection_helper.show_message("Insufficient coins", "info");
			return props.toggle_drawer();
		}

		return props.api_merchant_create_dealredeems({ deal_id: item._id, wallet_id: picked_wallet._id, currency_id: picked_wallet.currency_id });
	};

	return (
		<div>
			<div style={{ textAlign: "center", }}>
				<img src={picked_upload.link} style={{ background: "#eeeeee", borderRadius: 10, height: 75, maxWidth: 150, border: "3px solid #eeeeee" }} />
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


// eslint-disable-next-line no-unused-vars
const MobileRenderFilterItem = (props) => {
	const default_search_params = collection_helper.get_default_params(props.location.search);

	const [form] = antd.Form.useForm();

	const allbrands = (props.dealbrandinfos && props.dealbrandinfos.items || []).map(item => item.brand);
	const branditem = (props.websdkinfos && props.websdkinfos.items || []).filter(item => item.name === "disabled_brand");
	const blacklistedbrands = branditem.length > 0 ? branditem[0].value : [];
	const allowedbrands = collection_helper.get_lodash().difference(allbrands, blacklistedbrands);

	const allcategories = (props.dealcategoryinfos && props.dealcategoryinfos.items || []).map(item => item.category);
	const categoryitem = (props.websdkinfos && props.websdkinfos.items || []).filter(item => item.name === "disabled_category");
	const blacklistedcategories = categoryitem.length > 0 ? categoryitem[0].value : [];
	const allowedcategories = collection_helper.get_lodash().difference(allcategories, blacklistedcategories);

	const on_finish = (values) => {
		props.toggle_drawer();
		props.api_merchant_list_deals(values);
	};

	return (
		<div>
			<antd.Form form={form} onFinish={on_finish}>
				<b style={{ borderBottom: "1px solid #eeeeee" }}>Brands </b>
				<p style={{ fontSize: 9 }}>* By default all the brands are shown</p>
				<div style={{ margin: 5 }} />
				<antd.Form.Item initialValue={props.deal_filter.brand} name="brand" rules={[{ required: false, message: "Please enter a value" }]} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
					<antd.Select>
						{["All", ...allowedbrands].map(brand => <antd.Select.Option key={brand} value={brand}>{collection_helper.get_lodash().capitalize(brand)}</antd.Select.Option>)}
					</antd.Select>
				</antd.Form.Item>

				<b style={{ borderBottom: "1px solid #eeeeee" }}>Categories </b>
				<p style={{ fontSize: 9 }}>* By default all the categories are shown</p>
				<div style={{ margin: 5 }} />
				<antd.Form.Item initialValue={props.deal_filter.category} name="category" rules={[{ required: false, message: "Please enter a value" }]} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
					<antd.Select>
						{["All", ...allowedcategories].map(category => <antd.Select.Option key={category} value={category}>{collection_helper.get_lodash().capitalize(category)}</antd.Select.Option>)}
					</antd.Select>
				</antd.Form.Item>

				<antd.Form.Item>
					<antd.Button type="primary" htmlType="submit" size="middle" style={{ width: "100%" }}> Filter </antd.Button>
				</antd.Form.Item>

			</antd.Form>

		</div>
	);
};


export {
	MobileRenderListItem, MobileRenderViewItem, MobileRenderFilterItem
};