import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import * as API_DEVICES from '../api/device-api';
import { assignDeviceToUser } from '../api/device-api'; // Import the assignDeviceToUser function

const MapDeviceForm = ({ person, toggle }) => {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState('');

    useEffect(() => {
        API_DEVICES.getDevices((data, status) => {
            if (status === 200) setDevices(data);
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedDevice && person) { // Ensure person is defined
            assignDeviceToUser(person.id, selectedDevice, (response, status, error) => {
                if (status === 200) {
                    console.log(response.message); // Log success message
                    toggle(); // Close modal on success
                } else {
                    console.error("Failed to assign device:", error);
                    alert("Failed to assign device. Please try again.");
                }
            });
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label for="deviceSelect">Select Device</Label>
                <Input
                    type="select"
                    name="device"
                    id="deviceSelect"
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                >
                    <option value="">-- Select Device --</option>
                    {devices.map(device => (
                        <option key={device.id} value={device.id}>
                            {device.id} - {device.description}
                        </option>
                    ))}
                </Input>
            </FormGroup>
            <Button color="primary" type="submit" disabled={!selectedDevice || !person}>
                Map Device to {person ? person.name : 'User'}
            </Button>
        </Form>
    );
};

export default MapDeviceForm;
