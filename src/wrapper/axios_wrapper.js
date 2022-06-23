// app import
import axios_client from "../client/axios_client";

class AxiosWrapper {
	init(key) {
		this.prepare_common_wrapper(key);
	}

	prepare_common_wrapper(key) {
		this.axios_wrapper = new axios_client();
		
		// init
		this.axios_wrapper.init(key);
	}

	// getter
	get_wrapper() {
		return this.axios_wrapper;
	}
}

const axios_wrapper = new AxiosWrapper();
export default axios_wrapper;