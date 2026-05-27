import {iris} from "./iris.jsx";
import "./index.css";
import "./App.css";
import { useState } from "react";
import * as d3 from "d3";

const property = [
    "sepalLength",
    "sepalWidth",
    "petalLength",
    "petalWidth",
];

const color = {
    setosa: "green",
    versicolor: "purple",
    virginica: "orange",
}

const PulldownMenu = ({ value, onChange }) => {
    return (
        <select className="pulldown" value={value} onChange={onChange}>
            {property.map((item) => (
                <option key={item} value={item}>
                    {item}
                </option>
            ))}
        </select>
    );
};


export default function App(){
    const plotWidth = 500;
    const legendWidth = 200;
    const width = plotWidth + legendWidth;
    const height = 500;
    const margin = 50;
    const [xPro, setXPro] = useState(property[0]);
    const [yPro, setYPro] = useState(property[1]);

    const xScale = d3
        .scaleLinear() //
        .domain(d3.extent(iris, d => d[xPro])) //extentで最小、最大確保　
        .nice()                                //ちょうどいい値に変換
        .range([margin, plotWidth - margin]);      //表示範囲

    
    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(iris, d => d[yPro]))
        .nice()
        .range([height - margin, margin]);
        
    const xTicks = xScale.ticks();
    const yTicks = yScale.ticks();
    return (
        <div>
            <header className="header">    
                <h1 className="title">
                    scatter plot of iris data
                </h1>
            </header>
            <div className="control-panel">

                <div className="selector-group">
                    <label className="selector-label">
                        x property
                    </label>

                    <PulldownMenu
                        value={xPro}
                        onChange={(e) => setXPro(e.target.value)}
                    />
                </div>

                <div className="selector-group">
                    <label className="selector-label">
                        y property
                    </label>

                    <PulldownMenu
                        value={yPro}
                        onChange={(e) => setYPro(e.target.value)}
                    />
                </div>

            </div>
            <svg width = {width} height = {height}>
                <g>
                    <line x1 = {margin} x2 = {plotWidth - margin} y1 = {height - margin} y2 = {height - margin} stroke = "gray"/>
                    <line x1 = {margin} x2 = {margin} y1 = {margin} y2 = {height - margin} stroke = "gray"/>
                    {iris.map((item,i) => (
                        <circle key={i} cx = {xScale(item[xPro])} cy = {yScale(item[yPro])} r = "5" fill = {color[item.species]} fillOpacity="0.5"/>
                    ))}
                    {xTicks.map((tick, i) => (
                        <g key={i}>
                            <line
                            x1={xScale(tick)}
                            x2={xScale(tick)}
                            y1={height - margin}
                            y2={height - margin + 10}
                            stroke="black"
                        />

                        <text
                            className="tick-text"
                            x={xScale(tick)}
                            y={height - margin + 25}
                            textAnchor="middle"
                        >
                            {tick}
                        </text>
                    </g>
                    ))}
                    {yTicks.map((tick, i) => (
                        <g key={i}>
                            <line
                                x1={margin}
                                x2={margin - 10}
                                y1={yScale(tick)}
                                y2={yScale(tick)}
                                stroke="black"
                            />

                            <text
                            className="legend-text"
                                x={margin - 15}
                                y={yScale(tick)}
                                textAnchor="end"
                                dominantBaseline="middle"
                            >
                                {tick}
                            </text>
                        </g>
                    ))}                
                </g>
                <g transform={`translate(${plotWidth}, ${margin})`}>
                    {Object.entries(color).map(([species, c], i) => (
                        <g key={species} transform={`translate(0, ${i * 30})`}>
                            <rect
                                x={5}
                                y={-5}
                                width={15}
                                height={15}
                                fill={c}
                                opacity = "0.5"
                            />

                            <text
                                x={24}
                                y={4}
                                fontSize="14"
                                dominantBaseline="middle"
                            >
                                {species}
                            </text>
                        </g>
                    ))}
                </g>                           
            </svg>
        </div>
    )   
}