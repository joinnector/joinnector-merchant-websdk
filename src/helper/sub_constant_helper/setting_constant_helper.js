/* eslint-disable no-unused-vars */
import React from "react";

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
	},

	trigger: {
		fetch: {
			endpoint: "/triggers",
			prefix: "/api/v2/merchant",
		},
	},

	order: {
		get: {
			endpoint: "/orders/{id}",
			prefix: "/api/v2/merchant"
		}
	}
};