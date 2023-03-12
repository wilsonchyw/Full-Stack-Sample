import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
const col = ["id", "title", "forum", "created", "author","tags","isDailyDiscussion","ROWNUM_"];
export default function Stock() {
    const [datas, setData] = useState([]);
    const [page, setPage] = useState(0);

    const fetchData = () => {
        axios({
            url: "https://api.rtrend.site/api/thread/page",
            params: {
                page: page,
                pageSize: 100,
            },
        })
            .then(({ data }) => {
                console.log(data)
                setData(data)})
            .catch((err) => console.log(err));
    };

    const handlePageChange = (n) => {
        if (page + n < 0) n = 0;
        setPage(page + n);
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    return (
        <Card className="p-2 m-2">
            <Row>
                <Col>
                    <Button onClick={() => handlePageChange(-1)}>Pre</Button>
                </Col>
                <Col>Page {page}</Col>
                <Col>
                    <Button onClick={() => handlePageChange(1)}>Next</Button>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {col.map((k) => (
                            <th key={k}>{k}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {datas.map((data) => (
                        <tr key={data.id }>
                            {col.map((k) => (
                                <td>{data[k]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card>
    );
}
