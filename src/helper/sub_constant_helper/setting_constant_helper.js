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
	redeem: "Your wallet has been {type}ed by {amount} {currency_code} ",
	reward: "Congratulations! We have {type}ed you {amount} {currency_code}",
	adjust: "Attention! Your wallet has been {type}ed by {amount} {currency_code}",
};

export const API_HEADER = {
	"accept": "application/json",
	"content-type": "application/json",
	"x-source": "web"
};

export const API_MAP = {
	system: {
		info: {
			endpoint: "/systeminfos",
			prefix: "/api/open",
		},
		dealcategoryinfo: {
			endpoint: "/deals",
			prefix: "/api/open",
		},
		dealbrandinfo: {
			endpoint: "/deals",
			prefix: "/api/open",
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
	currency: {
		get: {
			endpoint: "/currencies/{id}",
			prefix: "/api/v2/merchant",

		},
		fetch: {
			endpoint: "/currencies",
			prefix: "/api/v2/merchant",

		}
	},
	deal: {
		reward: {
			endpoint: "/dealrewards",
			prefix: "/api/v2/merchant",


		},
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
	offer: {
		redeem: {
			endpoint: "/offerredeems",
			prefix: "/api/v2/merchant",


		},
		get: {
			endpoint: "/offers/{id}",
			prefix: "/api/v2/merchant",

		},
		fetch: {
			endpoint: "/offers",
			prefix: "/api/v2/merchant",

		}
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
	review: {
		create: {
			endpoint: "/reviews",
			prefix: "/api/v2/merchant",


		},
		get: {
			endpoint: "/reviews/{id}",
			prefix: "/api/v2/merchant",

		},
		save: {
			endpoint: "/reviews/{id}",
			prefix: "/api/v2/merchant",


		},
		delete: {
			endpoint: "/reviews/{id}",
			prefix: "/api/v2/merchant",

		},
		fetch: {
			endpoint: "/reviews",
			prefix: "/api/v2/merchant",

		}
	},
	setting: {
		get: {
			endpoint: "/settings/{id}",
			prefix: "/api/v2/merchant",

		},
	},
	swap: {
		create: {
			endpoint: "/swaps",
			prefix: "/api/v2/merchant",


		},
		get: {
			endpoint: "/swaps/{id}",
			prefix: "/api/v2/merchant",

		},
		fetch: {
			endpoint: "/swaps",
			prefix: "/api/v2/merchant",

		}
	},
	task: {
		get: {
			endpoint: "/tasks/{id}",
			prefix: "/api/v2/merchant",

		},
		fetch: {
			endpoint: "/tasks",
			prefix: "/api/v2/merchant",

		}
	},
	taskactivity: {
		create: {
			endpoint: "/taskactivities",
			prefix: "/api/v2/merchant",


		},
		get: {
			endpoint: "/taskactivities/{id}",
			prefix: "/api/v2/merchant",

		},
		fetch: {
			endpoint: "/taskactivities",
			prefix: "/api/v2/merchant",

		}
	},
	surprise: {
		get: {
			endpoint: "/surprises/{id}",
			prefix: "/api/v2/merchant",

		},
		fetch: {
			endpoint: "/surprises",
			prefix: "/api/v2/merchant",

		}
	},
	surpriseactivity: {
		create: {
			endpoint: "/surpriseactivities",
			prefix: "/api/v2/merchant",


		},
		get: {
			endpoint: "/surpriseactivities/{id}",
			prefix: "/api/v2/merchant",

		},
		fetch: {
			endpoint: "/surpriseactivities",
			prefix: "/api/v2/merchant",

		}
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
		fetch: {
			endpoint: "/wallets",
			prefix: "/api/v2/merchant",

		}
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
	}
};