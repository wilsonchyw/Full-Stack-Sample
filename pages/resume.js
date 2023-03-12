import dynamic from 'next/dynamic'
import Table from "react-bootstrap/Table";
import { jsPDF } from "jspdf";
//const importHTEMLtoPdf = dynamic(() => import("html2pdf.js"))
import html2pdf from "html2pdf.js";
/* const html2pdf = dynamic(
    () => import html2pdf from  ("html2pdf.js"),
    { ssr: false }
  ); */
//const html2pdf =  window !== undefined?importHTEMLtoPdf:{}
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import React, { useMemo, useRef, useState } from "react";
const experience = [
    {
        title: "Sales Administrator",
        company: "Home Quarters",
        companyDesc: "Canada's local furniture retailers",
        period: "Aug 2022 - Present",
        description: [
            "Promoted modern luxury furnishings and achieve business goals",
            "Collected and processed the whole company’s products for the corporate website. Achieved goal half way ahead of scheduled time by adopting programming knowledge",
            "Developed automation program with Javascript to update products data and reduced 90% of processing time",
        ],
    },
    {
        title: "Assistant Clerical Officer",
        company: "HKSAR Government",
        companyDesc: " The High Court",
        period: "Feb 2016 – Jun 2022",
        description: [
            "Led subordinates to provide customer service to court users daily and achieve 4 years of continuous A-grade appraisal",
            "Designed inventory management strategy with subordinates that reduced 30% of stationary waste",
            "Developed automation application with Python to handle the daily repetitive tasks that increase the operation efficiency by 70%",
        ],
    },
    {
        title: "Renovation Project Manager",
        company: "Taste Interior Design",
        period: "Jan 2015 - Jan 2016",
        description: [
            "Managed multiple timelines and staffing for renovation projects and reached 0 industrial accidents",
            "Consulted client feedback and design solutions with interior designers and technicians which result in 100% client satisfaction",
        ],
    },
    {
        title: "Business owner",
        company: "Sheen Lighting Company",
        period: "Jul 2013 – Jul 2014",
        description: [
            "Designed and developed business website with HTML, CSS, and Javascript",
            "Researched market opportunity and defined sales strategy that gain profit 2 months before a forecast",
            "Conducted product procurement, inventory control, and packaging design",
            "Established and promoted a new local LED lighting brand from scratch",
        ],
    },
    {
        title: "Web Developer / Sales Executive",
        company: "Pro-Art Locksmith Alarm Co.",
        period: "May 2011 – May 2013",
        description: [
            "Designed and developed UI/UX for the corporate website",
            "Created and updated website content for existing and new products",
            "Collaborated with the global leader in access solutions(ASSA ABLOY) to promote security products",
        ],
    },
];

const info = {
    cert: [
        {
            institution: "Coventry University",
            name: "Bachelor of Science in Computing(First-Class Honours)",
            date: 2021,
        },
        {
            institution: "Coursera",
            name: "Google Cloud Fundamentals: Core Infrastructure",
            date: 2022,
        },
        {
            institution: "Cisco networking academy",
            name: "Cisco Certified Network Associate Routing and Switching (CCNA)",
            date: 2018,
        },
    ],
    skills: [
        {
            type: "Programming",
            content: ["NodeJS", "JavaScript", "Typescript", "Python", "PHP", "SQL"],
        },
        {
            type: "Frameworks",
            content: ["React", "Redux", "Vue", "Vuex", "NextJS", "Nest", "Express", "Apollo"],
        },
        {
            type: "Clouds",
            content: ["AWS", "Oracle Cloud Infrastructure", "Goodle Cloud Platform"],
        },
    ],
    projects: [
        {
            name: "Reddit Trending",
            link: "https://rtrend.site",
            description: "A web application that tracks 50k+ threads on Reddit and provides a simplified visualization of the financial trends",
            techStack: ["Typescript", "GraphQL", "RESTful API", "React.js", "Redux", "ApexChart", "Bootstrap", "Docker", "Cloudflare"],
        },
        {
            name: "Reddit Trending Backend",
            link: "https://github.com/wilsonych/Reddit-Trending-backend",
            description: "Support both RESTful API and GraphQL. Scalable and maintainable by heavily adapted decorator and dependency injection",
            techStack: ["Node.JS", "GraphQL", "Typescript", "Express", "Knex", "Oracle Cloud", "Docker", "Nginx", "Oracle database", "MySQL", "Radius"],
        },
        {
            name: "Vocabsitory",
            link: "https://vocabsitory.site",
            description: "A mobile responsive UI with RESTful backend assists with the forgetting curve for learning vocabulary in a foreign language. Achieve 98 scores on Google PageSpeed Insights",
            techStack: [
                "Node.JS",
                "Typescript",
                "NextJS",
                "React.js",
                "Redux",
                "Jest",
                "Bootstrap",
                "Firebase",
                "TypeORM",
                "Oracle database(RDBMS)",
                "Radius",
                "Oracle Cloud",
                "Docker",
                "Nginx",
                "Cloudflare",
            ],
        },
        {
            name: "Amazon Automation",
            link: "https://portfolio.vocabsitory.site/Automation%20program%20for%20Amazon%20for%20people%20with%20disabilities%20-%20Wilson%20Yip%20-%202021.pdf",
            description:
                "An automation program for helping people with disabilities to handle panic buying situations. This application is based on 5000+ experiment results of how Amazon’s anti-scraping protection works.",
            techStack: ["Python", "Node.JS", "Javascript", "Puppeteer", "Vue"],
        },
    ],
};
export default function Resume() {
    const pdfRef = useRef(null);
    const bottomLine = { borderBottom: "1px solid" };
    const textRight = { textAlign: "right" };
    const textLeft = { textAlign: "left" };
    function downloadPDF(s) {
        const content = pdfRef.current;
       const doc = new jsPDF("p", "pt", "a4");
       doc.setFontSize(9);
        doc.html(content, {
            callback: function (doc) {
                doc.internal.write(0, "Tw");
                //doc.save("Wilson Yip - Cover Letter.pdf");
                doc.output('dataurlnewwindow');
            },
            width: 560, // <- here
            windowWidth: 600, // <- here
            margin: 20,
        });
    }
    return (
        <>
            <Button onClick={downloadPDF} className="w-100">
                PDF
            </Button>
            <div style={{ width: "100%", lineHeight: 1.1,fontSize:12 }} ref={pdfRef}>
                <section>
                    <Row>
                        <Col xs={4} className="align-self-center align-items-end" style={textRight}>
                            <h2>Wilson Yip</h2>
                        </Col>
                        <Col xs={3}>
                            <div>Vancouver</div>
                            <div>236-518-2307</div>
                            <div>wlson.chyw@gmail.com </div>
                        </Col>
                        <Col xs={4} style={textLeft}>
                            <Row>Vancouver</Row>
                            <Row>236-518-2307</Row>
                            <Row>wilson.chyw@gmail.com </Row>
                        </Col>
                    </Row>
                </section>

                <section>
                    <h5 style={bottomLine}>WORK EXPERIENCE</h5>
                    {experience.map((exp) => (
                        <>
                            <Row key={exp.company} style={{}}>
                                <Col xs={9}>
                                    <b>{exp.company}</b>
                                    {exp.companyDesc && ` | ${exp.companyDesc}`}
                                </Col>

                                <Col xs={3} style={textRight}>
                                    {exp.period}
                                </Col>
                            </Row>
                            <Row>
                                <i>{exp.title}</i>
                            </Row>
                            <ul>
                                {exp.description.map((x) => (
                                    <li key={x}>{x}</li>
                                ))}
                            </ul>
                        </>
                    ))}
                </section>

                <section>
                    <h5 style={bottomLine}>EDUCATION & CERTIFICATIONS</h5>
                    {info.cert.map((c) => (
                        <div className="mb-3">
                            <Row key={c.name}>
                                <Col xs={10}>
                                    <b>{c.institution}</b>
                                </Col>
                                <Col xs={2} style={textRight}>
                                    {c.date}
                                </Col>
                            </Row>
                            <Row>
                                <Col>{c.name}</Col>
                            </Row>
                        </div>
                    ))}
                </section>

                {/* <section>
                    <h5 style={bottomLine}>SKILLS</h5>
                    {info.skills.map((s) => (
                        <div className="mb-1">
                            <Row key={s.type}>
                                <Col xs={2}>
                                    <b>{s.type}</b>
                                </Col>
                                <Col xs={10}>{s.content.join(", ")}</Col>
                            </Row>
                        </div>
                    ))}
                </section> */}

                <section className="mt-2">
                    <h5 style={bottomLine}>PROJECTS</h5>
                    {info.projects.map((p) => (
                        <div key={p.name} className="mb-3">
                            <Row>
                                <Col>
                                    <a href={p.link}>{p.name}</a>
                                </Col>
                            </Row>
                            <Row>
                                <Col>{p.description}</Col>
                            </Row>
                            <Row>
                                <Col><li>{p.techStack.join(", ")}</li></Col>
                            </Row>
                        </div>
                    ))}
                </section>
            </div>
        </>
    );
}
