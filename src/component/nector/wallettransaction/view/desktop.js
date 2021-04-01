/* eslint-disable react/prop-types */
//from system
import React from "react";

import * as antd from "antd";

import collection_helper from "../../../../helper/collection_helper";
import constant_helper from "../../../../helper/constant_helper";

// eslint-disable-next-line no-unused-vars
const DesktopRenderListItem = (item, props) => {
	const wallets = props.lead.wallets || props.lead.devwallets || [];

	const _picked_wallet = wallets.filter(x => x._id == item.wallet_id);
	const picked_wallet = _picked_wallet.length > 0 ?_picked_wallet[0] : {
		currency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") },
		devcurrency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") }
	};

	return (
		<antd.List.Item>
			<antd.List.Item.Meta
				avatar={
					<antd.Badge count={constant_helper.get_setting_constant().WALLET_TRANSACTION_STATUS_MAP[item.status]}>
						<antd.Avatar icon={constant_helper.get_setting_constant().WALLET_TRANSACTION_AVATAR_MAP[item.type]} />
					</antd.Badge>
				}
				title={<div>
					<antd.Typography.Paragraph style={{ fontSize: 14, fontWeight: 600, marginBottom: 2, display: "block", color: collection_helper.get_color_from_wallettransaction_operation(item.operation) }}>{collection_helper.get_text_from_wallettransaction_operation(item.operation)}{Number(item.amount)} {collection_helper.get_lodash().upperFirst((picked_wallet.currency || picked_wallet.devcurrency).currency_code)}</antd.Typography.Paragraph>
					<antd.Typography.Text style={{ fontSize: 11, display: "block" }}>{collection_helper.get_moment()(item.created_at).format("MMMM Do YY, h:mm:ss a")}</antd.Typography.Text>
				</div>}
				description={<div>
					<antd.Typography.Text style={{ fontSize: 11, color: "#00000073", marginBottom: 2, display: "block" }}> {collection_helper.get_string_templater()(constant_helper.get_setting_constant().WALLET_TRANSACTION_TITLE_MAP[item.type], { type: item.type, amount: Number(item.amount), currency_code: (picked_wallet.currency || picked_wallet.devcurrency).currency_code, operation: collection_helper.get_text_from_wallettransaction_operation(item.operation) })}</antd.Typography.Text>
				</div>}
			/>
		</antd.List.Item>
	);
};

export {
	DesktopRenderListItem
};