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

const get_platform_url = () => {
	const default_search_params = collection_helper.get_default_params(window.location.search);
	const url = default_search_params.url;

	const url_instance = new URL(url);
	let final_url = null;

	if (!url_instance.host) return final_url;

	if (["platform.nector.io", "cachefront.nector.io", "collectfront.nector.io"].includes(url_instance.host)) final_url = "https://platform.nector.io";
	else if (["stageplatform.nector.io", "stagecachefront.nector.io", "stagecollectfront.nector.io"].includes(url_instance.host)) final_url = "https://stageplatform.nector.io";

	return final_url;
};

const get_cachefront_url = () => {
	const default_search_params = collection_helper.get_default_params(window.location.search);
	const url = default_search_params.url;

	const url_instance = new URL(url);
	let final_url = null;

	if (!url_instance.host) return final_url;

	if (["platform.nector.io", "cachefront.nector.io", "collectfront.nector.io"].includes(url_instance.host)) final_url = "https://cachefront.nector.io";
	else if (["stageplatform.nector.io", "stagecachefront.nector.io", "stagecollectfront.nector.io"].includes(url_instance.host)) final_url = "https://stagecachefront.nector.io";

	return final_url;
};

const get_collectfront_url = () => {
	const default_search_params = collection_helper.get_default_params(window.location.search);
	const url = default_search_params.url;

	const url_instance = new URL(url);
	let final_url = null;

	if (!url_instance.host) return final_url;

	if (["platform.nector.io", "cachefront.nector.io", "collectfront.nector.io"].includes(url_instance.host)) final_url = "https://collectfront.nector.io";
	else if (["stageplatform.nector.io", "stagecachefront.nector.io", "stagecollectfront.nector.io"].includes(url_instance.host)) final_url = "https://stagecollectfront.nector.io";

	return final_url;
};

const send_events = async (events) => {
	if (!events) return;

	// if single event object, convert to array
	if (Array.isArray(events) === false) {
		if (!events.event || !events.entity_id || !events.id_type || !events.id || !events.incr_by) return;
		events = [events];
	}

	const collectfront_url = get_collectfront_url();
	if (!collectfront_url) return;

	const final_url = `${collectfront_url}/bulkcounters`;
	const payload = events;

	try {
		await axios_wrapper.get_wrapper().process_axios_post(final_url, { has_authorization: false }, null, payload);
	} catch (error) {
		console.error(error);
	}
};

// TODO use the methods
const discover_and_emit_events = () => {
	if (collection_helper.is_session_storage_supported() === false) return;

	const is_locked = window.sessionStorage.getItem(constant_helper.get_app_constant().NECTOR_EVENT_LOCK);
	if (collection_helper.validate_not_null_or_undefined(is_locked)) {
		if (collection_helper.process_new_moment().unix() - Number(is_locked) > 4000) {
			// if lock is more than 3s, then probably its a stale lock. so we ignore it
			window.sessionStorage.removeItem(constant_helper.get_app_constant().NECTOR_EVENT_LOCK);
		} else {
			return;
		}
	}

	// take lock
	window.sessionStorage.setItem(constant_helper.get_app_constant().NECTOR_EVENT_LOCK, collection_helper.process_new_moment().unix());

	const all_keys = Object.keys(window.sessionStorage).filter(key => key.startsWith(constant_helper.get_app_constant().NECTOR_EVENT_PREFIX));

	const events = [];
	for (const key of all_keys) {
		const existing_value = window.sessionStorage.getItem(key);
		window.sessionStorage.removeItem(key);

		if (!existing_value || isNaN(Number(existing_value)) === true) continue;

		const parts = key.split("::");
		if (parts.length < 5) continue;

		events.push({
			event: parts[1],
			entity_id: parts[2],
			id_type: parts[3],
			id: parts[4],
			incr_by: Number(existing_value)
		});
	}

	// release lock
	window.sessionStorage.removeItem(constant_helper.get_app_constant().NECTOR_EVENT_LOCK);

	// now we have all the events & we can push it to collectfront in batches of 10 items
	while (events.length > 0) {
		const events_to_send = events.splice(0, 50);
		send_events(events_to_send);
	}
};

const capture_event = (event, entity_id, id_type, id) => {
	if (!event || !entity_id || !id_type || !id || collection_helper.is_session_storage_supported() === false) return;

	try {
		const key = collection_helper.process_key_join([constant_helper.get_app_constant().NECTOR_EVENT_PREFIX, event, entity_id, id_type, id], "::");
		const existing_value = window.sessionStorage.getItem(key);
		const new_value = (Number(existing_value || 0) || 0) + 1;
		window.sessionStorage.setItem(key, new_value);
	} catch (error) {
		//
	}
};

export {
	page_view, track_event, analytics, discover_and_emit_events, capture_event, send_events, get_platform_url, get_collectfront_url, get_cachefront_url,
};