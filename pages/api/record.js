import fs from 'fs'
import path from 'path'

export function getData(req, res) {    
    const filePath =path.resolve('./','record.json');
    const datas = JSON.parse(fs.readFileSync(filePath).toString());
    return datas

}

function post(req, res) {
    const filePath =path.resolve('./','record.json');
    const { date, company,position } = req.body;
    const data = JSON.parse(fs.readFileSync(filePath).toString());
    data.push({ date, company,position })
    fs.writeFileSync(filePath,JSON.stringify(data))
    return res.status(200).send()
}

function put(req, res) {
    const filePath =path.resolve('./','record.json');
    const { date, company,position } = req.body;
    const data = JSON.parse(fs.readFileSync(filePath).toString());
    data.forEach(d=>{
        if(d.date == date && d.company == company && d.position == position) d.notSelected = true
    })
    fs.writeFileSync(filePath,JSON.stringify(data))
    return res.status(200).send()
}



export default (req, res) => {
    if(req.method === "POST") return post(req, res)
    if(req.method === "GET") return getData(req, res)
    if(req.method === "PUT") return put(req, res)
    return res.status(404).send("")
};
