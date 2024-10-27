export function validate(value, rules) {
    let isValid = true;

    if (rules.isRequired) {
        isValid = isValid && requiredValidator(value);
    }

    if (rules.minLength) {
        isValid = isValid && minLengthValidator(value, rules.minLength);
    }

    if (rules.isNumeric) {
        isValid = isValid && numericValidator(value);
    }

    return isValid;
}

function requiredValidator(value) {
    return value.trim() !== '';
}

function minLengthValidator(value, minLength) {
    return value.length >= minLength;
}

function numericValidator(value) {
    return !isNaN(value) && Number(value) >= 0;
}
