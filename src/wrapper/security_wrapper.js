// app import
import security_client from "../client/security_client";

class SecurityWrapper {
	init() {
		this.prepare_common_wrapper();
	}

	prepare_common_wrapper() {
		this.security_wrapper = new security_client();
		
		// init
		this.security_wrapper.init();
	}

	// getter
	get_wrapper() {
		this.init();
		return this.security_wrapper;
	}
}

const security_wrapper = new SecurityWrapper();
export default security_wrapper;