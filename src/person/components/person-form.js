import React from 'react';
import validate from "./validators/person-validators"; // Importă funcția de validare
import * as API_USERS from "../api/person-api";
import { Col, Row, FormGroup, Input, Label, Button } from "reactstrap";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";

class PersonForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorStatus: 0,
            error: null,
            formIsValid: false,
            formControls: {
                name: {
                    value: '',
                    placeholder: 'Name...',
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
                }
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

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = { ...this.state.formControls };
        const updatedFormElement = { ...updatedControls[name] };

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules); // Validează valoarea
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let formElement in updatedControls) {
            formIsValid = updatedControls[formElement].valid && formIsValid;
        }

        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
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
            // Updating an existing person
            API_USERS.updatePerson(this.props.person.id, person, (result, status, err) => {
                if (status === 200) {
                    this.props.refreshTableData(); // Call to refresh data
                    this.props.toggle(); // Close the form modal
                } else {
                    console.error("Error updating person:", err);
                    this.setState({ errorStatus: status, error: err.message || "Could not update person" });
                }
            });
        } else {
            // Adding a new person
            API_USERS.postPerson(person, (result, status, err) => {
                if (status === 201) {
                    this.props.refreshTableData(); // Call to refresh data
                    this.props.toggle(); // Close the form modal
                } else {
                    console.error("Error adding person:", err);
                    this.setState({ errorStatus: status, error: err.message || "Could not add person" });
                }
            });
        }
        
        
        
    }

    render() {
        return (
            <div>
                <FormGroup>
                    <Label for='name'>Name</Label>
                    <Input
                        name='name'
                        id='name'
                        placeholder={this.state.formControls.name.placeholder}
                        value={this.state.formControls.name.value}
                        onChange={this.handleChange}
                        touched={this.state.formControls.name.touched ? 1 : 0}
                        valid={this.state.formControls.name.valid}
                        required
                    />
                    {this.state.formControls.name.touched && !this.state.formControls.name.valid &&
                        <div className="error-message">* Name must have at least 3 characters</div>}
                </FormGroup>

                <FormGroup>
                    <Label for='role'>Role</Label>
                    <Input
                        type="select"
                        name='role'
                        id='role'
                        placeholder={this.state.formControls.role.placeholder}
                        value={this.state.formControls.role.value}
                        onChange={this.handleChange}
                        touched={this.state.formControls.role.touched ? 1 : 0}
                        valid={this.state.formControls.role.valid}
                        required
                    >
                        <option value="" disabled>Select role...</option>
                        {this.state.formControls.role.options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.displayValue}
                            </option>
                        ))}
                    </Input>
                    {this.state.formControls.role.touched && !this.state.formControls.role.valid &&
                        <div className="error-message">* Role is required</div>}
                </FormGroup>

                <FormGroup>
                    <Label for='username'>Username</Label>
                    <Input
                        name='username'
                        id='username'
                        placeholder={this.state.formControls.username.placeholder}
                        value={this.state.formControls.username.value}
                        onChange={this.handleChange}
                        touched={this.state.formControls.username.touched ? 1 : 0}
                        valid={this.state.formControls.username.valid}
                        required
                    />
                    {this.state.formControls.username.touched && !this.state.formControls.username.valid &&
                        <div className="error-message">* Username must have at least 3 characters</div>}
                </FormGroup>

                <FormGroup>
                    <Label for='password'>Password</Label>
                    <Input
                        type="password"
                        name='password'
                        id='password'
                        placeholder={this.state.formControls.password.placeholder}
                        value={this.state.formControls.password.value}
                        onChange={this.handleChange}
                        touched={this.state.formControls.password.touched ? 1 : 0}
                        valid={this.state.formControls.password.valid}
                        required
                    />
                    {this.state.formControls.password.touched && !this.state.formControls.password.valid &&
                        <div className="error-message">* Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number</div>}
                </FormGroup>

                <Row>
                    <Col sm={{ size: '4', offset: 5 }}>
                        <Button type="submit" disabled={!this.state.formIsValid} onClick={this.handleSubmit}>Submit</Button>
                    </Col>
                </Row>

                {this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error} />}
            </div>
        );
    }
}

export default PersonForm;
