/* eslint-disable no-unused-vars */
import React from "react";

import * as antd_icons from "@ant-design/icons";
// import * as react_material_icons from "react-icons/md";
// import * as react_font_awesome from "react-icons/fa";
import * as react_feature_icons from "react-icons/fi";

export const WALLET_TRANSACTION_STATUS_MAP = {
	pending: <react_feature_icons.FiAlertCircle className="nector-icon" style={{ fontSize: "0.9em", color: "blue" }} />,
	success: <react_feature_icons.FiCheckCircle className="nector-icon" style={{ fontSize: "0.9em", color: "green" }} />,
	failed: <react_feature_icons.FiXCircle className="nector-icon" style={{ fontSize: "0.9em", color: "red" }}/>,
};

export const WALLET_TRANSACTION_TITLE_MAP = {
	redeem: "You have {type}ed {amount} {currency_code} wallet point",
	reward: "We have {type}ed your wallet with {amount} {currency_code} wallet points",
	swap: "Your {type} of {amount} {currency_code} completed successfully",
	adjust: "We have {type}ed your wallet with {amount} {currency_code} wallet points",
};