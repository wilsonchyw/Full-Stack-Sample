import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import RegForm from "../component/regForm";

const defaultState = {
    id: null,
    name: null,
    email: null,
    department: null,
    employment: null,
    document: null,
};
export default function Home() {
    const [employee, setEmployee] = useState(defaultState);
    const [msg,setMsg] = useState([])

    const handleInputChange = (event) => {
        const target = event.target;
        const value = event.target.files && event.target.files[0] ? target.files[0] : target.value;
        const name = target.name;

        setEmployee((employee) => ({ ...employee, [name]: value }));
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        setMsg([])
        let vaild = true
        let e = []
        const body = new FormData();
        for (let key in employee) {
            if(employee[key]==null){
                vaild=false
                e.push({type:'error',msg:`${key} is required`})
            }
            body.append(key, employee[key]);
        }

        if(!vaild) return setMsg(e)

        axios
            .post("/api/employee", body, {
                headers: { "Content-Type": "multipart/form-data" },
                params: {
                    id: employee.id,
                },
            })
            .then(({ data }) => setMsg([{type:'normal',msg:'Submit success'}]));
    };
    return (
        <Card className="w-75 mx-auto mt-3">
            <Card.Header>Employees submission</Card.Header>
            <RegForm employee={employee} handleInputChange={handleInputChange} handleSubmit={handleSubmit} msg={msg} />
        </Card>
    );
}
