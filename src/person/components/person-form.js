import React from 'react';
import validate from "./validators/person-validators";
import Button from "react-bootstrap/Button";
import * as API_USERS from "../api/person-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row, FormGroup, Input, Label} from "reactstrap";

class PersonForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {
            errorStatus: 0,
            error: null,
            formIsValid: false,
            formControls: {
                name: {
                    value: '',
                    placeholder: 'What is your name?...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                role: {
                    value: '',
                    placeholder: 'Select role...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        isRequired: true
                    },
                    options: [
                        { value: 'admin', displayValue: 'Admin' },
                        { value: 'client', displayValue: 'Client' }
                    ]
                },
                username: {
                    value: '',
                    placeholder: 'Username...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                password: {
                    value: '',
                    placeholder: 'Password...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 8,
                        hasUpperCase: true,
                        hasLowerCase: true,
                        hasNumber: true,
                        isRequired: true
                    }
                },
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.person) {
            const { name, role, username, password } = this.props.person;
            this.setState({
                formControls: {
                    ...this.state.formControls,
                    name: { ...this.state.formControls.name, value: name, valid: true },
                    role: { ...this.state.formControls.role, value: role, valid: true },
                    username: { ...this.state.formControls.username, value: username, valid: true },
                    password: { ...this.state.formControls.password, value: password, valid: true }
                },
                formIsValid: true
            });
        }
    }

    toggleForm() {
        this.setState({ collapseForm: !this.state.collapseForm });
    }

    handleChange = event => {
        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = this.state.formControls;
        const updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }

        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
        });
    };

    registerPerson(person) {
        return API_USERS.postPerson(person, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                this.reloadHandler();
            } else {
                let errorMessage = "An unexpected error occurred on the server side!";
                if (error && error.message) {
                    errorMessage = error.message;
                }
                this.setState({
                    errorStatus: status,
                    error: errorMessage
                });
            }
        });
    }

    updatePerson(person) {
        return API_USERS.updatePerson(this.props.person.id, person, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                this.reloadHandler();
            } else {
                let errorMessage = "An unexpected error occurred on the server side!";
                if (error && error.message) {
                    errorMessage = error.message;
                }
                this.setState({
                    errorStatus: status,
                    error: errorMessage
                });
            }
        });
    }

    handleSubmit() {
        const person = {
            name: this.state.formControls.name.value,
            role: this.state.formControls.role.value,
            username: this.state.formControls.username.value,
            password: this.state.formControls.password.value
        };

        if (this.props.person) {
            this.updatePerson(person);
        } else {
            this.registerPerson(person);
        }
    }

    render() {
        return (
            <div>
                <FormGroup id='name'>
                    <Label for='nameField'> Name: </Label>
                    <Input name='name' id='nameField' placeholder={this.state.formControls.name.placeholder}
                           onChange={this.handleChange}
                           value={this.state.formControls.name.value} // Use value instead of defaultValue
                           touched={this.state.formControls.name.touched ? 1 : 0}
                           valid={this.state.formControls.name.valid}
                           required
                    />
                    {this.state.formControls.name.touched && !this.state.formControls.name.valid &&
                        <div className={"error-message row"}> * Name must have at least 3 characters </div>}
                </FormGroup>
    
                <FormGroup id='role'>
                    <Label for='roleField'> Role: </Label>
                    <Input type="select" name='role' id='roleField' onChange={this.handleChange}
                           value={this.state.formControls.role.value} // Use value instead of defaultValue
                           touched={this.state.formControls.role.touched ? 1 : 0}
                           valid={this.state.formControls.role.valid}
                           required>
                        <option value="" disabled>{this.state.formControls.role.placeholder}</option>
                        {this.state.formControls.role.options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.displayValue}
                            </option>
                        ))}
                    </Input>
                    {this.state.formControls.role.touched && !this.state.formControls.role.valid &&
                        <div className={"error-message"}> * Role is required</div>}
                </FormGroup>
    
                <FormGroup id='username'>
                    <Label for='usernameField'> Username: </Label>
                    <Input name='username' id='usernameField' placeholder={this.state.formControls.username.placeholder}
                           onChange={this.handleChange}
                           value={this.state.formControls.username.value} // Use value instead of defaultValue
                           touched={this.state.formControls.username.touched ? 1 : 0}
                           valid={this.state.formControls.username.valid}
                           required
                    />
                </FormGroup>
    
                <FormGroup id='password'>
                    <Label for='passwordField'> Password: </Label>
                    <Input type="password" name='password' id='passwordField' placeholder={this.state.formControls.password.placeholder}
                           onChange={this.handleChange}
                           value={this.state.formControls.password.value} // Use value instead of defaultValue
                           touched={this.state.formControls.password.touched ? 1 : 0}
                           valid={this.state.formControls.password.valid}
                           required
                    />
                    {this.state.formControls.password.touched && !this.state.formControls.password.valid &&
                        <div className={"error-message"}> * Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number </div>}
                </FormGroup>
    
                <Row>
                    <Col sm={{size: '4', offset: 5}}>
                        <Button type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleSubmit}>Submit</Button>
                    </Col>
                </Row>
    
                {this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error}/>}
            </div>
        );
    }
    
}

export default PersonForm;
