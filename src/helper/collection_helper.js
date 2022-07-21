import lodash from "lodash";
import moment from "moment";

import * as antd from "antd";
import * as uuidv4 from "uuid";

import constant_helper from "./constant_helper";

class CollectionHelper {
	// validators
	static validate_is_null_or_undefined(value) {
		return (lodash.isNull(value) === true || lodash.isUndefined(value) === true);
	}

	static validate_not_null_or_undefined(value) {
		return !CollectionHelper.validate_is_null_or_undefined(value);
	}

	static validate_is_number(value) {
		if (CollectionHelper.validate_is_null_or_undefined(value) === true) return false;

		return lodash.isNumber(value) === true;
	}

	static validate_not_number(value) {
		return !CollectionHelper.validate_is_number(value);
	}

	static validate_is_boolean(value) {
		if (CollectionHelper.validate_is_null_or_undefined(value) === true) return false;

		return lodash.isBoolean(value) === true;
	}

	static validate_not_boolean(value) {
		return !CollectionHelper.validate_is_boolean(value);
	}

	static validate_is_string(value) {
		if (CollectionHelper.validate_is_null_or_undefined(value) === true) return false;

		return lodash.isString(value) === true;
	}

	static validate_not_string(value) {
		return !CollectionHelper.validate_is_string(value);
	}

	static validate_is_array(value) {
		if (CollectionHelper.validate_is_null_or_undefined(value) === true) return false;

		return lodash.isArray(value) === true;
	}

	static validate_not_array(value) {
		return !CollectionHelper.validate_is_array(value);
	}

	static validate_is_object(value) {
		if (CollectionHelper.validate_is_null_or_undefined(value) === true) return false;

		return (lodash.isObject(value) === true && lodash.isArray(value) === false);
	}

	static validate_not_object(value) {
		return !CollectionHelper.validate_is_object(value);
	}

	static validate_is_function(value) {
		if (CollectionHelper.validate_is_null_or_undefined(value) === true) return false;

		return lodash.isFunction(value);
	}

	static validate_not_function(value) {
		return !CollectionHelper.validate_is_function(value);
	}

	static show_message(title, type = "success", duration = 2) {
		antd.message[type](title, duration);
	}

	static show_notification(title, type = "success", message = "", duration = 2) {
		antd.notification[type]({ message: title, description: message, duration: duration });
	}

	static process_slugify(value) {
		const a = "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
		const b = "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
		const p = new RegExp(a.split("").join("|"), "g");

		return value
			.toString()
			.toLowerCase()
			.replace(/\s+/g, "-") // Replace spaces with -
			.replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
			.replace(/&/g, "-and-") // Replace & with 'and'
			// eslint-disable-next-line no-useless-escape
			.replace(/[^\w\-]+/g, "") // Remove all non-word characters
			// eslint-disable-next-line no-useless-escape
			.replace(/\-\-+/g, "-") // Replace multiple - with single -
			.replace(/^-+/, "") // Trim - from start of text
			.replace(/-+$/, ""); // Trim - from end of text
	}

	// used to parse thye .env file value to required format
	static process_env_value(value) {
		if (value.startsWith("num_") === true) {
			return Number(value.replace("num_", "").trim());
		} else if (value.startsWith("bool_") === true) {
			return value.includes("true");
		} else if (value.startsWith("str_") === true) {
			return String(value.replace("str_", "").trim());
		} else {
			return value;
		}
	}

	// TODO required as values can be anything
	// basically json.dumps or json.strigify
	// serialization (convert object -> string)
	static process_serialize_data(data) {
		// custom
		if (CollectionHelper.validate_is_string(data) === true) return data;

		// TODO required as values can be anything
		// protecting from circular deps
		let cache = [];
		const strigified = JSON.stringify(data, (key, value) => {
			if (typeof value === "object" && value !== null && cache.indexOf(value) !== -1) return;
			else if (typeof value === "object" && value !== null) cache.push(value);
			return value;
		});

		// garbage collector
		cache = null;
		return strigified;
	}

	// TODO required as values can be anything
	// basically json.loads or json.parse
	// deserialization (convert string -> object)
	static process_deserialize_data(data) {
		// custom
		if (CollectionHelper.validate_is_array(data) === true) return data;
		if (CollectionHelper.validate_is_object(data) === true) return data;

		return JSON.parse(data);
	}

	static process_key_join(value, separator = "_") {
		return value.join(separator);
	}

	// converts empty string to null
	static process_normalize_value(value) {
		return value === "" ? null : value;
	}

	static process_nullify(values, strict = false) {
		for (const key of Object.keys(values)) {
			if (values[key] === "" && strict === false) values[key] = null;
			else if (values[key] || values[key] === true || values[key] === false || CollectionHelper.get_lodash().isNumber(values[key])) {
				// do nothing
			} else {
				delete values[key];
			}
		}
		return values;
	}

	static process_add_item(key, value) {
		if (CollectionHelper.is_session_storage_supported() === false) return null;

		if (CollectionHelper.validate_is_null_or_undefined(key) === true) return null;
		if (CollectionHelper.validate_is_null_or_undefined(value) === true) return null;

		// eslint-disable-next-line no-undef
		window.sessionStorage.setItem(key, value);
	}

	static process_get_item(key) {
		if (CollectionHelper.is_session_storage_supported() === false) return null;

		if (CollectionHelper.validate_is_null_or_undefined(key) === true) return null;

		// eslint-disable-next-line no-undef
		return window.sessionStorage.getItem(key);
	}

	static process_add_localitem(key, value) {
		if (CollectionHelper.is_local_storage_supported() === false) return null;

		if (CollectionHelper.validate_is_null_or_undefined(key) === true) return null;
		if (CollectionHelper.validate_is_null_or_undefined(value) === true) return null;

		// eslint-disable-next-line no-undef
		window.localStorage.setItem(key, value);
	}

	static process_get_localitem(key) {
		if (CollectionHelper.is_local_storage_supported() === false) return null;

		if (CollectionHelper.validate_is_null_or_undefined(key) === true) return null;

		// eslint-disable-next-line no-undef
		return window.localStorage.getItem(key);
	}

	// convertors
	static convert_to_isodatetime_utc_from_datetime(datetime) {
		if (CollectionHelper.validate_is_null_or_undefined(datetime) === true) return null;

		// custom
		if (moment(datetime).isValid() === false) return null;

		// get the offset
		if (moment(datetime).utcOffset() === 0) return moment.utc(datetime).toISOString();  // already in UTC, dont convert
		else return moment(datetime).utc().toISOString(); // not in UTC, convert
	}

	static convert_to_moment_utc_from_datetime(datetime) {
		if (CollectionHelper.validate_is_null_or_undefined(datetime) === true) return null;

		// custom
		if (moment(datetime).isValid() === false) return null;

		// safe convert to utc if not in utc
		const isodatetime_utc = CollectionHelper.convert_to_isodatetime_utc_from_datetime(datetime);
		return moment.utc(isodatetime_utc);
	}

	static convert_to_string_first_capital_from_any_string(value) {
		if (CollectionHelper.validate_is_null_or_undefined(value) === true) return null;

		return `${value[0].toUpperCase()}${value.substr(1)}`;
	}

	static get_first_letter_from_string(value) {
		if (CollectionHelper.validate_not_string(value) === true || value.length === 0) return null;

		return `${value[0].toUpperCase()}`;
	}

	static process_new_moment() {
		return moment.utc();
	}

	static process_new_uuid() {
		return uuidv4.v4();
	}

	static process_url_params(values) {
		let parts = values.trim().split("?");
		if (parts.length > 1) return new URLSearchParams(parts[1]);
		return new URLSearchParams("");
	}

	static process_objectify_params(values) {
		const params = [...CollectionHelper.process_url_params(values)];

		if (params.length > 0) {
			const sanitized_result = {};
			for (let i = 0; i < params.length; i++) {
				sanitized_result[params[i][0]] = params[i][1];
			}

			return sanitized_result;
		}

		return {};
	}

	static get_default_params(values) {
		const search_params = CollectionHelper.process_url_params(values);
		const params = {
			url: search_params.get("murl") || search_params.get("merchant_url") || "https://platform.nector.io",
			api_key: search_params.get("mkey") || search_params.get("merchant_api_key") || null,
			api_key_algo: search_params.get("mkeyalgo") || search_params.get("merchant_api_key_algo") || null,
			identifier: search_params.get("mi") || search_params.get("merchant_identifier") || null,

			placeholder_image: search_params.get("mpi") || search_params.get("merchant_placeholder_image") || "https://cdn.nector.io/nector-static/image/nectorplaceholder.png",
		};

		return params;
	}

	static get_websdk_config(config) {
		return {
			...(constant_helper.get_app_constant().DEFAULT_WEBSDK_CONFIG || {}),
			business_color: CollectionHelper.process_get_localitem(constant_helper.get_app_constant().NECTOR_BUSINESS_COLOR) || constant_helper.get_app_constant().DEFAULT_WEBSDK_CONFIG.business_color,
			text_color: CollectionHelper.process_get_localitem(constant_helper.get_app_constant().NECTOR_TEXT_COLOR) || constant_helper.get_app_constant().DEFAULT_WEBSDK_CONFIG.text_color,
			...(config || {})
		};
	}

	static set_css_property(prop, value) {
		if (value) {
			document.documentElement.style.setProperty(prop, value);
		}
	}

	static adjust_color(col, amt) {
		// if amount is +ve, lightens the color. If -ve, darkens the color
		col = col.replace(/^#/, "");
		if (col.length === 3) col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];

		let [r, g, b] = col.match(/.{2}/g);
		([r, g, b] = [parseInt(r, 16) + amt, parseInt(g, 16) + amt, parseInt(b, 16) + amt]);

		r = Math.max(Math.min(255, r), 0).toString(16);
		g = Math.max(Math.min(255, g), 0).toString(16);
		b = Math.max(Math.min(255, b), 0).toString(16);

		const rr = (r.length < 2 ? "0" : "") + r;
		const gg = (g.length < 2 ? "0" : "") + g;
		const bb = (b.length < 2 ? "0" : "") + b;

		return `#${rr}${gg}${bb}`;
	}

	// getters
	static get_lodash() {
		return lodash;
	}

	static get_moment() {
		return moment;
	}

	static get_safe_amount(amount) {
		if (isNaN(amount)) return "-";
		return Number(amount);
	}

	static get_limited_text(text, length = 20, default_value = "", postfix = "...") {
		if (CollectionHelper.validate_is_null_or_undefined(text) === true) return default_value;
		return String(text).slice(0, length) + postfix;
	}

	static get_color_from_wallettransaction_status(status) {
		if (status === "success") return "green";
		else return "red";
	}

	static get_color_from_wallettransaction_type(type) {
		if (type === "reward") return "green";
		else if (type === "adjust") return "blue";
		else return "red";
	}

	static get_color_from_wallettransaction_operation(operation) {
		if (operation === "cr") return "green";
		else return "red";
	}

	static get_text_from_wallettransaction_type_amount(type, amount) {
		if (type === "reward") return `${CollectionHelper.get_lodash().capitalize(type)}: ${Number(amount)} Points`;
		else if (type === "adjust") return `${CollectionHelper.get_lodash().capitalize(type)}: ${Number(amount)} Points`;
		else if (type === "redeem") return `${CollectionHelper.get_lodash().capitalize(type)}: ${Number(amount)} Points`;
		else return "";
	}

	static get_text_from_wallettransaction_operation(operation) {
		if (operation === "cr") return "+";
		else return "-";
	}

	static get_color_from_text_length(text) {
		const colors = [
			"#ff7f50", "#188FA7", "#033860", "#1C8D73", "#758283",
			"#4C0827", "#ba55d3", "#E03B8B", "#ffa500", "#4B3F72"
		];

		if (!text) return colors[0];
		return colors[text.length % colors.length] || colors[0];
	}

	static get_time_segment() {
		let time_segment = null;
		const current_hour = CollectionHelper.get_moment()().hour();
		if (current_hour >= 2 && current_hour < 12) time_segment = "morning";
		else if (current_hour >= 12 && current_hour < 17) time_segment = "afternoon";
		else if (current_hour >= 17 && current_hour < 21) time_segment = "evening";
		else if (current_hour >= 21 || current_hour < 2) time_segment = "night";

		return time_segment;
	}

	static window_post_message(event, data, origin = null) {
		const payload = { event, payload: data || null };
		window.top.postMessage(payload, origin || "*");
	}

	static is_session_storage_supported() {
		try {
			if (window.sessionStorage) return true;
			return false;
		} catch (e) {
			return false;
		}
	}

	static is_local_storage_supported() {
		try {
			if (window.localStorage) return true;
			return false;
		} catch (e) {
			return false;
		}
	}
}

export default CollectionHelper;
