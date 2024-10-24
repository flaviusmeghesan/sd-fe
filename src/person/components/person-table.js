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
                <button className="edit-button" onClick={() => handleEdit(row.original.id)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(row.original.id)}>Delete</button>
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
        this.state = {
            tableData: this.props.tableData
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    handleDelete(personId) {
        API_USERS.deletePerson(personId, (result, status, err) => {
            if (status === 200) {
                this.setState({
                    tableData: this.state.tableData.filter(person => person.id !== personId)
                });
            } else {
                console.error("Failed to delete person:", err);
            }
        });
    }

    handleEdit(personId) {
        // Implement the edit functionality here
        console.log("Edit person with id:", personId);
    }

    render() {
        return (
            <Table
                data={this.state.tableData}
                columns={columns(this.handleEdit, this.handleDelete)}
                search={filters}
                pageSize={5}
            />
        )
    }
}

export default PersonTable;