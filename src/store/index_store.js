// system import
import thunk from "redux-thunk";
import promise from "redux-promise";
import logger from "redux-logger";

import * as redux from "redux";

import app_reducer from "./reducer/app_reducer";

import collection_helper from "../helper/collection_helper";
import constant_helper from "../helper/constant_helper";


let middleware = [thunk, promise];
if (collection_helper.process_env_value(process.env[constant_helper.get_env_constant().NODE_ENV]) !== "production") {
	middleware = [...middleware, logger];
}

const initialize_store = () => (redux.createStore(redux.combineReducers({ app_reducer }), redux.applyMiddleware(...middleware)));
export default initialize_store;
