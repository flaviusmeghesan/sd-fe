import React from "react";
import Table from "../../commons/tables/table";
import * as API_USERS from "../api/person-api";
import '../../commons/styles/project-style.css';

const columns = (handleEdit, handleDelete) => [
    {
        Header: 'Name',
        accessor: 'name',
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
        Header: 'Actions',
        Cell: ({ row }) => (
            <div>
                <button className="edit-button" onClick={() => handleEdit(row._original.id)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(row._original.id)}>Delete</button>
            </div>
        )
    }
];

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

    handleDelete(personId) {
        API_USERS.deletePerson(personId, (result, status, err) => {
            if (status === 200) {
                // Notify the parent to reload the table data after a successful deletion
                window.location.reload();
                //this.props.reload();  // Trigger the reload in the parent
            } else {
                console.error("Failed to delete person:", err);
            }
        });
    }
    
    handleEdit(personId) {
        const selectedPerson = this.props.tableData.find(person => person.id === personId);
        this.props.onEdit(selectedPerson);
    }

    render() {
        return (
            <Table
                data={this.props.tableData}
                columns={columns(this.handleEdit, this.handleDelete)}
                search={filters}
                pageSize={5}
            />
        );
    }
}

export default PersonTable;