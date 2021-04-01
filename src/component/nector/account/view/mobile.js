/* eslint-disable react/prop-types */
//from system
import React from "react";

import * as antd from "antd";

import collection_helper from "../../../../helper/collection_helper";

// eslint-disable-next-line no-unused-vars
const MobileRenderListItem = (item) => {
	const deal = item.deal || item.devdeal || {};

	const is_available = collection_helper.convert_to_moment_utc_from_datetime(deal.expire || collection_helper.process_new_moment().add(1, "hour").toISOString()).isAfter(collection_helper.process_new_moment());
	const expires_in = collection_helper.convert_to_moment_utc_from_datetime(deal.expire || collection_helper.process_new_moment()).diff(collection_helper.process_new_moment(), "days");

	const ribbon_style = expires_in > 0 ? (expires_in > 3 ? { background: "green" } : { background: "orange" }) : { background: "red" };
	const expire_text = (is_available && deal.expire) ? `expires in ${expires_in} days` : ((is_available && !deal.expire) ? "available" : "expired");

	const uploads = deal.uploads || [];
	const picked_upload = uploads.length > 0 ? uploads[0] : { link: "https://res.cloudinary.com/esternetwork/image/upload/v1617280550/nector/images/logowhite.svg" };

	return (
		<antd.List.Item>
			<antd.Badge.Ribbon style={{...ribbon_style, fontSize: "0.8em" }} text={expire_text}>
				<antd.Card hoverable style={{ height: 220, borderRadius: 5, width: "100%" }}>
					<div style={{ marginTop: 15 }}>
						<antd.Typography.Text style={{ fontSize: "1.5em" }}>{collection_helper.get_limited_text(deal.name, 30)}</antd.Typography.Text>
						<div style={{ position: "absolute", bottom: 0, paddingBottom: "5%" }}>
							<antd.Tooltip title={deal.provider || ""}>
								<antd.Avatar src={picked_upload.link} style={{ background: "#00000030" }}></antd.Avatar>
							</antd.Tooltip>
						</div>
					</div>
				</antd.Card>
			</antd.Badge.Ribbon>
		</antd.List.Item>
	);
};

export {
	MobileRenderListItem
};