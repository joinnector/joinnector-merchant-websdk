// app import
import axios_client from "../client/axios_client";

class AxiosWrapper {
	init() {
		this.prepare_common_wrapper();
	}

	prepare_common_wrapper() {
		this.axios_wrapper = new axios_client();
		
		// init
		this.axios_wrapper.init();
	}

	// getter
	get_wrapper() {
		this.init();
		return this.axios_wrapper;
	}
}

const axios_wrapper = new AxiosWrapper();
export default axios_wrapper;