// system or lib import
import { BigNumber } from "bignumber.js";

import collection_helper from "./collection_helper";

// setting up the range
BigNumber.config({ EXPONENTIAL_AT: [-15, 30] });

class MathHelper {
	// validators
	
	static validate_is_null_or_undefined(value) {
		return (collection_helper.get_lodash().isNull(value) === true || collection_helper.get_lodash().isUndefined(value) === true);
	}

	static validate_not_null_or_undefined(value) {
		return !MathHelper.validate_is_null_or_undefined(value);
	}

	static validate_is_number_representation(value) {
		if (MathHelper.validate_is_null_or_undefined(value) === true) return false;

		return collection_helper.get_lodash().isNaN(value) === false;
	}

	static validate_not_number_representation(value) {
		return !MathHelper.validate_is_number_representation(value);
	}

	static validate_is_number(value) {
		if (MathHelper.validate_is_null_or_undefined(value) === true) return false;

		return collection_helper.get_lodash().isNumber(value) === true;
	}

	static validate_not_number(value) {
		return !MathHelper.validate_is_number(value);
	}

	static validate_is_bignumber(value, check_negative = false) {
		if (MathHelper.validate_is_null_or_undefined(value) === true) return false;

		if (BigNumber.isBigNumber(value) === false) return false;

		if (check_negative === true) {
			if (value.isNaN() === true || value.isFinite() === false || value.isNegative() === true) {
				return false;
			}
		} else {
			if (value.isNaN() === true || value.isFinite() === false) {
				return false;
			}
		}

		return true;
	}

	
	static validate_not_bignumber(value) {
		return !MathHelper.validate_is_bignumber(value);
	}

	static validate_is_bignumber_equal(value_one, value_two) {
		if (MathHelper.validate_is_null_or_undefined(value_one) === true) return false;
		if (MathHelper.validate_is_null_or_undefined(value_two) === true) return false;

		return value_one.isEqualTo(value_two);
	}

	static validate_not_bignumber_equal(value_one, value_two) {
		return !MathHelper.validate_is_bignumber_equal(value_one, value_two);
	}

	static validate_is_bignumber_greater_than(value_one, value_two) {
		if (MathHelper.validate_is_null_or_undefined(value_one) === true) return false;
		if (MathHelper.validate_is_null_or_undefined(value_two) === true) return false;

		return value_one.isGreaterThan(value_two);
	}

	static validate_not_bignumber_greater_than(value_one, value_two) {
		return !MathHelper.validate_is_bignumber_greater_than(value_one, value_two);
	}

	static validate_is_bignumber_greater_than_zero(value_one) {
		if (MathHelper.validate_is_null_or_undefined(value_one) === true) return false;

		return value_one.isGreaterThan(MathHelper.convert_to_bignumber_from_number_or_string(0));
	}

	static validate_not_bignumber_greater_than_zero(value_one) {
		return !MathHelper.validate_is_bignumber_greater_than_zero(value_one);
	}

	static validate_is_bignumber_greater_than_or_equal(value_one, value_two) {
		if (MathHelper.validate_is_null_or_undefined(value_one) === true) return false;
		if (MathHelper.validate_is_null_or_undefined(value_two) === true) return false;

		return value_one.isGreaterThanOrEqualTo(value_two);
	}

	static validate_not_bignumber_greater_than_or_equal(value_one, value_two) {
		return !MathHelper.validate_is_bignumber_greater_than_or_equal(value_one, value_two);
	}

	static validate_is_bignumber_less_than(value_one, value_two) {
		if (MathHelper.validate_is_null_or_undefined(value_one) === true) return false;
		if (MathHelper.validate_is_null_or_undefined(value_two) === true) return false;

		return value_one.isLessThan(value_two);
	}

	static validate_not_bignumber_less_than(value_one, value_two) {
		return !MathHelper.validate_is_bignumber_less_than(value_one, value_two);
	}

	static validate_is_bignumber_less_than_zero(value_one) {
		if (MathHelper.validate_is_null_or_undefined(value_one) === true) return false;

		return value_one.isLessThan(MathHelper.convert_to_bignumber_from_number_or_string(0));
	}

	static validate_not_bignumber_less_than_zero(value_one) {
		return !MathHelper.validate_is_bignumber_less_than_zero(value_one);
	}

	static validate_is_bignumber_less_than_or_equal(value_one, value_two) {
		if (MathHelper.validate_is_null_or_undefined(value_one) === true) return false;
		if (MathHelper.validate_is_null_or_undefined(value_two) === true) return false;

		return value_one.isLessThanOrEqualTo(value_two);
	}

	static validate_not_bignumber_less_than_or_equal(value_one, value_two) {
		return !MathHelper.validate_is_bignumber_less_than_or_equal(value_one, value_two);
	}

	// convertor
	static convert_to_number_from_number_or_string(value) {
		return Number(value);
	}

	static convert_to_integer_from_number_or_string(value) {
		return Number.parseInt(String(value));
	}

	static convert_to_bignumber_from_number_or_string(value) {
		if (MathHelper.validate_is_bignumber(value) === true) {
			return value;
		} else {
			return new BigNumber(value);
		}
	}

	static convert_to_string_from_number(value, place = 2) {
		const power = MathHelper.convert_to_bignumber_from_number_or_string(10).pow(place);
		const bigvalue = MathHelper.convert_to_bignumber_from_number_or_string(value);
		const rounded_integer_value = bigvalue.times(power).integerValue(BigNumber.ROUND_CEIL).div(power);
		return rounded_integer_value.toString();
	}

	static convert_to_string_from_bignumber(value, place = 2) {
		const power = MathHelper.convert_to_bignumber_from_number_or_string(10).pow(place);
		const rounded_integer_value = value.times(power).integerValue(BigNumber.ROUND_CEIL).div(power);
		return rounded_integer_value.toString();
	}

	// ------
	// process
	static process_add(value_one, value_two, place = 2) {
		value_one = MathHelper.convert_to_bignumber_from_number_or_string(value_one);
		value_two = MathHelper.convert_to_bignumber_from_number_or_string(value_two);
		const math_helper_result = value_one.plus(value_two);
		return MathHelper.convert_to_string_from_bignumber(math_helper_result, place);
	}

	// result can be negative
	static process_subtract(value_one, value_two, place = 2) {
		value_one = MathHelper.convert_to_bignumber_from_number_or_string(value_one);
		value_two = MathHelper.convert_to_bignumber_from_number_or_string(value_two);
		const math_helper_result = value_one.minus(value_two);
		return MathHelper.convert_to_string_from_bignumber(math_helper_result, place);
	}

	static process_multiply(value_one, value_two, place = 2) {
		value_one = MathHelper.convert_to_bignumber_from_number_or_string(value_one);
		value_two = MathHelper.convert_to_bignumber_from_number_or_string(value_two);
		const math_helper_result = value_one.times(value_two);
		return MathHelper.convert_to_string_from_bignumber(math_helper_result, place);
	}

	static process_divide(value_one, value_two, place = 2) {
		value_one = MathHelper.convert_to_bignumber_from_number_or_string(value_one);
		value_two = MathHelper.convert_to_bignumber_from_number_or_string(value_two);
		const math_helper_result = value_one.div(value_two);
		return MathHelper.convert_to_string_from_bignumber(math_helper_result, place);
	}
}

export default MathHelper;