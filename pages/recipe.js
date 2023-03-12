//import recipe from "../recipes.json";
import path from 'path'
import recipe from "../recipes2.json"
import ingredients from "../ingredients.json";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useMemo, useRef, useState } from "react";
export default function Food() {
    //const [ingredients, setIngredients] = useState(iSet);
    const [selected, setSelected] = useState(new Set());

    const handleiIgredientSelect = (i) => {
        setSelected((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(i)) {
                newSet.delete(i);
            } else {
                newSet.add(i);
            }
            console.log(newSet);
            return newSet;
        });
    };

    const _recipe = useMemo(() =>
        recipe.map((r) => {
            return { ...r, ingredientSet: new Set(r.ingredients.map((t) => t.ingredient)) };
        })
    );
    console.log(_recipe[0]);
    return (
        <>
            {JSON.stringify([...selected.values()])}
            <div>
                {ingredients.map((i) => (
                    <button className={`btn ${selected.has(i)?"btn-primary":"btn-outline-primary"}`} onClick={() => handleiIgredientSelect(i)}>
                        {i}
                    </button>
                ))}
            </div>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">name</th>
                        <th scope="col">Ingredients</th>
                    </tr>
                </thead>
                <tbody>
                    {_recipe
                        .filter((r) => {
                            for (const i of selected) {
                                if (!r.ingredientSet.has(i)) return false;
                            }
                            return true;
                        })
                        .map((r) => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>{r.name}</td>
                                <td>{r.ingredients.map((x) => x.ingredient).join(" , ")}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </>
    );

    /**
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
    */
}
