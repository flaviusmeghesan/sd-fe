import React from 'react';
import Button from "react-bootstrap/Button";
import * as API_DEVICES from "../api/device-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import { Col, Row, FormGroup, Input, Label } from "reactstrap";
import { validate } from "./validators/device-validations";

class DeviceForm extends React.Component {

    constructor(props) {
        super(props);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {
            errorStatus: 0,
            error: null,
            formIsValid: false,
            formControls: {
                description: {
                    value: '',
                    placeholder: 'Device Description...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 5,
                        isRequired: true
                    }
                },
                address: {
                    value: '',
                    placeholder: 'Device Address...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        isRequired: true
                    }
                },
                maxHourlyEnergyConsumption: {
                    value: '',
                    placeholder: 'Maximum Hourly Energy Consumption (kWh)...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        isRequired: true,
                        isNumeric: true
                    }
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.device) {
            const { description, address, maxHourlyEnergyConsumption } = this.props.device;
            this.setState({
                formControls: {
                    ...this.state.formControls,
                    description: { ...this.state.formControls.description, value: description, valid: true },
                    address: { ...this.state.formControls.address, value: address, valid: true },
                    maxHourlyEnergyConsumption: { ...this.state.formControls.maxHourlyEnergyConsumption, value: maxHourlyEnergyConsumption, valid: true }
                },
                formIsValid: true
            });
        }
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

    registerDevice(device) {
        return API_DEVICES.postDevice(device, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                this.reloadHandler();
                this.props.toggle(); // Close modal after successful add
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

    updateDevice(device) {
        return API_DEVICES.updateDevice(this.props.device.id, device, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                this.reloadHandler();
                this.props.toggle(); // Close modal after successful update
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
        const device = {
            description: this.state.formControls.description.value,
            address: this.state.formControls.address.value,
            maxHourlyEnergyConsumption: parseFloat(this.state.formControls.maxHourlyEnergyConsumption.value)
        };
    
        if (this.props.device) {
            this.updateDevice(device);
        } else {
            this.registerDevice(device);
        }
    }    

    render() {
        return (
            <div>
                <FormGroup id='description'>
                    <Label for='descriptionField'> Description: </Label>
                    <Input name='description' id='descriptionField' placeholder={this.state.formControls.description.placeholder}
                           onChange={this.handleChange}
                           value={this.state.formControls.description.value}
                           touched={this.state.formControls.description.touched ? 1 : 0}
                           valid={this.state.formControls.description.valid}
                           required
                    />
                    {this.state.formControls.description.touched && !this.state.formControls.description.valid &&
                        <div className={"error-message"}> * Description must have at least 5 characters </div>}
                </FormGroup>

                <FormGroup id='address'>
                    <Label for='addressField'> Address: </Label>
                    <Input name='address' id='addressField' placeholder={this.state.formControls.address.placeholder}
                           onChange={this.handleChange}
                           value={this.state.formControls.address.value}
                           touched={this.state.formControls.address.touched ? 1 : 0}
                           valid={this.state.formControls.address.valid}
                           required
                    />
                    {this.state.formControls.address.touched && !this.state.formControls.address.valid &&
                        <div className={"error-message"}> * Address is required</div>}
                </FormGroup>

                <FormGroup id='maxHourlyEnergyConsumption'>
                    <Label for='maxHourlyEnergyConsumptionField'> Maximum Hourly Consumption (kWh): </Label>
                    <Input type="number" name='maxHourlyEnergyConsumption' id='maxHourlyEnergyConsumptionField'
                           placeholder={this.state.formControls.maxHourlyEnergyConsumption.placeholder}
                           onChange={this.handleChange}
                           value={this.state.formControls.maxHourlyEnergyConsumption.value}
                           touched={this.state.formControls.maxHourlyEnergyConsumption.touched ? 1 : 0}
                           valid={this.state.formControls.maxHourlyEnergyConsumption.valid}
                           required
                    />
                    {this.state.formControls.maxHourlyEnergyConsumption.touched && !this.state.formControls.maxHourlyEnergyConsumption.valid &&
                        <div className={"error-message"}> * Maximum hourly consumption must be a valid number </div>}
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

export default DeviceForm;
