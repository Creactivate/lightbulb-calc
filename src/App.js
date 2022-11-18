import './App.css';
import React, { useState, useEffect } from "react";
import AppComponent from './components/test';

/*
Improvements:

conditionally render 'rooms' or 'groups' of light bulbs and set the settings for each
have a shareable output to be able to report what your outcome was
Have a simple version in a 'tab' on the page


*/

function App() {

  // setup initial input values,  get from local storage if it exists
  const initialRooms = localStorage.getItem("rooms") || [];


  // setup input useState variables and update functions
  const [rooms, setRooms] = useState(initialRooms)
  
  // setup output useState variables and update functions
  const [costToReplace, setCostToReplace] = useState(0)
  const [savedPerYear, setSavedPerYear] = useState(0)
  const [roiInFirstYear, setRoiInFirstYear] = useState(0)
  const [kwhSavingPerYear, setKwhSavingPerYear] = useState(0)
  const [kgCo2SavingPerYear, setKgCo2SavingPerYear] = useState(0)

  // setup format for currencies
  const formatter = new Intl.NumberFormat("en-GB", {style: "currency", currency: "GBP", minimumFractionDigits: 2})

  // calculate output functions
  const calcCostToReplace = (inputs) => {
    let output
    inputs.forEach(zone => {
      output += zone.costPerBulb * zone.numberOfBulbsReplaced * ((100 - zone.myRewardDiscount) / 100)
    });
    return output
  }
  const calcKwhSavingPerYear = (inputs) => {
    // calculating kwh savings for all rooms added together
    let output
    inputs.forEach(zone => {
      output += ((zone.wattageToBeReplaced - zone.wattageReplacement) * zone.runningTimeHPD * 365 * zone.numberOfBulbsReplaced) / 1000;
    });
    return output
  }
  const calcSavedPerYear = (tmpKwhSavingPerYear, tmpEnergyCost) => {
    return tmpKwhSavingPerYear * tmpEnergyCost;
  }
  const calcRoiInFirstYear = (tmpSavedPerYear, tmpCostToReplace) => {
    return tmpSavedPerYear / tmpCostToReplace;
  }
  const calcKgCo2SavingPerYear = (tmpKwhSavingPerYear, tmpEmissions) => {
    return tmpKwhSavingPerYear * tmpEmissions;
  }

  // useEffect(() => {
  //   // update all variables in local storage with current values
  //   // input variables
  //   localStorage.setItem("rooms", rooms)
    
  //   // calculate outputs here
  //   let tmpSetCostToReplace = calcCostToReplace(costPerBulb, numberOfBulbsReplaced, myRewardDiscount)
  //   let tmpSetKwhSavingPerYear = calcKwhSavingPerYear(wattageToBeReplaced, wattageReplacement, runningTimeHPD, numberOfBulbsReplaced)
  //   let tmpSetSavedPerYear = calcSavedPerYear(tmpSetKwhSavingPerYear, energyCost)
  //   let tmpSetRoiInFirstYear = calcRoiInFirstYear(tmpSetSavedPerYear, tmpSetCostToReplace)
  //   let tmpSetKgCo2SavingPerYear = calcKgCo2SavingPerYear(tmpSetKwhSavingPerYear, emissionsPerKwh)

  //   setCostToReplace(tmpSetCostToReplace || 0)
  //   setSavedPerYear(tmpSetSavedPerYear || 0)
  //   setRoiInFirstYear(tmpSetRoiInFirstYear || 0)
  //   setKwhSavingPerYear(tmpSetKwhSavingPerYear || 0)
  //   setKgCo2SavingPerYear(tmpSetKgCo2SavingPerYear || 0)
    
  //   // output variables
  //   localStorage.setItem("roiInFirstYear", roiInFirstYear)
  //   localStorage.setItem("kwhSavingPerYear", kwhSavingPerYear)
  //   localStorage.setItem("kgCo2SavingPerYear", kgCo2SavingPerYear)
  //   localStorage.setItem("savedPerYear", savedPerYear)
  //   localStorage.setItem("costToReplace", costToReplace)
  // }, [
  //   wattageToBeReplaced,
  //   wattageReplacement,
  //   runningTimeHPD,
  //   energyCost,
  //   numberOfBulbsReplaced,
  //   costPerBulb,
  //   myRewardDiscount,
  //   emissionsPerKwh
  // ])

  return (
    <div className="App">
      <h1>Lightbulb Savings Calculator</h1>
      <h2>Amount Saved: {formatter.format(savedPerYear)}</h2>
      <div>Cost to replace: {formatter.format(costToReplace)}</div>
      <div>Return on Investment In First Year: {formatter.format(roiInFirstYear)}</div>
      <div>Energy Saving Per Year (kWh): {kwhSavingPerYear}</div>
      <div>Co2 Saving Per Year (kg): {kgCo2SavingPerYear}</div>
      <br/>
      <AppComponent></AppComponent>
    </div>
  );
}

export default App;
