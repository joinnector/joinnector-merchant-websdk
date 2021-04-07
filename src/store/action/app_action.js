/* eslint-disable indent */
import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";

import axios_wrapper from "../../wrapper/axios_wrapper";

export const dispatch_action = (type, append_data = false, attributes = null) => {
	if (collection_helper.validate_is_null_or_undefined(attributes) === true) return { type };
	else return { type, append_data, attributes };
};

export const internal_generic_dispatch = (opts, notify_callback = null) => {
	// eslint-disable-next-line no-unused-vars
	return async (dispatch, getState) => {
		if (collection_helper.validate_not_null_or_undefined(notify_callback) === true) notify_callback(opts);
		dispatch(dispatch_action(opts.event, opts.append_data || false, opts.attributes));
	};
};


export const api_generic_post = (opts, notify_callback = null) => {
	// eslint-disable-next-line no-unused-vars
	return async (dispatch, getState) => {
		const headers = {
			...constant_helper.get_app_constant().API_BASE_HEADER,
			...(opts.headers || {})
		};

		console.log(opts);

		if (opts.authorization) headers.authorization = opts.authorization;
		try {
			if (collection_helper.validate_not_null_or_undefined(opts.attributes.regular_attributes) === true
				&& collection_helper.validate_not_null_or_undefined(opts.attributes.regular_attributes.method_name) === true) {
				console.log(opts.attributes.regular_attributes);
				// const result = await axios_wrapper.get_wrapper()[opts.attributes.regular_attributes.method_name](opts.attributes.regular_attributes.url, opts.attributes.regular_attributes.headers, opts.attributes.regular_attributes.params || {}, opts.attributes.regular_attributes.data || {});
				// // eslint-disable-next-line no-use-before-define
				// api_base_dispatch(opts.event, opts.append_data || false, dispatch, result, notify_callback);
				const result = await axios_wrapper.get_wrapper().process_axios_post(collection_helper.process_key_join([opts.url, opts.endpoint], "/"), headers, opts.params, opts.attributes.delegate_attributes);
				// eslint-disable-next-line no-use-before-define
				api_base_dispatch(opts.event, opts.append_data || false, dispatch, result, notify_callback);
			} else {
				const result = await axios_wrapper.get_wrapper().process_axios_post(collection_helper.process_key_join([opts.url, opts.endpoint], "/"), headers, opts.params, opts.attributes.delegate_attributes);
				// eslint-disable-next-line no-use-before-define
				api_base_dispatch(opts.event, opts.append_data || false, dispatch, result, notify_callback);
			}

		} catch (error) {
			// eslint-disable-next-line no-use-before-define
			api_base_error_dispatch(opts.event, opts.append_data || false, dispatch, error, notify_callback);
		}
	};
};

const api_base_dispatch = (event, append_data, dispatch, result, notify_callback) => {
	if (result.meta.status === "error") {
		// eslint-disable-next-line no-use-before-define
		api_base_error_dispatch(event, append_data || false, dispatch, result, notify_callback);
	} else {
		// eslint-disable-next-line no-use-before-define
		api_base_success_dispatch(event, append_data || false, dispatch, result, notify_callback);
	}
};

const api_base_success_dispatch = (event, append_data, dispatch, result, notify_callback) => {
	if (collection_helper.validate_not_null_or_undefined(notify_callback) === true) notify_callback(result);
	dispatch(dispatch_action(event, append_data || false, result.data));
};

const api_base_error_dispatch = (event, append_data, dispatch, result, notify_callback) => {
	const meta = (result && result.response && result.response.data && result.response.data.meta) || {};
	const data = (result && result.response && result.response.data && result.response.data.data) || {};
	const code = (result && result.response && result.response.data && result.response.data.meta && result.response.data.meta.code) || 400;

	if (collection_helper.validate_not_null_or_undefined(notify_callback) === true) notify_callback({ data: data, meta: meta });
	if (code === 401) {
		dispatch(dispatch_action(constant_helper.get_app_constant().API_ERROR_DISPATCH, append_data || false, data));
	} else {
		dispatch(dispatch_action(constant_helper.get_app_constant().API_ERROR_DISPATCH, append_data || false, data));
	}
};