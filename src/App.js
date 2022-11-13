import './App.css';
import React, { useState, useEffect } from "react";

/*
Improvements:

conditionally render 'rooms' or 'groups' of light bulbs and set the settings for each
have a shareable output to be able to report what your outcome was
Have a simple version in a 'tab' on the page


*/

function App() {

  // setup initial input values,  get from local storage if it exists
  const initialWattageToBeReplaced = Number(localStorage.getItem("wattageToBeReplaced") || 0);
  const initialWattageReplacement = Number(localStorage.getItem("wattageReplacement") || 0);
  const initialRunningTimeHPD = Number(localStorage.getItem("runningTimeHPD") || 0);
  const initialEnergyCost = Number(localStorage.getItem("energyCost") || 0);
  const initialNumberOfBulbsReplaced = Number(localStorage.getItem("numberOfBulbsReplaced") || 0);
  const initialCostPerBulb = Number(localStorage.getItem("costPerBulb") || 0);
  const initialMyRewardDiscount = String(localStorage.getItem("myRewardDiscount") || 0);
  const initialEmissionsPerKWH = Number(localStorage.getItem("emissionsPerKwh") || 0);

  // setup initial output values,  get from local storage if it exists
  const initialCostToReplace = Number(localStorage.getItem("costToReplace") || 0);
  const initialSavedPerYear = Number(localStorage.getItem("savedPerYear") || 0);
  const initialRoiInFirstYear = Number(localStorage.getItem("roiInFirstYear") || 0);
  const initialKwhSavingPerYear = Number(localStorage.getItem("kwhSavingPerYear") || 0);
  const initialKgCo2SavingPerYear = Number(localStorage.getItem("kgCo2SavingPerYear") || 0);

  // setup input useState variables and update functions
  const [wattageToBeReplaced, setWattageToBeReplaced] = useState(initialWattageToBeReplaced)
  const [wattageReplacement, setWattageReplacement] = useState(initialWattageReplacement)
  const [runningTimeHPD, setRunningTimeHPD] = useState(initialRunningTimeHPD)
  const [energyCost, setEnergyCost] = useState(initialEnergyCost)
  const [numberOfBulbsReplaced, setNumberOfBulbsReplaced] = useState(initialNumberOfBulbsReplaced)
  const [myRewardDiscount, setMyRewardDiscount] = useState(initialMyRewardDiscount)
  const [costPerBulb, setCostPerBulb] = useState(initialCostPerBulb)
  const [emissionsPerKwh, setEmissionsPerKWH] = useState(initialEmissionsPerKWH)
  
  // setup output useState variables and update functions
  const [costToReplace, setCostToReplace] = useState(initialCostToReplace)
  const [savedPerYear, setSavedPerYear] = useState(initialSavedPerYear)
  const [roiInFirstYear, setRoiInFirstYear] = useState(initialRoiInFirstYear)
  const [kwhSavingPerYear, setKwhSavingPerYear] = useState(initialKwhSavingPerYear)
  const [kgCo2SavingPerYear, setKgCo2SavingPerYear] = useState(initialKgCo2SavingPerYear)

  // setup format for currencies
  const formatter = new Intl.NumberFormat("en-GB", {style: "currency", currency: "GBP", minimumFractionDigits: 2})

  // calculate output functions
  const calcCostToReplace = (tmpCostPerBulb, tmpNumberOfBulbsReplaced, tmpMyRewardDiscount) => {
    return tmpCostPerBulb * tmpNumberOfBulbsReplaced * ((100 - tmpMyRewardDiscount) / 100)
  }
  const calcSavedPerYear = (tmpKwhSavingPerYear, tmpEnergyCost) => {
    return tmpKwhSavingPerYear * tmpEnergyCost;
  }
  const calcRoiInFirstYear = (tmpSavedPerYear, tmpCostToReplace) => {
    return tmpSavedPerYear / tmpCostToReplace;
  }
  const calcKwhSavingPerYear = (tmpWattageToBeReplaced, tmpWattageReplacement, tmpRunningTimeHPD, tmpNumberOfBulbsReplaced) => {
    return ((tmpWattageToBeReplaced - tmpWattageReplacement) * tmpRunningTimeHPD * 365 * tmpNumberOfBulbsReplaced) / 1000;
  }
  const calcKgCo2SavingPerYear = (tmpKwhSavingPerYear, tmpEmissions) => {
    return tmpKwhSavingPerYear * tmpEmissions;
  }

  useEffect(() => {
    // update all variables in local storage with current values
    // input variables
    localStorage.setItem("wattageToBeReplaced", wattageToBeReplaced)
    localStorage.setItem("wattageReplacement", wattageReplacement)
    localStorage.setItem("runningTimeHPD", runningTimeHPD)
    localStorage.setItem("energyCost", energyCost)
    localStorage.setItem("numberOfBulbsReplaced", numberOfBulbsReplaced)
    localStorage.setItem("costPerBulb", costPerBulb)
    localStorage.setItem("myRewardDiscount", myRewardDiscount)
    localStorage.setItem("emissionsPerKwh", emissionsPerKwh)
    
    // calculate outputs here
    let tmpSetCostToReplace = calcCostToReplace(costPerBulb, numberOfBulbsReplaced, myRewardDiscount)
    let tmpSetKwhSavingPerYear = calcKwhSavingPerYear(wattageToBeReplaced, wattageReplacement, runningTimeHPD, numberOfBulbsReplaced)
    let tmpSetSavedPerYear = calcSavedPerYear(tmpSetKwhSavingPerYear, energyCost)
    let tmpSetRoiInFirstYear = calcRoiInFirstYear(tmpSetSavedPerYear, tmpSetCostToReplace)
    let tmpSetKgCo2SavingPerYear = calcKgCo2SavingPerYear(tmpSetKwhSavingPerYear, emissionsPerKwh)

    setCostToReplace(tmpSetCostToReplace)
    setSavedPerYear(tmpSetSavedPerYear)
    setRoiInFirstYear(tmpSetRoiInFirstYear)
    setKwhSavingPerYear(tmpSetKwhSavingPerYear)
    setKgCo2SavingPerYear(tmpSetKgCo2SavingPerYear)
    
    // output variables
    localStorage.setItem("roiInFirstYear", roiInFirstYear)
    localStorage.setItem("kwhSavingPerYear", kwhSavingPerYear)
    localStorage.setItem("kgCo2SavingPerYear", kgCo2SavingPerYear)
    localStorage.setItem("savedPerYear", savedPerYear)
    localStorage.setItem("costToReplace", costToReplace)
  }, [
    wattageToBeReplaced,
    wattageReplacement,
    runningTimeHPD,
    energyCost,
    numberOfBulbsReplaced,
    costPerBulb,
    myRewardDiscount,
    emissionsPerKwh
  ])

  return (
    <div className="App">
      <h1>Lightbulb Savings Calculator</h1>
      <h2>Amount Saved: {formatter.format(savedPerYear)}</h2>
      <div>Cost to replace {formatter.format(costToReplace)}</div>
      <div>roiInFirstYear {formatter.format(roiInFirstYear)}</div>
      <div>kwhSavingPerYear {kwhSavingPerYear}</div>
      <div>kgCo2SavingPerYear {kgCo2SavingPerYear}</div>
      <br/>
      <form className="calc-form">
        <label>Bulb Wattage (To be replaced)
          <input type="number" value={wattageToBeReplaced} onChange={(e)=> setWattageToBeReplaced(parseInt(e.target.value) || 0)}/>
        </label>
        <label>Bulb Wattage (Replacement)
          <input type="number" value={wattageReplacement} onChange={(e)=> setWattageReplacement(parseInt(e.target.value) || 0)}/>
        </label>
        <label>Running Time (Hours per day)
          <input type="number" value={runningTimeHPD} onChange={(e)=> setRunningTimeHPD(e.target.value || 0)}/>
        </label>
        <label>Energy Cost (kWh)
          <input type="number" value={energyCost} onChange={(e)=> setEnergyCost(e.target.value || 0)}/>
        </label>
        <label>Number of bulbs replaced
          <input type="number" value={numberOfBulbsReplaced} onChange={(e)=> setNumberOfBulbsReplaced(parseInt(e.target.value) || 0)}/>
        </label>
        <label>Cost per bulb
          <input type="number" value={costPerBulb} onChange={(e)=> setCostPerBulb(e.target.value || 0)}/>
        </label>
        <label>MyReward Discount
          <input type="number" value={myRewardDiscount} onChange={(e)=> setMyRewardDiscount(e.target.value || 0)}/>
        </label>
        <label>CO2 Emissions (kg/kWh)
          <input type="number" value={emissionsPerKwh} onChange={(e)=> setEmissionsPerKWH(e.target.value || 0)}/>
        </label>
        {/* <label>Contribution frequency
          <select value={lightbulb type} onChange={(e)=> setLightbulbType(e.target.value)}>
            <option value="LED">LED</option>
            <option value="Halogen">Halogen</option>
          </select>
  </label>*/}
      </form>
    </div>
  );
}

export default App;
