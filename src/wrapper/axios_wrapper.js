// app import
import axios_client from "../client/axios_client";

class AxiosWrapper {
	init(base_url, key, secret) {
		this.prepare_common_wrapper(base_url, key, secret);
	}

	prepare_common_wrapper(base_url, key, secret) {
		this.axios_wrapper = new axios_client();
		
		// init
		this.axios_wrapper.init(base_url, key, secret);
	}

	// getter
	get_wrapper() {
		return this.axios_wrapper;
	}
}

const axios_wrapper = new AxiosWrapper();
export default axios_wrapper;