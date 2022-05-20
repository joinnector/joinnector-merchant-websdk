import axios from "axios";

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
	if(platform_url_instance.host && platform_url_instance.host.includes("stage")) collectfront_url = "https://stagecollectfront.nector.io";
	else collectfront_url = "https://collectfront.nector.io";

	collectfront_url = `${collectfront_url}/counters`;

	return collectfront_url;
};

const emit_event = async (event_name, identifier, meta) => {
	if(!event_name) return;
	
	const collectfront_url = get_collectfront_url();
	if(!collectfront_url) return;

	const finalurl = `${collectfront_url}/${identifier}`;

	try {
		await axios.post(finalurl, {
			op: event_name,
			meta: meta
		});
	} catch(error) {
		console.error(error);
	}
};

// structure of events: [{ identifier, op (event_name) }]
const emit_event_burst = async (events) => {
	if(!events || events.length < 1) return;

	const collectfront_url = get_collectfront_url();
	if(!collectfront_url) return;

	const finalurl = `${collectfront_url}/multi`;

	try {
		await axios.post(finalurl, {
			events
		});
	} catch(error) {
		console.error(error);
	}
};

const build_event_emitter = () => {
	let events = [];
	let timeout_id = null;

	return (event_name, identifier, meta = null) => {
		if(timeout_id) clearTimeout(timeout_id);
		events.push({ identifier, op: event_name, meta });

		timeout_id = setTimeout(() => {
			const events_copy = [...events];
			timeout_id = null;
			events = [];

			if(events_copy.length > 1) emit_event_burst(events_copy);
			else if(events_copy.length === 1) emit_event(events_copy[0].op, events_copy[0].identifier, events_copy[0].meta || null);
		}, 1000);
	};
};

export { page_view, track_event, analytics, build_event_emitter };