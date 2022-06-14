import shajs from "sha.js";

// app import
import collection_helper from "../helper/collection_helper";

class SecurityClient {
	constructor(notify_callback) {
		this.notify_callback_called = false;
		if (collection_helper.validate_is_function(notify_callback) === true) this.notify_callback = notify_callback;
	}

	init() {
		this.prepare_common_instance();
	}

	prepare_common_instance() {
		if (collection_helper.validate_is_function(this.notify_callback) === true && this.notify_callback_called === false) {
			this.notify_callback_called = true;
			this.notify_callback(true);
		}
	}

	process_sha256_hash(value) {
		if(collection_helper.validate_not_string(value)) return null;
		// eslint-disable-next-line no-undef
		const digest = shajs("sha256").update(value).digest("hex");
		return digest;
	}
}


export default SecurityClient;