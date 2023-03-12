import fs from 'fs'
import path from 'path'
//import recipe from path.resolve('./','recipes.json');


export function getData(req, res) {    
    console.log(req.query)
    return res.status(200).send()

}

function post(req, res) {
    const filePath =path.resolve('./','ingredients.json');
    const { food } = req.body;
    const data = new Set(JSON.parse(fs.readFileSync(filePath).toString()))
    if(data.has(food)){
        data.delete(food)
    }else{
        data.add(food)
    }

    fs.writeFileSync(filePath,JSON.stringify([...data.values()]))
    return res.status(200).send()
}

function updateRecipe(req, res) {
    const filePath =path.resolve('./','recipes_ori.json');
    const { food } = req.body;
    const data = JSON.parse(fs.readFileSync(filePath).toString())
    const newData = data.map(d=>{
        const ingredients = d.ingredients.filter(i=>i.ingredient!=food)
        //const ingredients = d.ingredients.filter(i=>!i.ingredient.includes("人份"))
        //const ingredients = d.ingredients.map(i=>({...i,ingredients:i.ingredient.replace(/\[|\]/g,"")}))
        return {...d,ingredients:ingredients}
    })
    fs.writeFileSync(filePath,JSON.stringify(newData))
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
    if(req.method === "POST") return updateRecipe(req, res)
    return res.status(404).send("")
};
