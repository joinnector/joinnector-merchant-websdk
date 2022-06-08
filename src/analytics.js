import axios_wrapper from "./wrapper/axios_wrapper";

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

const get_collectfront_url = () => {
	const default_search_params = collection_helper.get_default_params(window.location.search);
	const platform_url = default_search_params.url;

	const platform_url_instance = new URL(platform_url);
	let collectfront_url = null;

	if (platform_url_instance.host && platform_url_instance.host === "platform.nector.io") collectfront_url = "https://collectfront.nector.io";
	else if (platform_url_instance.host && platform_url_instance.host === "stageplatform.nector.io") collectfront_url = "https://stagecollectfront.nector.io";

	return collectfront_url;
};

const emit_events = async (events) => {
	if (!events) return;

	// if single event object, convert to array
	if (Array.isArray(events) === false) {
		if (!events.event || !events.entity_id || !events.id_type || !events.id) return;
		events = [events];
	}

	const collectfront_url = get_collectfront_url();
	if (!collectfront_url) return;

	const final_url = `${collectfront_url}/bulkcounters`;
	const payload = events;

	try {
		await axios_wrapper.get_wrapper().process_axios_post(final_url, {}, null, payload);
	} catch (error) {
		console.error(error);
	}
};

const build_event_emitter = () => {
	let events = [];
	let timeout_id = null;

	return (event, entity_id, id_type, id) => {
		if (!event || !entity_id || !id_type || !id) return;

		if (timeout_id) {
			clearTimeout(timeout_id);
			timeout_id = null;
		}
		events.push({ event, entity_id, id_type, id });

		const execute = () => {
			const events_copy = [...events];
			timeout_id = null;
			events = [];

			emit_events(events_copy);
		};

		if (events.length === 10) {
			execute();
		} else {
			timeout_id = setTimeout(() => {
				execute();
			}, 1000);
		}
	};
};

export { page_view, track_event, analytics, emit_events, build_event_emitter };