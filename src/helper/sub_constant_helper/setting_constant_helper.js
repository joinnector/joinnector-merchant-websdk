import React from "react";

import * as antd_icons from "@ant-design/icons";

export const NOTIFICATION_AVATAR_MAP = {
	deal_reward: <antd_icons.TagFilled style={{ fontSize: 20, color: "orange" }} twoToneColor="green" />,
	task_activity_progress: <antd_icons.FundFilled style={{ fontSize: 20, color: "blue" }} twoToneColor="blue" />,
	task_activity_completed: <antd_icons.TrophyFilled style={{ fontSize: 20, color: "orange" }} twoToneColor="green"/>,
	wallet_redeem: <antd_icons.UpCircleFilled style={{ fontSize: 20, color: "red" }} twoToneColor="red" />,
	wallet_reward: <antd_icons.DownCircleFilled style={{ fontSize: 20, color: "green" }} twoToneColor="green" />,
	wallet_swap: <antd_icons.InteractionFilled style={{ fontSize: 20, color: "blue" }} twoToneColor="blue" />,
	wallet_adjust: <antd_icons.DollarCircleFilled style={{ fontSize: 20, color: "blue" }} twoToneColor="blue"/>
};


export const WALLET_TRANSACTION_AVATAR_MAP = {
	redeem: <antd_icons.WalletFilled style={{ fontSize: 20, color: "black" }} twoToneColor="red" />,
	reward: <antd_icons.WalletFilled style={{ fontSize: 20, color: "black" }} twoToneColor="green" />,
	swap: <antd_icons.InteractionFilled style={{ fontSize: 20, color: "black" }} twoToneColor="blue" />,
	adjust: <antd_icons.BankFilled style={{ fontSize: 20, color: "black" }} twoToneColor="blue"/>
};

export const WALLET_TRANSACTION_STATUS_MAP = {
	pending: <antd_icons.ClockCircleFilled style={{ fontSize: 15, color: "blue" }} twoToneColor="red" />,
	success: <antd_icons.CheckCircleFilled style={{ fontSize: 15, color: "green" }} twoToneColor="green" />,
	failed: <antd_icons.CloseCircleFilled style={{ fontSize: 15, color: "red" }} twoToneColor="blue" />,
};

export const WALLET_TRANSACTION_TITLE_MAP = {
	redeem: "You have {type}ed {amount} {currency_code} wallet point",
	reward: "We have {type}ed your wallet with {amount} {currency_code} wallet points",
	swap: "Your {type} of {amount} {currency_code} completed successfully",
	adjust: "We have {type}ed your wallet with {amount} {currency_code} wallet points",
};

