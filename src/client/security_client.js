import crypto from "crypto";

// app import
import collection_helper from "../helper/collection_helper";
import constant_helper from "../helper/constant_helper";

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

	process_hmac_signature(value, secret) {
		const hmac_alog = collection_helper.process_env_value(process.env[constant_helper.get_env_constant().REACT_APP_HMAC_ALGO]);

		return crypto.createHmac(hmac_alog, secret).update(value).digest("hex");
	}
}


export default SecurityClient;