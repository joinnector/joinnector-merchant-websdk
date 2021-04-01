/* eslint-disable react/prop-types */
//from system
import React from "react";

import * as antd from "antd";

import collection_helper from "../../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item, props) => {
	const uploads = item.uploads || [];
	const wallets = props.lead.wallets || props.lead.devwallets || [];

	const picked_upload = uploads.length > 0 ? uploads[0] : { link: "https://res.cloudinary.com/esternetwork/image/upload/v1617280550/nector/images/logowhite.svg" };
	const picked_wallet = wallets.length > 0 ? wallets[0] : {
		available: "0",
		reserve: "0",
		currency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") },
		devcurrency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") }
	};

	return (
		<antd.List.Item>
			<antd.Card hoverable style={{ borderRadius: 5, width: "100%" }}>
				<div>
					<antd.List.Item.Meta
						avatar={<antd.Avatar src={picked_upload.link} />}
						title={<div>
							<antd.Typography.Paragraph style={{ fontSize: "1.5em", fontWeight: 600, marginBottom: 2, display: "block" }}>{collection_helper.get_limited_text(item.name, 40)}</antd.Typography.Paragraph>
							<antd.Typography.Text style={{ fontSize: "0.8em", display: "block" }}>Redeemed {item.hits} times</antd.Typography.Text>
						</div>}
						description={<div>
							<antd.Typography.Text style={{ fontSize: "0.8em", color: "#00000073", marginBottom: 2, display: "block", whiteSpace: "pre-wrap" }}>{collection_helper.get_limited_text(item.description, 70)}</antd.Typography.Text>
						</div>}
					/>
					<antd.Tag color="#f50" style={{ fontSize: "0.8em", position: "absolute", right: "0%", bottom: "0%" }}>{(Number(item.sell_price) / (picked_wallet.currency || picked_wallet.devcurrency).conversion_factor).toFixed((picked_wallet.currency || picked_wallet.devcurrency).place)} {collection_helper.get_lodash().upperFirst((picked_wallet.currency || picked_wallet.devcurrency).currency_code)}</antd.Tag>
				</div>
			</antd.Card>
		</antd.List.Item>
	);
};

export {
	MobileRenderListItem
};