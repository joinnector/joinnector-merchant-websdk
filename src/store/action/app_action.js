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
		dispatch(dispatch_action(opts.event, opts.append_data || false, opts.attributes || null));
	};
};

export const api_generic_post = (opts, notify_callback = null) => {
	// eslint-disable-next-line no-unused-vars
	return async (dispatch, getState) => {
		const headers = {
			...constant_helper.get_app_constant().API_BASE_HEADER,
			has_authorization: true,
			...(opts.headers || {})
		};

		if (opts.file) opts.attributes.file = opts.file;

		try {
			const result = await axios_wrapper.get_wrapper().process_axios_post(collection_helper.process_key_join([opts.url, opts.endpoint], "/"), headers, opts.params, opts.attributes);
			// eslint-disable-next-line no-use-before-define
			api_base_dispatch(opts.event, false, dispatch, result, notify_callback);
		} catch (error) {
			// eslint-disable-next-line no-use-before-define
			api_base_error_dispatch(opts.event, false, dispatch, error, notify_callback);
		}
	};
};

export const api_generic_get = (opts, notify_callback = null) => {
	// eslint-disable-next-line no-unused-vars
	return async (dispatch, getState) => {
		const headers = {
			...constant_helper.get_app_constant().API_BASE_HEADER,
			has_authorization: true,
			...(opts.headers || {})
		};

		try {
			const result = await axios_wrapper.get_wrapper().process_axios_get(collection_helper.process_key_join([opts.url, opts.endpoint], "/"), headers, opts.params);
			// eslint-disable-next-line no-use-before-define
			api_base_dispatch(opts.event, opts.append_data || false, dispatch, result, notify_callback);
		} catch (error) {
			// eslint-disable-next-line no-use-before-define
			api_base_error_dispatch(opts.event, opts.append_data || false, dispatch, error, notify_callback);
		}
	};
};

export const api_generic_put = (opts, notify_callback = null) => {
	// eslint-disable-next-line no-unused-vars
	return async (dispatch, getState) => {
		const headers = {
			...constant_helper.get_app_constant().API_BASE_HEADER,
			has_authorization: true,
			...(opts.headers || {})
		};

		try {
			const result = await axios_wrapper.get_wrapper().process_axios_put(collection_helper.process_key_join([opts.url, opts.endpoint], "/"), headers, opts.params, opts.attributes);
			// eslint-disable-next-line no-use-before-define
			api_base_dispatch(opts.event, false, dispatch, result, notify_callback);
		} catch (error) {
			// eslint-disable-next-line no-use-before-define
			api_base_error_dispatch(opts.event, false, dispatch, error, notify_callback);
		}
	};
};

export const api_generic_delete = (opts, notify_callback = null) => {
	// eslint-disable-next-line no-unused-vars
	return async (dispatch, getState) => {
		const headers = {
			...constant_helper.get_app_constant().API_BASE_HEADER,
			has_authorization: true,
			...(opts.headers || {})
		};

		try {
			const result = await axios_wrapper.get_wrapper().process_axios_delete(collection_helper.process_key_join([opts.url, opts.endpoint], "/"), headers, opts.params);
			// eslint-disable-next-line no-use-before-define
			api_base_dispatch(opts.event, false, dispatch, result, notify_callback);
		} catch (error) {
			// eslint-disable-next-line no-use-before-define
			api_base_error_dispatch(opts.event, false, dispatch, error, notify_callback);
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