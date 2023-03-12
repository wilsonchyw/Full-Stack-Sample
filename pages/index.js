import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { jsPDF } from "jspdf";
import React, { useMemo, useRef, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import ToggleButton from "react-bootstrap/ToggleButton";
import RecordTable from "../component/RecordTable";
import { getData } from "./api/record";
import { useRouter } from 'next/router';

const defaultState = {
    position: "",
    company: "",
};

const clipboard = [
    { text: "First Name", value: "Wilson" },
    { text: "Full Name", value: "Wilson Yip" },
    { text: "Phone", value: "236-518-2307" },
    { text: "Email", value: "wilson.chyw@gmail.com" },
    { text: "Linkedin", value: "https://linkedin.com/in/wilsonchyw" },
    { text: "Portfolio", value: "https://portfolio.vocabsitory.site" },
    { text: "Github", value: "https://github.com/wilsonchyw" },
    { text: "Address", value: "8199 Capstan Way" },
    { text: "Postal", value: "V6X 0V1" },
    { text: "password", value: "!Wewe2001" },
];

export default function Home({ localData }) {
    const router = useRouter();
    const pdfRef = useRef(null);
    const [info, setInfo] = useState(defaultState);
    const [alert, setAlert] = useState(false);
    const [applied, setAplied] = useState(null);
    const [radioValue, setRadioValue] = useState(0);
    const wd = `Dear Hiring Manager,

I am writing to apply for the ${info.position} position at ${info.company}. I am excited about the opportunity to join your team and contribute my skills and experience to your organization.

With a Bachelor's degree in Computing and over 2 years of web development experience, I am confident in my ability to succeed in this role. My background in sales and customer service has also taught me the importance of communication and collaboration, which are crucial skills for a developer.

In addition to my professional experience, I am also passionate about coding and interested in building side projects during my after-work time. Most of them come from a problem I want to solve, and it is by solving that problem that I develop and improve my programming knowledge. For example, in one of my projects "Reddit Trending tracker", I learned about web scraping, frontend/backend framework, and different design patterns. I enjoy solving difficult problems because I can always learn from them. Coding is something I am passionate about, which reflects my decision for applying for this position.

I am eager to bring my skills and passion to ${info.company} and contribute to the success of your team. Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your organization further.

Sincerely,
Wilson Yip`;
    const support = `Dear Hiring Manager,

I am writing to apply for the ${info.position} position at ${info.company}. With a First Class Honors Bachelor’s degree in computing, diverse skills, and professional experience, I believe that I am a good fit for this position.

Throughout my previous work experience and education, I’ve become equipped with the necessary knowledge that come with the position, in both tech knowledges and soft skills. I am always looking for self-improvement and willing to learn new knowledges. The degree was studied during my after-work time.

Over the years, I specialized in helping customers resolve a wide variety of issues. I have accumulated lots of experience in sales and customer service, making me a good communicator. I learned interpersonal and communication skills by dealing with customers daily. My desire to improve will motivate my teammates to constantly strive and my interpersonal skills will help me to get along well with anyone in a team. So I confidently believe that I will bring you a great teammate that could help your team achieve a higher goal.

I appreciate your time, attention, and kindness in considering me for this position. Applying for this position would not only allow me to exert my strength, but it would also allow me to learn new knowledge from the talented and bright people in ${info.company}. It is a precious opportunity for me to work as part of the team in your company.

Regards,
Wilson Yip`;

    const cs = `Dear Hiring Manager,

I am writing to apply for the ${info.position} position at ${info.company}. With six years of customer service and two years of B2B sales experience. I am confident in my ability to excel in this role.

In my previous customer service roles, I have consistently demonstrated my ability to communicate effectively with court user, resolve issues efficiently, and maintain a positive and professional demeanor. I have also gained a wealth of experience working in a high-stress, fast-paced environment, which has allowed me to develop strong problem-solving skills and the ability to multitask effectively.

In addition to my customer service experience, I also have two years of sales experience, which has taught me the importance of attention to detail, organization, and the ability to work under tight deadlines. These skills, combined with my strong work ethic and dedication to meeting the needs of my clients, make me an ideal candidate for this position.

I am excited about the opportunity to join the team at ${info.company} and contribute my skills and experience to support the success of the organization. Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your organization further.

Sincerely,
Wilson Yip`;

    const title = `Job application: ${info.position} - Wilson Yip`;
    const letter = [
        { name: "Web developer", value: 0, content: wd },
        { name: "Support", value: 1, content: support },
        { name: "cs", value: 2, content: cs },
    ];

    const [coverLetter, setLetter] = useState(wd);
    const [showHeader, setHeader] = useState(true);

    function downloadPDF(s) {
        const content = pdfRef.current;
        const doc = new jsPDF("p", "pt", "a4");
        doc.html(content, {
            callback: function (doc) {
                doc.internal.write(0, "Tw");
                doc.save("Wilson Yip - Cover Letter.pdf");
                //doc.output('dataurlnewwindow');
            },
            width: 500, // <- here
            windowWidth: 600, // <- here
            margin: 50,
        });
    }

    const handleCopy = (s) => {
        console.log({s})
        window.getSelection().removeAllRanges();
        const textArea = document.createElement("textarea");
        textArea.value = s;
        document.body.appendChild(textArea);
        textArea.click()
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        setAlert(true);
        setTimeout(() => setAlert(false), 1000);
        document.body.removeChild(textArea);
        window.getSelection().removeAllRanges();
    };

    const handleTrim = (event)=>{
        const target = event.target;
        const value = event.target.files && event.target.files[0] ? target.files[0] : target.value;
        const name = target.name;
        setInfo((data) => ({ ...data, [name]: value.trim() }));
    }

    const handleInputChange = (event) => {
        const target = event.target;
        const value = event.target.files && event.target.files[0] ? target.files[0] : target.value;
        const name = target.name;
        const valueFormated = value.split(" ").map(s=>s.slice(0,1).toUpperCase() + s.slice(1).toLowerCase()).join(" ")
        setInfo((data) => ({ ...data, [name]: valueFormated }));
    };

    const handleContentCopy = () => {
        if(!info.company || ! info.position) return window.alert("No company or position")
        window.getSelection().removeAllRanges();
        var urlField = document.getElementById("cardBody");
        var range = document.createRange();
        range.selectNodeContents(urlField);
        window.getSelection().addRange(range);
        document.execCommand("copy");
        setAlert(true);
        setTimeout(() => setAlert(false), 1000);
        window.getSelection().removeAllRanges();
    };

    const copyTable = () => {
        var urlField = document.getElementById("test");
        var range = document.createRange();
        range.selectNodeContents(urlField);
        window.getSelection().addRange(range);
        document.execCommand("copy");
        setAlert(true);
        setTimeout(() => setAlert(false), 1000);
        window.getSelection().removeAllRanges();
    };

    const disPlayContent = () => {
        console.log("disPlayContent", radioValue);
        return letter[radioValue].content;
    };

    const handleNotSelected = (job)=>{
        axios
                .put("/api/record",job)
                .then((res) => {
                    console.log(res);
                    console.log("success")
                    router.replace(router.asPath);
                })
                .catch((err) => {
                    console.log(err);
                });
    }

    const save = () => {
        const lastRecord = localData.at(-1);
        if (!lastRecord || (lastRecord.position != info.position && lastRecord.company != info.company)) {
            //localData.push({ date: new Date().toLocaleDateString(), position: info.position, company: info.company });
            axios
                .post("/api/record", { date: new Date().toLocaleDateString(), position: info.position, company: info.company })
                .then((res) => {
                    console.log(res);
                    console.log("success")
                    router.replace(router.asPath);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        //localStorage.setItem("record", JSON.stringify(localData));
    };

    useMemo(() => {
        const result = localData.find((d) => d.position == info.position && d.company == info.company);
        console.log(result);
        setAplied(result);
    }, [info.position, info.company]);

    const [searchTarget, setTarget] = useState("");

    const header = (
        <div>
            Wilson Yip
            <br />
            (236) 518-2307
            <br />
            <a href="mailto: wilson.chyw@gmail.com">wilson.chyw@gmail.com</a>
            <br />
            <a href="https://linkedin.com/in/wilsonchyw">linkedin.com/in/wilsonchyw</a>
            <br />
            {radioValue != 2 && <a href="https://portfolio.vocabsitory.site">portfolio.vocabsitory.site</a>}
            <br />
        </div>
    );

    return (
        <Row>
            <Col sm="4" p-2>
                <RecordTable info={info} datas={localData} handleNotSelected={handleNotSelected}/>
            </Col>
            <Col sm="6">
                <Card className="w-100 mx-auto m-3 p-2">
                    <Card.Body style={{ whiteSpace: "pre-wrap" }}>
                        <Row className="my-2">
                            <Col sm="6">
                                <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
                                    <Form.Label column sm="4">
                                        Position
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            type="text"
                                            placeholder="Position"
                                            name="position"
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                setTarget(e.target.value);
                                            }}
                                            onMouseLeave={(e)=>handleTrim(e)}
                                            value={info.position}
                                        />
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col sm="6">
                                <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
                                    <Form.Label column sm="4">
                                        Company
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            type="text"
                                            placeholder="Company"
                                            name="company"
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                setTarget(e.target.value);
                                            }}
                                            onMouseLeave={(e)=>handleTrim(e)}
                                            value={info.company}
                                        />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mx-auto">
                                <Button onClick={() => setHeader((pre) => !pre)} variant={showHeader ? "primary" : "outline-primary"} className="w-100">
                                    Header
                                </Button>
                            </Col>
                            <Col className="mx-auto">
                                <Button onClick={() => setInfo((data) => ({...data,company:"",position:""}))} variant={"danger"} className="w-100">
                                    Clear
                                </Button>
                            </Col>
                            <Col className="mx-auto">
                                <Button onClick={handleContentCopy} className="w-100">
                                    Copy
                                </Button>
                            </Col>
                            <Col className="mx-auto">
                                <Button onClick={downloadPDF} className="w-100">
                                    PDF
                                </Button>
                            </Col>
                            <Col className="mx-auto">
                                <Button onClick={copyTable} className="w-100">
                                    Excel
                                </Button>
                            </Col>
                            <Col className="mx-auto">
                                <Button onClick={save} className="w-100">
                                    Save
                                </Button>
                            </Col>
                        </Row>
                        <Row className="my-2">
                            <ButtonGroup>
                                {letter.map((letter, idx) => (
                                    <ToggleButton
                                        key={idx}
                                        id={`radio-${idx}`}
                                        type="radio"
                                        variant={radioValue == letter.value ? "outline-success" : "outline-danger"}
                                        name="radio"
                                        checked={radioValue === letter.value}
                                        onChange={(e) => {
                                            setRadioValue(letter.value);
                                            setLetter(letter.content);
                                        }}
                                    >
                                        {letter.name}
                                    </ToggleButton>
                                ))}
                            </ButtonGroup>
                        </Row>

                        <Row>
                            <Col sm="2">Clipboard</Col>
                            <Col sm="5">
                                {applied && (
                                    <Alert variant={"danger"} className="m-0 py-0">
                                        Applied at {applied.date}
                                    </Alert>
                                )}
                            </Col>
                            <Col sm="5">
                                {alert && (
                                    <Alert variant={"primary"} className="m-0 py-0">
                                        Copy Success
                                    </Alert>
                                )}
                            </Col>
                        </Row>
                        <Col>
                            <Form.Label column sm="10">
                                <Form.Control type="text" placeholder="Position" name="position" value={title} onChange={() => {}} />
                            </Form.Label>
                            <Form.Label column sm="2">
                                <Button onClick={() => handleCopy(title)}>Copy</Button>
                            </Form.Label>
                        </Col>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicPassword"></Form.Group>
                    </Card.Body>
                    {
                        <Card.Body style={{ whiteSpace: "pre-wrap", fontSize: "13px", fontFamily: "Arial" }} id="cardBody" ref={pdfRef}>
                            {showHeader && header}
                            <br/>
                            {
                                
                                disPlayContent()
                            }
                        </Card.Body>
                    }

                    <table id="test">
                        <tr>
                            <td>{info.company}</td>
                            <td>{info.position}</td>
                        </tr>
                    </table>
                </Card>
            </Col>

            <Col sm="2">
                <Card className="w-100 p-2 mx-auto m-3">
                    {clipboard.map((i) => (
                        <Button key={i.text} type="radio" variant="outline-success" value={i.value} name="radio" onClick={() => handleCopy(i.value)}   className="my-1">
                            {i.text}
                        </Button>
                    ))}
                </Card>
            </Col>
            {JSON.stringify(info)}
        </Row>
    );
}

export async function getServerSideProps(context) {
    const localData = getData();
    return { props: { localData } };
}
