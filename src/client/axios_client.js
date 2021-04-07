// system import
import axios from "axios";
import querystring from "querystring";
import form_data from "form-data";

// app import
import collection_helper from "../helper/collection_helper";
import constant_helper from "../helper/constant_helper";

import http_method_type_enum from "../enum/http_method_type_enum";

class AxiosClient {
	constructor(notify_callback) {
		this.notify_callback_called = false;
		if (collection_helper.validate_is_function(notify_callback) === true) this.notify_callback = notify_callback;
	}

	init(base_url, key, secret) {
		this.prepare_common_instance(base_url, key, secret);
	}

	prepare_common_instance(base_url, key, secret) {
		this.axios_instance = axios.create();

		this.base_url = base_url;
		this.key = key;
		this.secret = secret;

		// if (["https://platform.nector.io", "https://devplatform.nector.io"].includes(this.base_url) === false) this.base_url = null;

		if (collection_helper.validate_is_function(this.notify_callback) === true && this.notify_callback_called === false) {
			this.notify_callback_called = true;
			this.notify_callback(true);
		}
	}

	create(payload, module_name, action = "create") {
		const apimapopts = constant_helper.get_setting_constant().API_MAP[module_name];
		if (!this.key || !this.secret || !this.base_url || !apimapopts[action]) return {};

		const url = this.base_url + apimapopts[action].prefix + apimapopts[action].endpoint;
		const headers = { ...constant_helper.get_setting_constant().API_HEADER };
		const params = {};
		const attributes = payload;

		headers.authorization = "Basic " + Buffer.from(this.key + ":" + this.secret, "utf8").toString("base64");
		headers["x-apikey"] = this.key;

		return { url, headers, params, attributes, method_name: "process_axios_post" };
	}

	get(by_id, module_name, action = "get") {
		const apimapopts = constant_helper.get_setting_constant().API_MAP[module_name];
		if (!this.key || !this.secret || !this.base_url || !apimapopts[action]) return {};

		const url = (this.base_url + apimapopts[action].prefix + apimapopts[action].endpoint).replace("{id}", by_id);
		const headers = { ...constant_helper.get_setting_constant().API_HEADER };

		headers.authorization = "Basic " + Buffer.from(this.key + ":" + this.secret, "utf8").toString("base64");
		headers["x-apikey"] = this.key;

		return { url, headers, params: {}, method_name: "process_axios_get" };
	}

	get_by(by_key, by_value, swap_id, module_name, action = "get") {
		const apimapopts = constant_helper.get_setting_constant().API_MAP[module_name];
		if (!this.key || !this.secret || !this.base_url || !apimapopts[action]) return {};

		const url = (this.base_url + apimapopts[action].prefix + apimapopts[action].endpoint).replace("{id}", collection_helper.process_new_uuid());
		const headers = { ...constant_helper.get_setting_constant().API_HEADER };
		const params = { [by_key]: by_value };

		if (swap_id) params.swap_id = swap_id;

		headers.authorization = "Basic " + Buffer.from(this.key + ":" + this.secret, "utf8").toString("base64");
		headers["x-apikey"] = this.key;
		headers["content-type"] = "application/x-www-form-urlencoded";

		return { url, headers, params, method_name: "process_axios_get" };
	}

	save(by_id, payload, module_name, action = "save") {
		const apimapopts = constant_helper.get_setting_constant().API_MAP[module_name];
		if (!this.key || !this.secret || !this.base_url || !apimapopts[action]) return {};

		const url = (this.base_url + apimapopts[action].prefix + apimapopts[action].endpoint).replace("{id}", by_id);
		const headers = { ...constant_helper.get_setting_constant().API_HEADER };
		const attributes = payload;

		headers.authorization = "Basic " + Buffer.from(this.key + ":" + this.secret, "utf8").toString("base64");
		headers["x-apikey"] = this.key;

		return { url, headers, params: {}, attributes, method_name: "process_axios_put" };
	}

	delete(by_id, module_name, action = "delete") {
		const apimapopts = constant_helper.get_setting_constant().API_MAP[module_name];
		if (!this.key || !this.secret || !this.base_url || !apimapopts[action]) return {};

		const url = (this.base_url + apimapopts[action].prefix + apimapopts[action].endpoint).replace("{id}", by_id);
		const headers = { ...constant_helper.get_setting_constant().API_HEADER };

		headers.authorization = "Basic " + Buffer.from(this.key + ":" + this.secret, "utf8").toString("base64");
		headers["x-apikey"] = this.key;

		return { url, headers, params: {}, method_name: "process_axios_delete" };
	}

	fetch(by_filter, module_name, action = "fetch") {
		const apimapopts = constant_helper.get_setting_constant().API_MAP[module_name];
		if (!this.key || !this.secret || !this.base_url || !apimapopts[action]) return {};

		const url = this.base_url + apimapopts[action].prefix + apimapopts[action].endpoint;
		const headers = { ...constant_helper.get_setting_constant().API_HEADER };
		const params = { page: 1, limit: 20, ...(by_filter || {}) };

		headers.authorization = "Basic " + Buffer.from(this.key + ":" + this.secret, "utf8").toString("base64");
		headers["x-apikey"] = this.key;

		return { url, headers, params, method_name: "process_axios_get" };
	}

	async process_axios_get(url, headers, params) {
		// attach default headers
		if (headers["content-type"] === "application/json") {
			headers = { ...headers, "accept": "application/json", "content-type": "application/json" };
		} else if (headers["content-type"] === "application/x-www-form-urlencoded") {
			headers = { ...headers, "accept": "application/json", "content-type": "application/x-www-form-urlencoded" };
		}

		const axiosopts = {
			method: http_method_type_enum.GET,
			url: url,
			headers: headers
		};

		if (collection_helper.validate_not_null_or_undefined(params) === true
			&& Object.keys(params).length > 0) {
			axiosopts.params = params;
			axiosopts.paramsSerializer = function (_params) {
				return querystring.stringify(_params);
			};
		}

		const request_axios_result = await this.axios_instance.request(axiosopts);
		return request_axios_result.data;
	}

	async process_axios_put(url, headers, params, data) {
		// attach default headers
		if (headers["content-type"] === "application/json") {
			headers = { ...headers, "accept": "application/json", "content-type": "application/json" };
		} else if (headers["content-type"] === "application/x-www-form-urlencoded") {
			headers = { ...headers, "accept": "application/json", "content-type": "application/x-www-form-urlencoded" };
			data = querystring.stringify(data);
		} else {
			throw new Error("Something went wrong, invalid headers");
		}

		const axiosopts = {
			method: http_method_type_enum.PUT,
			url: url,
			headers: headers,
			data: data
		};

		if (params && Object.keys(params).length > 0) {
			axiosopts.params = params;
			axiosopts.paramsSerializer = function (_params) {
				return querystring.stringify(_params);
			};
		}

		const request_axios_result = await this.axios_instance.request(axiosopts);
		return request_axios_result.data;
	}

	async process_axios_delete(url, headers, params) {
		// attach default headers
		if (headers["content-type"] === "application/json") {
			headers = { ...headers, "accept": "application/json", "content-type": "application/json" };
		} else if (headers["content-type"] === "application/x-www-form-urlencoded") {
			headers = { ...headers, "accept": "application/json", "content-type": "application/x-www-form-urlencoded" };
		} else {
			throw new Error("Something went wrong, invalid headers");
		}

		const axiosopts = {
			method: http_method_type_enum.DELETE,
			url: url,
			headers: headers,
		};

		if (params && Object.keys(params).length > 0) {
			axiosopts.params = params;
			axiosopts.paramsSerializer = function (_params) {
				return querystring.stringify(_params);
			};
		}

		return await this.axios_instance.request(axiosopts);
	}

	async process_axios_post(url, headers, params, data) {
		// attach default headers
		if (headers["content-type"] === "application/json") {
			headers = { ...headers, "accept": "application/json", "content-type": "application/json" };
		} else if (headers["content-type"] === "application/x-www-form-urlencoded") {
			headers = { ...headers, "accept": "application/json", "content-type": "application/x-www-form-urlencoded" };
			data = querystring.stringify(data);
		} else if (headers["content-type"] === "multipart/form-data") {
			headers = { ...headers, "accept": "application/json", "content-type": "multipart/form-data" };
			const formdata = new form_data();
			Object.keys(data).map(key => formdata.append(key, data[key]));
			data = formdata;
		}

		const axiosopts = {
			method: http_method_type_enum.POST,
			url: url,
			headers: headers,
			data: data
		};

		if (collection_helper.validate_not_null_or_undefined(params) === true
			&& Object.keys(params).length > 0) {
			axiosopts.params = params;
			axiosopts.paramsSerializer = function (_params) {
				return querystring.stringify(_params);
			};
		}

		const request_axios_result = await this.axios_instance.request(axiosopts);
		return request_axios_result.data;
	}
}

export default AxiosClient;