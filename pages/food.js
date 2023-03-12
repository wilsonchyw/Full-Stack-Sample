//import recipe from "../recipes.json";
import path from 'path'
import recipe from path.resolve('./','recipes_ori.json');
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useMemo, useRef, useState } from "react";
export default function Food() {
    const typeSet = new Set();
    const iSet = new Set();
    recipe.forEach((r) => {
        r.name
            .split("-")[0]
            .split(",")
            .forEach((name) => typeSet.add(name));
    });
    recipe.forEach((r) => r.ingredients.map((d) => iSet.add(d.ingredient)));
    const [ingredients, setIngredients] = useState(iSet);
    const ingredient = [...iSet.values()];
    const chunk = [];
    const chunkSize = 10;
    for (let i = 0; i < ingredient.length; i += chunkSize) {
        chunk.push(ingredient.slice(i, i + chunkSize));
        // do whatever
    } /**

    return (
        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">name</th>
                    <th scope="col">Ingredients</th>
                </tr>
            </thead>
            <tbody>
                {chunk.map((r) => (
                    <tr key={r.join("")}>
                        {r.map((x) => (
                            <th>
                                {
                                    <button
                                        className={`btn ${ingredients.has(x)?'btn-primary':''}`}
                                        onClick={() => {
                                            setIngredients((prev) => {
                                                const next = new Set(prev);
                                                if (next.has(x)) {
                                                    next.delete(x);
                                                } else {
                                                    next.add(x);
                                                }
                                                return next;
                                            });
                                            axios
                                                .post("/api/food", { food: x })
                                                .then((res) => {})
                                                .catch((err) => {});
                                        }}
                                    >
                                        {x}
                                    </button>
                                }
                            </th>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
 
  */
    return (
        <div>Í
            {ingredient
                .sort((x, y) => x.localeCompare(y, "zh-CN"))
                .map((d) => (
                    <div>
                        {d}
                        <button
                            className={`btn btn-primary`}
                            onClick={() => {
                                axios
                                    .post("/api/food", { food: d })
                                    .then((res) => {})
                                    .catch((err) => {});
                            }}
                        >
                            {d}
                        </button>
                    </div>
                ))}
        </div>
    );
}
