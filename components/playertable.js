import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/playertable.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import { useState } from 'react';
import * as classdata from '../data/recruitingdata.json';

const DatesDropdown = ({dates,setValue,setRecclass,date,years}) => {
    const handleDateSelection = (event) => {
        console.log("Changed date dropdown selection to collect data from "+event.target.options[event.target.selectedIndex].text);
        setValue(event.target.value);
    }
    const handleYearSelection = (event) => {
        console.log("Changed dropdown year selection to collect data from the class of "+event.target.options[event.target.selectedIndex].text);
        setRecclass(event.target.value);
    }
    return(
        <>
            <h2>
                Recruiting Site Data from {date}
            </h2>
            <select className={styles.dropdown} onChange={handleDateSelection}>
                {dates.map((date,i)=>(<option value={i}>{date}</option>))}
            </select>
            <select className={styles.dropdown} onChange={handleYearSelection}>
                {years.map((year)=>(<option value={year}>{year}</option>))}
            </select>
        </>
    );
}

const HeaderCell = ({setSort}) => {
    const handleClick = (event) => {
        console.log("Now sorting based on "+event.currentTarget.dataset.value);
        setSort(event.currentTarget.dataset.value);
    }
    return(
        <div className={styles.headerCell} id="header">
            <div className={styles.playerInfo} data-value="name" onClick={handleClick}>
                <em>Player Info</em>
            </div>
            <div className={styles.ron3} data-value="ON3 Rating" onClick={handleClick}>
                <em>ON3</em>
            </div>
            <div className={styles.r247} data-value="247 Rating" onClick={handleClick}>
                <em>247</em>
            </div>
            <div className={styles.respn} data-value="ESPN Rating" onClick={handleClick}>
                <em>ESPN</em>
            </div>
            <div className={styles.rrivals} data-value="Rivals Rating" onClick={handleClick}>
                <em>Rivals</em>
            </div>
            <div className={styles.commitInfo}>
                <em>Commit Status</em>
            </div>
        </div>
    );
} 

const PlayerCell = ({data,key,index}) => {
    return(
        <div className={styles.playerCell} id={key}>
            <div className={styles.playerInfo}>
                <div className={styles.posInfo}>
                    {data["Pos"]}
                </div>
                <div className={styles.locationInfo}>
                    {data["City"]+", "+data["State"]}
                </div>
                <div className={styles.nameInfo}>
                    {data["name"]}
                </div>
            </div>
            <div className={styles.ron3}>
                {data["ON3 Rating"][index]}
            </div>
            <div className={styles.r247}>
                {data["247 Rating"][index]}
            </div>
            <div className={styles.respn}>
                {data["ESPN Rating"][index]}
            </div>
            <div className={styles.rrivals}>
                {data["Rivals Rating"][index]}
            </div>
            {data["Commit Status"][index]==false?<div className={styles.commitInfo}>Uncommitted</div>:data["Commit Status"][index]=="No Data Yet"?<div className={styles.commitInfo}>No Data</div>:<div className={styles.commitInfo}><b>{data["Commit Status"][index]}</b></div>}
        </div>
    );
};

function playersort(a,b,sort,value,reverse=false){
    let ret;
    if(a[sort][value]=="-" && b[sort][value]=="-"){ret=0;}
    else if (a[sort][value]=="-"){ret=1}
    else if (b[sort][value]=="-"){ret=-1}
    else {ret=b[sort][value]-a[sort][value];}
    if(!reverse){return ret}
    else{return -ret}
}

const PlayerData = ({data,value,sort}) => {
    var newdata = data.slice().sort((a,b)=>playersort(a,b,sort,value));
    newdata=newdata.filter((obj)=>obj["ON3 Rating"][value]!="-"&&obj["247 Rating"][value]!="-"&&obj["ESPN Rating"][value]!="-"&&obj["Rivals Rating"][value]!="-");
    console.log("Sorted by "+sort);

    return(
        <>
            {newdata.map((datum,i)=>(<PlayerCell data={datum} index={value} key={i}></PlayerCell>))}
        </>
    );
};

export default function Playertable(classnum){
    const [recclass,setRecclass] = useState(new Date().getFullYear()+1);
    const [value,setValue] = useState(0);
    const [sorttype,setSort] = useState("name");
    return(
        <div className={styles.playerTable}>
            <DatesDropdown dates={classdata["Class"+String(recclass)]["dates"]} setValue={setValue} setRecclass={setRecclass} date={classdata["Class"+String(recclass)]["dates"][value]} years={classdata["years"]}></DatesDropdown>
            {console.log("DATA processing from JSON file")}
            <HeaderCell setSort={setSort}></HeaderCell>
            <PlayerData data={classdata["Class"+String(recclass)]["players"]} value={value} sort={sorttype}></PlayerData>
        </div>
    )    
}