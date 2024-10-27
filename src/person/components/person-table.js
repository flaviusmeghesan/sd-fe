import React from "react";
import Table from "../../commons/tables/table";
import * as API_USERS from "../api/person-api";
import '../../commons/styles/project-style.css';

const columns = (handleEdit, handleDelete) => [
    {
        Header: 'Name',
        accessor: 'name', // Ensure this matches backend's PersonDTO field
    },
    {
        Header: 'Role',
        accessor: 'role',
    },
    {
        Header: 'Username',
        accessor: 'username',
    },
    {
        Header: 'Assigned Devices',
        accessor: 'assigned_device_id',
    },
    {
        Header: 'Actions',
        Cell: ({ row }) => (
            <div>
                <button className="edit-button" onClick={() => handleEdit(row._original.id)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(row._original.id)}>Delete</button>
            </div>
        )
    }
];

// Define filters array for "name" filter
const filters = [
    {
        accessor: 'name',
    }
];

class PersonTable extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    handleEdit(personId) {
        const selectedPerson = this.props.tableData.find(person => person.id === personId);
        if (this.props.onEdit) {
            this.props.onEdit(selectedPerson);
        }
    }

    handleDelete(personId) {
        API_USERS.deletePerson(personId, (result, status, err) => {
            if (status === 200) {
                this.props.refreshTableData(); // Reload table data after deletion
            } else {
                console.error("Failed to delete person:", err);
            }
        });
    }

    render() {
        return (
            <Table
                data={this.props.tableData}
                columns={columns(this.handleEdit, this.handleDelete)}
                search={filters} // Apply name filter here
                pageSize={5}
            />
        );
    }
}

export default PersonTable;
