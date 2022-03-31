import collection_helper from "./helper/collection_helper";
import constant_helper from "./helper/constant_helper";

import Analytics from "analytics";
import GoogleAnalytics from "@analytics/google-analytics";
import AmplitudeAnalytics from "@analytics/amplitude";

let identified = false;

const analytics = Analytics({
	app: "joinnector-merchant-websdk",
	debug: true,
	plugins: [
		GoogleAnalytics({
			trackingId: "G-FVYNSBMWXQ",
		}),
		AmplitudeAnalytics({
			apiKey: "fc698fe2ea59d992cd5b7c0d456b7c9e",
			options: {

			}
		}),
	]
});

const identify_user = () => {
	const lead_id = collection_helper.process_get_item(constant_helper.get_app_constant().NECTOR_LEAD_ID);
	const customer_id = collection_helper.process_get_item(constant_helper.get_app_constant().NECTOR_CUSTOMER_ID);

	// if no user skip it
	if (!lead_id || identified === true) return;

	const user_properties = {
		lead_id: lead_id,
		source: "joinnector-merchant-websdk",
	};

	if (customer_id) user_properties["customer_id"] = customer_id;

	analytics.identify(lead_id, user_properties);

	identified = true;
};

const page_view = (_window) => {
	const lead_id = collection_helper.process_get_item(constant_helper.get_app_constant().NECTOR_LEAD_ID);
	const customer_id = collection_helper.process_get_item(constant_helper.get_app_constant().NECTOR_CUSTOMER_ID);

	// if no user skip it
	if (!lead_id) return;

	identify_user();

	analytics.page({
		customer_id: customer_id || null,
		url: _window.location.pathname,
		search: _window.location.search
	});
};

const track_event = (event_name, event_properties = {}) => {
	const lead_id = collection_helper.process_get_item(constant_helper.get_app_constant().NECTOR_LEAD_ID);
	const customer_id = collection_helper.process_get_item(constant_helper.get_app_constant().NECTOR_CUSTOMER_ID);

	// if no user skip it
	if (!lead_id) return;

	identify_user();

	analytics.track(event_name, {
		customer_id: customer_id || null,
		...event_properties
	});
};

export { page_view, track_event, analytics };