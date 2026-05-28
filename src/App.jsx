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
    setosa: "#7fc97f",
    versicolor: "#beaed4",
    virginica: "#fdc086",
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
    const [xProperty, setXPro] = useState(property[0]);
    const [yProperty, setYPro] = useState(property[1]);
    
    const [visibleSpecies, setVisibleSpecies] = useState({
        setosa: true,
        versicolor: true,
        virginica: true,
    });

    const xScale = d3
        .scaleLinear() //
        .domain(d3.extent(iris, d => d[xProperty])) //extentで最小、最大確保　
        .nice()                                //ちょうどいい値に変換
        .range([margin, plotWidth - margin]);      //表示範囲

    
    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(iris, d => d[yProperty]))
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
                        value={xProperty}
                        onChange={(e) => setXPro(e.target.value)}
                    />
                </div>

                <div className="selector-group">
                    <label className="selector-label">
                        y property
                    </label>

                    <PulldownMenu
                        value={yProperty}
                        onChange={(e) => setYPro(e.target.value)}
                    />
                </div>

            </div>
            <svg width = {width} height = {height}>
                <g>
                    <line x1 = {margin} x2 = {plotWidth - margin} y1 = {height - margin} y2 = {height - margin} stroke = "gray"/>
                    <line x1 = {margin} x2 = {margin} y1 = {margin} y2 = {height - margin} stroke = "gray"/>
                    <g>
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
                    </g>
                    <g>
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
                </g>
                <g>
                    {iris.map((item,i) => (
                        <circle className = "dot" key={i} cx = {xScale(item[xProperty])} cy = {yScale(item[yProperty])} r = "5" fill = {color[item.species]} opacity={visibleSpecies[item.species] ? 1 : 0}/>
                    ))}
                </g>
                <g transform={`translate(${plotWidth}, ${margin})`}>
                    {Object.entries(color).map(([species, c], i) => (
                        <g 
                            key={species} 
                            transform={`translate(0, ${i * 30})`}
                            onClick={() =>
                                setVisibleSpecies(prev => ({
                                    ...prev,
                                    [species]: !prev[species],
                                }))
                            }    
                            style={{ cursor: "pointer" }}           
                        >

                            <rect
                                x={5}
                                y={-5}
                                width={15}
                                height={15}
                                fill={c}
                                opacity={visibleSpecies[species] ? 1 : 0.5}
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