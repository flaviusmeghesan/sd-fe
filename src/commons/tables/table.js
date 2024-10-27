import React, { Component } from "react";
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Field from "./fields/Field";
import { Col, Row } from "react-bootstrap";

class Table extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            columns: props.columns,
            search: props.search || [], // Inițializează `search` ca array gol dacă nu este transmis prin `props`
            filters: [],
            getTrPropsFunction: props.getTrProps,
            pageSize: props.pageSize || 10,
        };
        
    }

    search() {
        // Funcționalitatea de căutare poate fi implementată aici, dacă este necesară
    }

    filter(data) {
        return this.state.filters.every(val => {
            // Filtrare pe baza fiecărui filtru aplicat
            if (String(val.value) === "") return true;
            return String(data[val.accessor]).includes(String(val.value)) || 
                   String(val.value).includes(String(data[val.accessor]));
        });
    }

    handleChange(value, index, header) {
        const updatedFilters = [...this.state.filters];
        updatedFilters[index] = {
            value: value.target.value,
            accessor: header
        };

        this.setState({ filters: updatedFilters });
    }

    getTRPropsType(state, rowInfo) {
        return rowInfo
            ? { style: { textAlign: "center" } }
            : {};
    }

    render() {
        // Filtrează datele în funcție de `filter`
        const filteredData = this.state.data ? this.state.data.filter(data => this.filter(data)) : [];

        return (
            <div>
                <Row>
                    {this.state.search.length > 0 && this.state.search.map((header, index) => (
                        <Col key={index}>
                            <Field
                                id={header.accessor}
                                label={header.accessor}
                                onChange={(e) => this.handleChange(e, index, header.accessor)}
                            />
                        </Col>
                    ))}
                </Row>
                <Row>
                    <Col>
                        <ReactTable
                            data={filteredData}
                            resolveData={data => data.map(row => row)}
                            columns={this.state.columns}
                            defaultPageSize={this.state.pageSize}
                            getTrProps={this.getTRPropsType}
                            showPagination={true}
                            style={{
                                height: '300px'
                            }}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Table;
