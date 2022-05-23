/* eslint-disable no-unused-vars */
import React from "react";

import * as antd_icons from "@ant-design/icons";
// import * as react_material_icons from "react-icons/md";
// import * as react_font_awesome from "react-icons/fa";
import * as react_feature_icons from "react-icons/fi";

export const WALLET_TRANSACTION_STATUS_MAP = {
	pending: <react_feature_icons.FiAlertCircle className="nector-icon" style={{ fontSize: "0.9em", color: "black" }} />,
	success: <react_feature_icons.FiCheckCircle className="nector-icon" style={{ fontSize: "0.9em", color: "black" }} />,
	failed: <react_feature_icons.FiXCircle className="nector-icon" style={{ fontSize: "0.9em", color: "black" }} />,
};

export const WALLET_TRANSACTION_TITLE_MAP = {
	redeem: "Your wallet has been {type}ed by {amount} coins",
	reward: "Congratulations! We have {type}ed you {amount} coins",
	adjust: "Attention! Your wallet has been {type}ed by {amount} coins",
};

export const EMOJIMAP = {
	MONTH: {
		1: "❄️️",
		2: "🥶",
		3: "🌷",
		4: "🌺",
		5: "🐝",
		6: "🌈",
		7: "🌞",
		8: "🍎",
		9: "🌦",
		10: "🍁",
		11: "🍂",
		12: "🎄"
	}
};

export const API_HEADER = {
	"accept": "application/json",
	"content-type": "application/json",
	"x-source": "web"
};

export const API_MAP = {
	system: {
		aggreegateddetails: {
			endpoint: "/aggreegateddetails",
			prefix: "/api/v2/merchant",
		},
	},
	entity: {
		get: {
			endpoint: "/entities/{id}",
			prefix: "/api/v2/merchant",
		},
	},
	coupon: {
		create: {
			endpoint: "/coupons",
			prefix: "/api/v2/merchant",


		},
		save: {
			endpoint: "/coupons/{id}",
			prefix: "/api/v2/merchant",


		},
		get: {
			endpoint: "/coupons/{id}",
			prefix: "/api/v2/merchant",

		},
		fetch: {
			endpoint: "/coupons",
			prefix: "/api/v2/merchant",

		}
	},
	deal: {
		redeem: {
			endpoint: "/dealredeems",
			prefix: "/api/v2/merchant",


		},
		get: {
			endpoint: "/deals/{id}",
			prefix: "/api/v2/merchant",

		},
		fetch: {
			endpoint: "/deals",
			prefix: "/api/v2/merchant",

		}
	},
	discount: {
		redeem: {
			endpoint: "/discountredeems",
			prefix: "/api/v2/merchant",


		},
		get: {
			endpoint: "/discounts/{id}",
			prefix: "/api/v2/merchant",

		},
		fetch: {
			endpoint: "/discounts",
			prefix: "/api/v2/merchant",

		}
	},
	actionactivity: {
		create: {
			endpoint: "/actionactivities",
			prefix: "/api/v2/merchant",


		},
	},
	triggeractivity: {
		create: {
			endpoint: "/triggeractivities",
			prefix: "/api/v2/merchant",


		},
	},
	store: {
		get: {
			endpoint: "/stores/{id}",
			prefix: "/api/v2/merchant",

		},
		fetch: {
			endpoint: "/stores",
			prefix: "/api/v2/merchant",

		}
	},
	instruction: {
		get: {
			endpoint: "/instructions/{id}",
			prefix: "/api/v2/merchant",

		},
		fetch: {
			endpoint: "/instructions",
			prefix: "/api/v2/merchant",

		}
	},
	lead: {
		create: {
			endpoint: "/leads",
			prefix: "/api/v2/merchant",


		},
		get: {
			endpoint: "/leads/{id}",
			prefix: "/api/v2/merchant",

		},
		save: {
			endpoint: "/leads/{id}",
			prefix: "/api/v2/merchant",


		}
	},
	leadreferredbyreferralcode: {
		save: {
			endpoint: "/leads-referred-by-referral-code/{id}",
			prefix: "/api/v2/merchant",
		}
	},
	metadetail: {
		get: {
			endpoint: "/metadetails/{id}",
			prefix: "/api/v2/merchant",

		},
		save: {
			endpoint: "/metadetails/{id}",
			prefix: "/api/v2/merchant",


		}
	},
	notification: {
		get: {
			endpoint: "/notifications/{id}",
			prefix: "/api/v2/merchant",

		},
		fetch: {
			endpoint: "/notifications",
			prefix: "/api/v2/merchant",

		}
	},
	setting: {
		get: {
			endpoint: "/settings/{id}",
			prefix: "/api/v2/merchant",

		},
	},
	wallet: {
		create: {
			endpoint: "/wallets",
			prefix: "/api/v2/merchant",


		},
		get: {
			endpoint: "/wallets/{id}",
			prefix: "/api/v2/merchant",

		},
	},
	wallettransaction: {
		create: {
			endpoint: "/wallettransactions",
			prefix: "/api/v2/merchant",


		},
		get: {
			endpoint: "/wallettransactions/{id}",
			prefix: "/api/v2/merchant",

		},
		fetch: {
			endpoint: "/wallettransactions",
			prefix: "/api/v2/merchant",

		}
	},
	review: {
		create: {
			endpoint: "/reviews",
			prefix: "/api/v2/merchant",
		},

		delete: {
			endpoint: "/reviews/{id}",
			prefix: "/api/v2/merchant",
		},

		fetch: {
			endpoint: "/reviews",
			prefix: "/api/v2/merchant",
		},

		get: {
			endpoint: "/reviews/{id}",
			prefix: "/api/v2/merchant",
		}
	},

	upload: {
		create: {
			endpoint: "/uploads",
			prefix: "/api/v2/merchant",
		},
	}
};