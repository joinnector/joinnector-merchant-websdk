import lodash from "lodash";
import moment from "moment";

import * as antd from "antd";
import * as uuidv4 from "uuid";

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

	static show_message(title, type = "success", duration = 10) {
		antd.message[type](title, duration);
	}

	static show_notification(title, type = "success", message = "", duration = 10) {
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
		return {
			url: search_params.get("url") || null,
			endpoint: search_params.get("endpoint") || "nector-delegate",
			authorization: search_params.get("authorization") || null,
			view: search_params.get("view") || "desktop",
		};
	}

	// getters
	static get_lodash() {
		return lodash;
	}

	static get_moment() {
		return moment;
	}
}

export default CollectionHelper;
