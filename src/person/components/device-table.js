import React from "react";
import Table from "../../commons/tables/table";
import * as API_DEVICES from "../api/device-api";
import '../../commons/styles/project-style.css';

const columns = (handleEdit, handleDelete, showActions) => {
    const baseColumns = [
        {
            Header: 'Devices ID',
            accessor: 'id',
        },
        {
            Header: 'Description',
            accessor: 'description',
        },
        {
            Header: 'Address',
            accessor: 'address',
        },
        
        
        {
            Header: 'Max Hourly Consumption (kWh)',
            accessor: 'maxHourlyEnergyConsumption',
            Cell: ({ value }) => value.toFixed(2),
        }
    ];

    // Only add Actions column if showActions is true
    if (showActions) {
        baseColumns.push({
            Header: 'Actions',
            Cell: ({ row }) => (
                <div>
                    <button className="edit-button" onClick={() => handleEdit(row._original.id)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(row._original.id)}>Delete</button>
                </div>
            )
        });
    }

    return baseColumns;
};

const filters = [
    {
        accessor: 'description',
    }
];

class DeviceTable extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    handleDelete(deviceId) {
        API_DEVICES.deleteDevice(deviceId, (result, status, err) => {
            if (status === 200) {
                this.props.reload(); // Refresh table data after deletion
            } else {
                console.error("Failed to delete device:", err.message || err); // Provide specific error message
                alert(err.message || "Failed to delete device. Please try again."); // Alert the user with a relevant message
            }
        });
    }

    handleEdit(deviceId) {
        const selectedDevice = this.props.tableData.find(device => device.id === deviceId);
        if (this.props.onEdit) {
            this.props.onEdit(selectedDevice); // Calls the correctly bound `onEdit` function
        }
    }

    render() {
        return (
            <Table
                data={this.props.tableData}
                columns={columns(this.handleEdit, this.handleDelete, this.props.showActions)}
                search={filters}
                pageSize={5}
            />
        );
    }
}


export default DeviceTable;
