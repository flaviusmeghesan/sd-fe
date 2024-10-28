import React, { Component } from 'react';
import { Card, CardHeader, Col, Row } from 'reactstrap';
import * as API_DEVICES from "./api/device-api";
import DeviceTable from "./components/device-table";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";

class ClientDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceTableData: [],
            isLoadedDevices: false,
            errorStatus: 0,
            error: null,
        };
    }

    componentDidMount() {
        const storedData = localStorage.getItem('deviceTableData');
        if (storedData) {
            this.setState({
                deviceTableData: JSON.parse(storedData),
                isLoadedDevices: true,
            });
        } else {
            this.fetchAssignedDevices();
        }
    }
    

//    fetchAssignedDevices = () => {
//     const user_id = this.props.user_id; // Retrieve user_id from props (or state/context)

//     API_DEVICES.getAssignedDevices2(user_id, (data, status, error) => { // Pass user_id to the function
//         if (status === 200) {
//             // Handle successful data fetching
//             console.log("Devices:", data);
//             this.setState({
//                 deviceTableData: data,
//                 isLoadedDevices: true,
//                 errorStatus: 0,
//                 error: null
//             });
//         } else {
//             console.error("Error fetching devices:", error);
//             this.setState({
//                 isLoadedDevices: true,
//                 errorStatus: status,
//                 error: error
//             });
//         }
//     });
// };

fetchAssignedDevices = () => {
    const user_id = this.props.userId; // Retrieve user_id from props (or state/context)

    API_DEVICES.getAssignedDevices3(user_id, (data, status, error) => { // Pass user_id to the function
        if (status === 200) {
            // Handle successful data fetching
            console.log("Devices:", data);
            this.setState({
                deviceTableData: data,
                isLoadedDevices: true,
                errorStatus: 0,
                error: null
            });
        } else {
            console.error("Error fetching devices:", error);
            this.setState({
                isLoadedDevices: true,
                errorStatus: status,
                error: error
            });
        }
    });
};


    render() {
        return (
            <div>
                <CardHeader>
                    <strong>Devices Assigned to You</strong>
                </CardHeader>
                <Card>
                    <br />
                    <Row>
                    <Col sm={{size: '8', offset: 1}}>
                            {this.state.isLoadedDevices && (
                                <DeviceTable
                                    tableData={this.state.deviceTableData}
                                    onEdit={this.onEditDevice}
                                    reload={this.reloadDevices}
                                    showActions={false} // Afișează coloana "Actions" doar aici
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
                </Card>
            </div>
        );
    }
}

export default ClientDashboard;
