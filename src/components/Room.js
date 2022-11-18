import React from "react";


export function Room({
  wattageToBeReplaced,
  setWattageToBeReplaced,
  wattageReplacement,
  setWattageReplacement,
  runningTimeHPD,
  setRunningTimeHPD,
  energyCost,
  setEnergyCost,
  numberOfBulbsReplaced,
  setNumberOfBulbsReplaced,
  costPerBulb,
  setCostPerBulb,
  myRewardDiscount,
  setMyRewardDiscount,
  emissionsPerKwh,
  setEmissionsPerKWH
}) {
  return <form className="calc-form">
        <label>Bulb Wattage (To be replaced)
          <input type="number" value={wattageToBeReplaced} onChange={e => setWattageToBeReplaced(parseInt(e.target.value))} />
        </label>
        <label>Bulb Wattage (Replacement)
          <input type="number" value={wattageReplacement} onChange={e => setWattageReplacement(parseInt(e.target.value))} />
        </label>
        <label>Running Time (Hours per day)
          <input type="number" value={runningTimeHPD} onChange={e => setRunningTimeHPD(e.target.value)} />
        </label>
        <label>Energy Cost (kWh)
          <input type="number" value={energyCost} onChange={e => setEnergyCost(e.target.value)} />
        </label>
        <label>Number of bulbs replaced
          <input type="number" value={numberOfBulbsReplaced} onChange={e => setNumberOfBulbsReplaced(parseInt(e.target.value))} />
        </label>
        <label>Cost per bulb
          <input type="number" value={costPerBulb} onChange={e => setCostPerBulb(e.target.value)} />
        </label>
        <label>MyReward Discount
          <input type="number" value={myRewardDiscount} onChange={e => setMyRewardDiscount(e.target.value)} />
        </label>
        <label>CO2 Emissions (kg/kWh)
          <input type="number" value={emissionsPerKwh} onChange={e => setEmissionsPerKWH(e.target.value)} />
        </label>
        {
      /* <label>Contribution frequency
       <select value={lightbulb type} onChange={(e)=> setLightbulbType(e.target.value)}>
         <option value="LED">LED</option>
         <option value="Halogen">Halogen</option>
       </select>
      </label>*/
    }
      </form>;
}
  export default Room;