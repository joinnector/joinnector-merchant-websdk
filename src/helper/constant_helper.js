// app import
import * as app_constant_helper from "./sub_constant_helper/app_constant_helper";
import * as env_constant_helper from "./sub_constant_helper/env_constant_helper";
import * as setting_constant_helper from "./sub_constant_helper/setting_constant_helper";

class ConstantHelper {
	// getters
	static get_app_constant()  {
		return app_constant_helper;
	}

	static get_env_constant() {
		return env_constant_helper;
	}

	static get_setting_constant() {
		return setting_constant_helper;
	}
}

export default ConstantHelper;
