import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Button, Container, Form, Pagination, Table, Col, Row } from "react-bootstrap";

function App() {
    const [url, setUrl] = useState("http://api.rtrend.site:3003/api");
    const [method, setMethod] = useState("GET");
    const [body, setBody] = useState("");
    const [data, setData] = useState([]);
    const [rawData , setRawData] = useState("")
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleUrlChange = (event) => {
        setUrl(event.target.value);
    };

    const handleMethodChange = (event) => {
        setMethod(event.target.value);
    };

    const handleBodyChange = (event) => {
        setBody(event.target.value);
    };

    const handleFetchClick = async () => {
        try {
            setRawData("")
            const option = {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Nzk4NzQ0NjUsImRhdGEiOiJmb29iYXIiLCJpYXQiOjE2Nzk3MDMzNzB9.ZNjAXq--l2qSnwX-bSbZeMWOxWVWDJeFt4aKKMOzAH0",
                },
            };
            let _url = url;
            if (method == "GET" && body) {
                _url += "?" + new URLSearchParams(JSON.parse(body));
            }
            if (method != "GET" && body) {
                option.body = JSON.stringify(JSON.parse(body));
            }
            console.log({ _url });
            const response = await fetch(_url, option);

            const json = await response.json();
            console.log(json);

            if (method == "GET") {
                setData(json);
                setTotalPages(Math.ceil(json.length / 50));
                setPage(1);
            }else{
                setRawData(json)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePageClick = (pageNumber) => {
        setPage(pageNumber);
    };

    const handleRowClick = (value) => {
        handleBodyChange({ target: { value: JSON.stringify(value) } });
    };

    const tableHeaders = Object.keys(data[0] || {});
    const startIndex = (page - 1) * 50;
    const endIndex = startIndex + 50;
    const pageData = !Array.isArray(data) ? data : data.slice(startIndex, endIndex);

    return (
        <div className="mx-4">
            <JsonInput/>
            <Input
                url={url}
                method={method}
                body={body}
                handleUrlChange={handleUrlChange}
                handleMethodChange={handleMethodChange}
                handleBodyChange={handleBodyChange}
                handleFetchClick={handleFetchClick}
            />
            <Row>
                {rawData? (
                    <SimpleComponent data={rawData} />
                ) : (
                    pageData.length > 0 && (
                        <TableComponent tableHeaders={tableHeaders} pageData={pageData} totalPages={totalPages} page={page} handlePageClick={handlePageClick} handleRowClick={handleRowClick} />
                    )
                )}
            </Row>
        </div>
    );
}

function SimpleComponent(data) {
    return <div>{JSON.stringify(data)}</div>;
}

function Input({ url, method, body, handleUrlChange, handleMethodChange, handleBodyChange, handleFetchClick }) {
    return (
        <Form>
            <Form.Group>
                <Form.Label>URL</Form.Label>
                <Form.Control type="text" placeholder="Enter URL" value={url} onChange={handleUrlChange} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Method</Form.Label>
                <Form.Control as="select" value={method} onChange={handleMethodChange}>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Request Body/Params</Form.Label>
                <Form.Control as="textarea" rows={3} value={body} onChange={handleBodyChange} />
            </Form.Group>
            <Button variant="primary" onClick={handleFetchClick}>
                Fetch
            </Button>
        </Form>
    );
}

function TableComponent({ tableHeaders, pageData, totalPages, page, handlePageClick, handleRowClick }) {
    const startIndex = (page - 1) * 50;

    return (
        <Col>
            {pageData.length > 0 && (
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            {tableHeaders.map((header) => (
                                <th key={header}>{header}</th>
                            ))}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.map((row, index) => (
                            <tr key={index}>
                                {tableHeaders.map((header) => (
                                    <td key={header}>{row[header]}</td>
                                ))}
                                <td>
                                    <Button onClick={() => handleRowClick(row)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            {totalPages > 1 && (
                <Pagination>
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item key={index} active={index + 1 === page} onClick={() => handlePageClick(index + 1)}>
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            )}
        </Col>
    );
}

function JsonInput() {
    const [json, setJson] = useState([{ key: '', value: '' }]);
  
    const handleAddClick = () => {
      setJson(prevState => ([...prevState, { key: '', value: '' }]));
    };
  
    const handleInputChange = (event, index, key) => {
      const value = event.target.value;
      const newJson = [...json];
      newJson[index][key] = value;
      setJson(newJson);
    };
  
    const handleDeleteClick = (index) => {
      setJson(prevState => prevState.filter((_, i) => i !== index));
    };
  
    const renderInputs = () => {
      return json.map((item, index) => (
        <Form.Group as={Row} key={index}>
          <Col>
            <Form.Control type="text" placeholder="Key" value={item.key} onChange={e => handleInputChange(e, index, 'key')} />
          </Col>
          <Col>
            <Form.Control type="text" placeholder="Value" value={item.value} onChange={e => handleInputChange(e, index, 'value')} />
          </Col>
          <Col md="auto">
            <Button variant="danger" onClick={() => handleDeleteClick(index)}>Delete</Button>
          </Col>
        </Form.Group>
      ));
    };
  
    return (
      <Form>
        {renderInputs()}
        <Button variant="primary" onClick={handleAddClick}>Add Key-Value Pair</Button>
        <Form.Group>
          <Form.Control as="textarea" rows={6} value={JSON.stringify(Object.fromEntries(json.map(({ key, value }) => [key, value])), null, 2)} readOnly />
        </Form.Group>
      </Form>
    );
  }


export default App;
/**
 {
  "symbol": "test",
  "date": "2023-03-25T01:15:00.216Z",
  "threads": "[]",
  "counter": "0",
  "verb": "[]"
}
 */