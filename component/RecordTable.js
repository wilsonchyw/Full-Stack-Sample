import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
const ROWCOUNT = 18;
export default function RecordTable({ info, datas, handleNotSelected }) {
    const filterCallback = (i)=>{
        
        const {company,position} = info
        if(!company && !position) return true
        return i.company.toLowerCase().includes(company.toLowerCase()) || (i.company.toLowerCase().includes(company.toLowerCase()) && i.position.toLowerCase()== position)
    }
    const dataDisplay = datas
        .filter(filterCallback)
        .reverse();
    const [page, setPage] = useState(0);
    return (
        <Card className="w-100 p-2 mx-auto m-3">
            <Col className="my-2 d-flex justify-content-between">
                <Button onClick={() => setPage((pre) => (pre > 0 ? pre - 1 : pre))}>Pre</Button>
                <div className="my-auto">
                    {dataDisplay.length} Jobs Page {page}/{Math.ceil(dataDisplay.length / ROWCOUNT)}
                </div>
                <Button onClick={() => setPage((pre) => (page < Math.ceil(dataDisplay.length / ROWCOUNT) ? pre + 1 : pre))}>Next</Button>
            </Col>

            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Company</th>
                        <th>Position</th>
                    </tr>
                </thead>
                <tbody>
                    {dataDisplay.slice(page * ROWCOUNT, page * ROWCOUNT + ROWCOUNT).map((i) => (
                        <tr key={i.company + i.position + i.date} style={{ backgroundColor: i.notSelected ? "rgba(255, 99, 71, 0.5)" : "" }}>
                            <td>{i.date}</td>
                            <td>{i.company}</td>
                            <td>{i.position}</td>
                            <td>
                                <button type="button" class="btn btn-danger btn-sm" onClick={() => handleNotSelected(i)}>
                                    X
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card>
    );
}
