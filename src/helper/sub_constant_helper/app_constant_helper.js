export const NECTOR_LEAD_ID = "_n_lead_id";
export const NECTOR_CUSTOMER_ID = "_n_customer_id";

/* SESSION STORAGE */
export const NECTOR_EVENT_PREFIX = "_n_event";
export const NECTOR_EVENT_LOCK = "_n_lock_event";

export const EVENT_TYPE = {
	// before api call
	ws_coupon_open_request: "ws_coupon_open_request",
	ws_coupon_copy_request: "ws_coupon_copy_request",

	ws_offer_open_request: "ws_offer_open_request",
	ws_offer_redeem_request: "ws_offer_redeem_request",

	ws_offer_view_request: "ws_offer_view_request",
	ws_coupon_view_request: "ws_coupon_view_request",
	ws_wallet_view_request: "ws_wallet_view_request",
	ws_instruction_view_request: "ws_instruction_view_request",

	ws_lead_update_request: "ws_lead_update_request",
	ws_lead_referral_request: "ws_lead_referral_request",
	ws_lead_copy_request: "ws_lead_copy_request",

	ws_review_create_request: "ws_review_create_request",

	ws_instruction_follow_request: "ws_instruction_follow_request",
};

export const COLLECTFRONT_EVENTS = {
	OFFER_VIEW: "offer_view",
	OFFER_CLICK: "offer_click",

	PRODUCT_VIEW: "product_view",
	PRODUCT_CLICK: "product_click",

	SIGNUP_CLICK: "signup_click",
	SIGNIN_CLICK: "signin_click",
	SOCIAL_CLICK: "social_click",
	REFERRAL_SHARE: "referral_share",
	REFERRAL_EXECUTE: "referral_execute",
};

export const WINDOW_MESSAGE_EVENTS = {
	REFRESH_WALLET: "refresh_wallet",
	PARENT_URL: "parent_url"
};

export const API_BASE_HEADER = {
	"accept": "application/json",
	"content-type": "application/json",
};

export const DEFAULT_WEBSDK_CONFIG = {
	business_color: "#000",
	text_color: "white"
};

// dispatchers

export const INTERNAL_DISPATCH = "INTERNAL_DISPATCH";

export const API_MERCHANT_GET_AGGREEGATEDDETAILS = "API_MERCHANT_GET_AGGREEGATEDDETAILS";
export const API_MERCHANT_GET_ENTITY = "API_MERCHANT_GET_ENTITY";
export const API_MERCHANT_GET_LEAD = "API_MERCHANT_GET_LEAD";

export const API_MERCHANT_LIST_OFFER_DISPATCH = "API_MERCHANT_LIST_OFFER_DISPATCH";
export const API_MERCHANT_VIEW_OFFER_DISPATCH = "API_MERCHANT_VIEW_OFFER_DISPATCH";
export const API_MERCHANT_LIST_ACTIVITY_DISPATCH = "API_MERCHANT_LIST_ACTIVITY_DISPATCH";

export const API_MERCHANT_LIST_COUPON_DISPATCH = "API_MERCHANT_LIST_COUPON_DISPATCH";
export const API_MERCHANT_UPDATE_COUPON_DISPATCH = "API_MERCHANT_UPDATE_COUPON_DISPATCH";
export const API_MERCHANT_UPDATE_METADETAIL_DISPATCH = "API_MERCHANT_UPDATE_METADETAIL_DISPATCH";
export const API_MERCHANT_UPDATE_LEAD_DISPATCH = "API_MERCHANT_UPDATE_LEAD_DISPATCH";
export const API_MERCHANT_VIEW_COUPON_DISPATCH = "API_MERCHANT_VIEW_COUPON_DISPATCH";
export const API_MERCHANT_VIEW_WALLET_DISPATCH = "API_MERCHANT_VIEW_WALLET_DISPATCH";
export const API_MERCHANT_LIST_WALLETTRANSACTION_DISPATCH = "API_MERCHANT_LIST_WALLETTRANSACTION_DISPATCH";
export const API_MERCHANT_LIST_REVIEW_DISPATCH = "API_MERCHANT_LIST_REVIEW_DISPATCH";
export const API_MERCHANT_VIEW_REVIEW_DISPATCH = "API_MERCHANT_VIEW_REVIEW_DISPATCH";
export const API_MERCHANT_LIST_TRIGGERS_DISPATCH = "API_MERCHANT_LIST_TRIGGERS_DISPATCH";


export const API_MERCHANT_LIST_NOTIFICATION_DISPATCH = "API_MERCHANT_LIST_NOTIFICATION_DISPATCH";

export const API_MERCHANT_LIST_REFERRALTRIGGER_DISPATCH = "API_MERCHANT_LIST_REFERRALTRIGGER_DISPATCH";

export const API_SUCCESS_DISPATCH = "API_SUCCESS_DISPATCH";
export const API_IGNORE_DISPATCH = "API_IGNORE_DISPATCH";
export const API_ERROR_DISPATCH = "API_ERROR_DISPATCH";



