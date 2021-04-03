/* eslint-disable indent */
import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";

const initial_state = {
	systeminfos: {},

	// click dispatch event
	deal: {},
	coupon: {},
	task: {},
	wallet: {},

	lead: {},
	deals: {},
	tasks: {},
	coupons: {},
	wallettransactions: {},
	taskactivities: {},
	notifications: {},
};

const app_reducer = (state = initial_state, action) => {
	switch (action.type) {
		case constant_helper.get_app_constant().INTERNAL_DISPATCH:
			return {
				...state,
				[action.attributes.key]: action.attributes.value
			};

		case constant_helper.get_app_constant().API_OPEN_GET_SYSTEMINFOS:
			return {
				...state,
				systeminfos: action.attributes
			};

		case constant_helper.get_app_constant().API_MERCHANT_GET_LEAD:
			return {
				...state,
				lead: action.attributes.item || {}
			};

		case constant_helper.get_app_constant().API_MERCHANT_VIEW_TASK_DISPATCH:
			return {
				...state,
				task: action.attributes.item || {}
			};

		case constant_helper.get_app_constant().API_MERCHANT_VIEW_DEAL_DISPATCH:
			return {
				...state,
				deal: action.attributes.item || {}
			};

		case constant_helper.get_app_constant().API_MERCHANT_VIEW_COUPON_DISPATCH:
			return {
				...state,
				coupon: action.attributes.item || {}
			};

		case constant_helper.get_app_constant().API_MERCHANT_VIEW_WALLET_DISPATCH:
			return {
				...state,
				wallet: action.attributes.item || {}
			};

		case constant_helper.get_app_constant().API_MERCHANT_LIST_DEAL_DISPATCH:
			if (action.append_data) {
				return {
					...state,
					deals: {
						count: action.attributes.count || 0,
						items: (state.deals.items || []).concat(action.attributes.items || []),
					}
				};
			}

			return {
				...state,
				deals: action.attributes,
			};

		case constant_helper.get_app_constant().API_MERCHANT_LIST_TASK_DISPATCH:
			if (action.append_data) {
				return {
					...state,
					tasks: {
						count: action.attributes.count || 0,
						items: (state.tasks.items || []).concat(action.attributes.items || []),
					}
				};
			}

			return {
				...state,
				tasks: action.attributes,
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

		case constant_helper.get_app_constant().API_MERCHANT_LIST_TASKACTIVITY_DISPATCH:
			if (action.append_data) {
				return {
					...state,
					taskactivities: {
						count: action.attributes.count || 0,
						items: (state.taskactivities.items || []).concat(action.attributes.items || []),
					}
				};
			}

			return {
				...state,
				taskactivities: action.attributes,
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

		case constant_helper.get_app_constant().API_SUCCESS_DISPATCH:
			return {
				...state,
			};

		case constant_helper.get_app_constant().API_IGNORE_DISPATCH:
			return {
				...state,
			};

		case constant_helper.get_app_constant().API_ERROR_DISPATCH:
			collection_helper.show_message(action.attributes.message || "Unable to process the request", "error");
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
