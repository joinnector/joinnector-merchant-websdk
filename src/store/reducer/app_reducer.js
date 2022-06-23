/* eslint-disable indent */
import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";

const initial_state = {
	systeminfos: {},
	offerbrandinfos: {},
	offercategoryinfos: {},
	websdkinfos: {},
	businessinfos: {},
	actioninfos: {},

	// click dispatch event
	offer: {},
	coupon: {},
	wallet: {},

	entity: {},
	lead: { pending: true },
	offers: {},
	coupons: {},
	referral_triggers: {},
	triggers: {},
	wallettransactions: {},
	activities: {},
	notifications: {},
	reviews: {},

	order: {},
};

const app_reducer = (state = initial_state, action) => {
	switch (action.type) {
		case constant_helper.get_app_constant().INTERNAL_DISPATCH:
			return {
				...state,
				[action.attributes.key]: action.attributes.value
			};

		case constant_helper.get_app_constant().API_MERCHANT_GET_AGGREEGATEDDETAILS:
			return {
				...state,
				systeminfos: action.attributes.systeminfos,
				offerbrandinfos: action.attributes.offerbrandinfos,
				offercategoryinfos: action.attributes.offercategoryinfos,
				websdkinfos: action.attributes.websdkinfos,
				businessinfos: action.attributes.businessinfos,
				actioninfos: action.attributes.actioninfos,
			};

		case constant_helper.get_app_constant().API_MERCHANT_GET_ENTITY:
			return {
				...state,
				entity: action.attributes.item || {}
			};

		case constant_helper.get_app_constant().API_MERCHANT_GET_LEAD:
			if (action.attributes.item && action.attributes.item._id) collection_helper.process_add_item(constant_helper.get_app_constant().NECTOR_LEAD_ID, action.attributes.item._id);
			if (action.attributes.item && action.attributes.item.customer_id) collection_helper.process_add_item(constant_helper.get_app_constant().NECTOR_CUSTOMER_ID, action.attributes.item.customer_id);

			return {
				...state,
				lead: action.attributes.item || {}
			};

		case constant_helper.get_app_constant().API_MERCHANT_GET_OFFER_DISPATCH:
			return {
				...state,
				offer: action.attributes.item || {}
			};

		case constant_helper.get_app_constant().API_MERCHANT_GET_COUPON_DISPATCH:
			return {
				...state,
				coupon: action.attributes.item || {}
			};

		case constant_helper.get_app_constant().API_MERCHANT_GET_WALLET_DISPATCH:
			return {
				...state,
				wallet: action.attributes.item || {}
			};

		case constant_helper.get_app_constant().API_MERCHANT_GET_ORDER_DISPATCH:
			return {
				...state,
				order: action.attributes.item || {}
			};

		case constant_helper.get_app_constant().API_MERCHANT_LIST_OFFER_DISPATCH:
			if (action.append_data) {
				return {
					...state,
					offers: {
						count: action.attributes.count || 0,
						items: (state.offers.items || []).concat(action.attributes.items || []),
					}
				};
			}

			return {
				...state,
				offers: action.attributes,
			};

		case constant_helper.get_app_constant().API_MERCHANT_LIST_COUPON_DISPATCH:
			if (action.append_data) {
				return {
					...state,
					coupons: {
						count: action.attributes.count || 0,
						items: (state.coupons.items || []).concat(action.attributes.items || []),
					}
				};
			}

			return {
				...state,
				coupons: action.attributes,
			};

		case constant_helper.get_app_constant().API_MERCHANT_LIST_REFERRALTRIGGER_DISPATCH:
			if (action.append_data) {
				return {
					...state,
					referral_triggers: {
						count: action.attributes.count || 0,
						items: (state.triggers.items || []).concat(action.attributes.items || []),
					}
				};
			}

			return {
				...state,
				referral_triggers: action.attributes,
			};

		case constant_helper.get_app_constant().API_MERCHANT_LIST_TRIGGERS_DISPATCH:
			if (action.append_data) {
				return {
					...state,
					triggers: {
						count: action.attributes.count || 0,
						items: (state.triggers.items || []).concat(action.attributes.items || []),
					}
				};
			}

			return {
				...state,
				triggers: action.attributes,
			};

		case constant_helper.get_app_constant().API_MERCHANT_LIST_WALLETTRANSACTION_DISPATCH:
			if (action.append_data) {
				return {
					...state,
					wallettransactions: {
						count: action.attributes.count || 0,
						items: (state.wallettransactions.items || []).concat(action.attributes.items || []),
					}
				};
			}

			return {
				...state,
				wallettransactions: action.attributes,
			};

		case constant_helper.get_app_constant().API_MERCHANT_LIST_ACTIVITY_DISPATCH:
			if (action.append_data) {
				return {
					...state,
					activities: {
						count: action.attributes.count || 0,
						items: (state.activities.items || []).concat(action.attributes.items || []),
					}
				};
			}

			return {
				...state,
				activities: action.attributes,
			};

		case constant_helper.get_app_constant().API_MERCHANT_LIST_NOTIFICATION_DISPATCH:
			if (action.append_data) {
				return {
					...state,
					notifications: {
						count: action.attributes.count || 0,
						items: (state.notifications.items || []).concat(action.attributes.items || []),
					}
				};
			}

			return {
				...state,
				notifications: action.attributes,
			};

		case constant_helper.get_app_constant().API_MERCHANT_LIST_REVIEW_DISPATCH:
			if (action.append_data) {
				return {
					...state,
					reviews: {
						count: action.attributes.count || 0,
						items: (state.reviews.items || []).concat(action.attributes.items || []),
					}
				};
			}

			return {
				...state,
				reviews: action.attributes,
			};

		case constant_helper.get_app_constant().API_SUCCESS_DISPATCH:
			return {
				...state,
			};

		case constant_helper.get_app_constant().API_IGNORE_DISPATCH:
			return {
				...state,
			};

		case constant_helper.get_app_constant().API_ERROR_DISPATCH:
			if (action.attributes?.message?.includes("Lead does not exists") === false) collection_helper.show_message(action.attributes.message || "Unable to process the request", "error");
			return {
				...state,
			};

		// fallback and return the state
		default:
			return {
				...state
			};
	}
};

export default app_reducer;
