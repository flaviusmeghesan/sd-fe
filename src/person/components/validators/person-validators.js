const minLengthValidator = (value, minLength) => {
    return value.length >= minLength;
};

const requiredValidator = value => {
    return value.trim() !== '';
};

const emailValidator = value => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(value).toLowerCase());
};

function validate(value, rules) {
    let isValid = true;

    if (rules.isRequired) {
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.hasUpperCase) {
        isValid = /[A-Z]/.test(value) && isValid;
    }

    if (rules.hasLowerCase) {
        isValid = /[a-z]/.test(value) && isValid;
    }

    if (rules.hasNumber) {
        isValid = /\d/.test(value) && isValid;
    }

    return isValid;
}

export default validate;