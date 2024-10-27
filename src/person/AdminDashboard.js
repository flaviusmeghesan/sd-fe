import React from 'react';
import { Button, Card, CardHeader, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import PersonForm from "./components/person-form";
import DeviceForm from "./components/device-form";
import * as API_USERS from "./api/person-api";
import * as API_DEVICES from "./api/device-api";
import PersonTable from "./components/person-table";
import DeviceTable from "./components/device-table";

class AdminDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.togglePersonForm = this.togglePersonForm.bind(this);
        this.toggleDeviceForm = this.toggleDeviceForm.bind(this);
        this.reloadPersons = this.reloadPersons.bind(this);
        this.reloadDevices = this.reloadDevices.bind(this);
        this.fetchPersons = this.fetchPersons.bind(this);
        this.fetchDevices = this.fetchDevices.bind(this);
        
        // Bind both edit methods here
        this.onEditPerson = this.onEditPerson.bind(this);
        this.onEditDevice = this.onEditDevice.bind(this);

        this.state = {
            showPersonForm: false,
            showDeviceForm: false,
            isAuthenticated: false,
            tableDataPersons: [],
            tableDataDevices: [],
            isLoadedPersons: false,
            isLoadedDevices: false,
            errorStatus: 0,
            error: null,
            personToEdit: null,
            deviceToEdit: null,
        };
    }

    componentDidMount() {
        this.checkAuthenticationAndFetchData();
    }

    checkAuthenticationAndFetchData() {
        API_USERS.getCurrentUser((user, status, err) => {
            if (status === 200 && user) {
                this.setState({ isAuthenticated: true });
                this.fetchPersons();
                this.fetchDevices();
            } else {
                this.setState({
                    isAuthenticated: false,
                    errorStatus: status,
                    error: "User not authenticated. Please log in.",
                });
            }
        });
    }

    fetchPersons() {
        API_USERS.getPersons((data, status, err) => {
            if (status === 200) {
                this.setState({
                    tableDataPersons: data,
                    isLoadedPersons: true,
                    errorStatus: 0,
                    error: null,
                });
            } else {
                this.setState({
                    isLoadedPersons: true,
                    errorStatus: status,
                    error: err,
                });
            }
        });
    }

    fetchDevices() {
        API_DEVICES.getDevices((data, status, err) => {
            if (status === 200) {
                this.setState({
                    tableDataDevices: data,
                    isLoadedDevices: true,
                    errorStatus: 0,
                    error: null,
                });
            } else {
                this.setState({
                    isLoadedDevices: true,
                    errorStatus: status,
                    error: err,
                });
            }
        });
    }

    togglePersonForm() {
        this.setState(prevState => ({
            showPersonForm: !prevState.showPersonForm,
            personToEdit: null,
        }));
        if (this.state.showPersonForm) {
            this.reloadPersons();
        }
    }

    toggleDeviceForm() {
        this.setState(prevState => ({
            showDeviceForm: !prevState.showDeviceForm,
            deviceToEdit: null,
        }));
        if (this.state.showDeviceForm) {
            this.reloadDevices();
        }
    }

    reloadPersons() {
        this.setState({ isLoadedPersons: false });
        this.fetchPersons();
    }

    reloadDevices() {
        this.setState({ isLoadedDevices: false });
        this.fetchDevices();
    }

    onEditPerson(person) {
        this.setState({
            showPersonForm: true,
            personToEdit: person,
        });
    }

    onEditDevice(device) {
        this.setState({
            showDeviceForm: true,
            deviceToEdit: device,
        });
    }

    render() {
        return (
            <div>
                <CardHeader>
                    <strong>Person and Device Management</strong>
                </CardHeader>
                <Card>
                    <br /> {/* Space above person button */}
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            <Button color="primary" onClick={this.togglePersonForm}>Add Person</Button>
                        </Col>
                    </Row>
                    <br /> {/* Space between button and table */}
                    <Row>
                        <Col sm={{ size: '8', offset: 1 }}>
                            {this.state.isLoadedPersons && (
                                <PersonTable
                                    tableData={this.state.tableDataPersons}
                                    onEdit={this.onEditPerson}
                                    refreshTableData={this.reloadPersons}
                                />
                            )}
                            {this.state.errorStatus > 0 && (
                                <APIResponseErrorMessage
                                    errorStatus={this.state.errorStatus}
                                    error={this.state.error}
                                />
                            )}
                        </Col>
                    </Row>
                    <br /> {/* Space between person and device sections */}
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            <Button color="primary" onClick={this.toggleDeviceForm}>Add Device</Button>
                        </Col>
                    </Row>
                    <br /> {/* Space between button and table */}
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            {this.state.isLoadedDevices && (
                                <DeviceTable
                                    tableData={this.state.tableDataDevices}
                                    onEdit={this.onEditDevice}
                                    reload={this.reloadDevices}
                                    showActions={true}
                                />
                            )}
                            {this.state.errorStatus > 0 && (
                                <APIResponseErrorMessage
                                    errorStatus={this.state.errorStatus}
                                    error={this.state.error}
                                />
                            )}
                        </Col>
                    </Row>
                    <Col>
                    <Col sm={{size: '8', offset: 1}}>
                            <Button color="secondary" onClick={this.toggleDeviceForm}>Map device to user</Button>
                        </Col>
                    </Col>
                </Card>

                {/* Person Form Modal */}
                <Modal isOpen={this.state.showPersonForm} toggle={this.togglePersonForm} size="lg">
                    <ModalHeader toggle={this.togglePersonForm}>
                        {this.state.personToEdit ? 'Edit Person' : 'Add Person'}
                    </ModalHeader>
                    <ModalBody>
                        <PersonForm
                            refreshTableData={this.reloadPersons}
                            person={this.state.personToEdit}
                            toggle={this.togglePersonForm}
                        />
                    </ModalBody>
                </Modal>

                {/* Device Form Modal */}
                <Modal isOpen={this.state.showDeviceForm} toggle={this.toggleDeviceForm} size="lg">
                    <ModalHeader toggle={this.toggleDeviceForm}>
                        {this.state.deviceToEdit ? 'Edit Device' : 'Add Device'}
                    </ModalHeader>
                    <ModalBody>
                        <DeviceForm
                            reloadHandler={this.reloadDevices}
                            device={this.state.deviceToEdit}
                            toggle={this.toggleDeviceForm}
                        />
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default AdminDashboard;
