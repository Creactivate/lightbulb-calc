import React, { useState, useEffect } from "react";



class AppComponent extends React.Component {
    state = {
      numChildren: Number(localStorage.getItem("numChildren")),
      rooms: JSON.parse(localStorage.getItem("rooms") || JSON.stringify([{
        'name':'input1',
        'wattageToBeReplaced': '100',
        'wattageReplacement': '13',
        'runningTimeHPD': '1',
        'energyCost': '0.44',
        'numberOfBulbsReplaced': '1',
        'costPerBulb': '2.50',
        'myRewardDiscount': '0',
        'emissionsPerKwh': '0.193',
      }])),
      results: {},
      simple: localStorage.getItem("simple") || "simple"
    }
  
    render () {
      const children = [];
      let tmpRooms = this.state.rooms
      
      const updateNumbers = (tempRooms) => {
        tempRooms.forEach((room, index) => {
          room.name = 'input' + index
        });
      }

      const formatter = new Intl.NumberFormat("en-GB", {style: "currency", currency: "GBP", minimumFractionDigits: 2})


      updateNumbers(tmpRooms);
      
      localStorage.setItem("rooms", JSON.stringify(tmpRooms))
      localStorage.setItem("simple", this.state.simple)

      for (var i = 0; i < this.state.rooms.length; i += 1) {
        children.push(<TestRoom key={i} index={i} setRooms={this.onTest} rooms={this.state.rooms[i]} remove={this.onRemoveChild} simple={this.state.simple} />);
      };

      const calcGlobalValues = () => {
        let costToReplace = 0;
        let kwhSavingPerYear = 0;
        let savedInFirstYear = 0;
        let grossSavedPerYear = 0;
        let roiInFirstYear = 0;
        let kgCo2SavingPerYear = 0;
        let currentCost = 0;
        let newCost = 0;
        
        // calculate output functions
        const calcCostToReplace = (tmpCostPerBulb, tmpNumberOfBulbsReplaced, tmpMyRewardDiscount) => {
          return tmpCostPerBulb * tmpNumberOfBulbsReplaced * ((100 - tmpMyRewardDiscount) / 100)
        }
        const calcCurrentCost = (tmpWattageToBeReplaced, tmpRunningTimeHPD, tmpNumberOfBulbsReplaced, tmpEnergyCost) => {
          return ((tmpWattageToBeReplaced * tmpRunningTimeHPD * 365 * tmpNumberOfBulbsReplaced) / 1000) * tmpEnergyCost
        }
        const calcNewCost = (tmpWattageReplacement, tmpRunningTimeHPD, tmpNumberOfBulbsReplaced, tmpEnergyCost) => {
          return ((tmpWattageReplacement * tmpRunningTimeHPD * 365 * tmpNumberOfBulbsReplaced) / 1000) * tmpEnergyCost
        }
        const calcKwhSavingPerYear = (tmpWattageToBeReplaced, tmpWattageReplacement, tmpRunningTimeHPD, tmpNumberOfBulbsReplaced) => {
          return ((tmpWattageToBeReplaced - tmpWattageReplacement) * tmpRunningTimeHPD * 365 * tmpNumberOfBulbsReplaced) / 1000
        }
        const calcSavedInFirstYear = (tmpKwhSavingPerYear, tmpEnergyCost, tmpCostToReplace) => {
          return (tmpKwhSavingPerYear * tmpEnergyCost) - tmpCostToReplace;
        }
        const calcGrossSavedPerYear = (tmpKwhSavingPerYear, tmpEnergyCost) => {
          return (tmpKwhSavingPerYear * tmpEnergyCost);
        }
        const calcRoiInFirstYear = (tmpSavedPerYear, tmpCostToReplace) => {
          return ((tmpSavedPerYear - tmpCostToReplace) / tmpCostToReplace) * 100;
        }
        const calcKgCo2SavingPerYear = (tmpKwhSavingPerYear, tmpEmissions) => {
          return tmpKwhSavingPerYear * tmpEmissions;
        }
        
        this.state.rooms.forEach((room) => {
          let tempcostToReplace = calcCostToReplace(room.costPerBulb, room.numberOfBulbsReplaced, room.myRewardDiscount)
          let tempkwhSavingPerYear = calcKwhSavingPerYear(room.wattageToBeReplaced, room.wattageReplacement, room.runningTimeHPD, room.numberOfBulbsReplaced)
          let tempsavedInFirstYear = calcSavedInFirstYear(tempkwhSavingPerYear, room.energyCost, tempcostToReplace)
          let tempGrossSavedPerYear = calcGrossSavedPerYear(tempkwhSavingPerYear, room.energyCost)
          let temproiInFirstYear = calcRoiInFirstYear(tempsavedInFirstYear, tempcostToReplace)
          let tempkgCo2SavingPerYear = calcKgCo2SavingPerYear(tempkwhSavingPerYear, room.emissionsPerKwh)
          let tempcurrentCost = calcCurrentCost(room.wattageToBeReplaced, room.runningTimeHPD, room.numberOfBulbsReplaced, room.energyCost)
          let tempnewCost = calcNewCost(room.wattageReplacement, room.runningTimeHPD, room.numberOfBulbsReplaced, room.energyCost)
          costToReplace += tempcostToReplace 
          kwhSavingPerYear += tempkwhSavingPerYear 
          savedInFirstYear += tempsavedInFirstYear 
          roiInFirstYear += temproiInFirstYear 
          kgCo2SavingPerYear += tempkgCo2SavingPerYear
          currentCost += tempcurrentCost
          newCost += tempnewCost
          grossSavedPerYear += tempGrossSavedPerYear
        })

        return {
          costToReplace,
          kwhSavingPerYear,
          savedInFirstYear,
          roiInFirstYear,
          kgCo2SavingPerYear,
          currentCost,
          newCost,
          grossSavedPerYear
        }
      }

      const toggleSimple = () => {
        const temprooms = this.state.rooms
        
        temprooms.forEach(room => {
          room['wattageToBeReplaced'] = '100'
          room['wattageReplacement'] = '13'
          room['emissionsPerKwh'] = '0.193'
          room['energyCost'] = '0.44'
          room['myRewardDiscount'] = '0'
        })

        let tempsimple = this.state.simple === 'simple' ? 'advanced' : 'simple'

        this.setState({
          rooms: temprooms,
          numChildren: this.state.numChildren,
          results: this.state.results,
          simple: tempsimple
        })

        localStorage.setItem("simple", this.state.simple)
      }
  
      return (
        <>
        <h1>Lightbulb Savings Calculator</h1>
        <h2>Amount Saved in First Year: {formatter.format(calcGlobalValues().savedInFirstYear)}</h2>
        <h3>Energy Saving Per Year (kWh): {Math.round((calcGlobalValues().kwhSavingPerYear + Number.EPSILON) * 100) / 100}</h3>
        <div className="bold">Cost to replace: {formatter.format(calcGlobalValues().costToReplace)}</div>
        <br/>
        <details>
        <summary>More Details</summary>
        {/* <div className="details">Cost to replace: {formatter.format(calcGlobalValues().costToReplace)}</div> */}
        <div className="details">Return on Investment in First Year: {Math.round((calcGlobalValues().roiInFirstYear + Number.EPSILON) * 100) / 100}%</div>
        <div className="details">Current Cost to Run Per Year: {formatter.format(calcGlobalValues().currentCost)}</div>
        <div className="details">Replaced Cost to Run Per Year: {formatter.format(calcGlobalValues().newCost)}</div>
        <div className="details">Gross Savings Per Year: {formatter.format(calcGlobalValues().grossSavedPerYear)}</div>
        <div className="details">Energy Saving Per Year (kWh): {Math.round((calcGlobalValues().kwhSavingPerYear + Number.EPSILON) * 100) / 100}</div>
        <div className="details last">Co2 Saving Per Year (kg): {Math.round((calcGlobalValues().kgCo2SavingPerYear + Number.EPSILON) * 100) / 100}</div>
        
        </details>
        
        <input id='toggleButton' className={this.state.simple === 'advanced'?'buttons advanced':'buttons'} type='button' value='Toggle Simple/Advanced Fields' onClick={() => toggleSimple()} />
        {this.state.simple === 'simple' ? <p>Asssumptions: Average CO2 Emissions Per kWh = 0.193kg/kWh, Energy Cost = £0.44/kWh, My Reward Discount = 0%</p> : undefined}
        <ParentComponent addChild={this.onAddChild} removeChild={this.onRemoveChild} simple={this.state.simple}>
          {children}
        </ParentComponent>
        </>
      );
    }
  
    onAddChild = () => {
      localStorage.setItem("numChildren", Number(this.state.numChildren + 1))
      let newRooms = this.state.rooms
      newRooms.push({
        'name':'input'+String(newRooms.length+1),
        'wattageToBeReplaced': '100',
        'wattageReplacement': '13',
        'runningTimeHPD': '1',
        'energyCost': '0.44',
        'numberOfBulbsReplaced': '1',
        'costPerBulb': '2.50',
        'myRewardDiscount': '0',
        'emissionsPerKwh': '0.193',
      })
      this.setState({
        numChildren: this.state.numChildren + 1,
        rooms: newRooms,
        simple: this.state.simple
      });
      localStorage.setItem("rooms", JSON.stringify(this.state.rooms))
    }

    onRemoveChild = (toRemove) => {
      let tempState = this.state.rooms
      let removeIndex = 0
      toRemove && tempState.forEach((room, index) => {
        if (room.name === toRemove) {
          removeIndex = index
          console.log('found', removeIndex)
        }
      });
      console.log('before',tempState)
      console.log('toremove',toRemove)
      tempState.splice(removeIndex,1)
      console.log('after',tempState)

      this.setState({
        numChildren: this.state.numChildren,
        rooms: tempState,
        simple: this.state.simple
      });
      localStorage.setItem("rooms", JSON.stringify(this.state.rooms))
    }

    onTest = (roomToUpdate) => {
      let tempState = this.state.rooms
      let updateIndex = 0
      roomToUpdate && tempState.forEach((room, index) => {
        if (room.name === roomToUpdate.name) {
          updateIndex = index
          console.log('found', updateIndex)
        }
      });
      console.log('before',tempState)
      console.log('roomToUpdate',roomToUpdate)
      tempState[updateIndex] = roomToUpdate
      console.log('after',tempState)

      this.setState({
        numChildren: this.state.numChildren,
        rooms: tempState,
        simple: this.state.simple
      });
      localStorage.setItem("rooms", JSON.stringify(this.state.rooms))
    }
  }
  
  const ParentComponent = props => (
    <div className="card calculator">
      <h3><input type='button' onClick={props.addChild} className='buttons' value='Add Another Room'/></h3>
      <div id="children-pane">
        {props.children}
      </div>
    </div>
  );
  
  const TestRoom = props => {
    
    const [innerRoom, setInnerRoom] = useState(props.rooms)
    
    const print = (updateItem, field) => {
      console.log('hi')
      const tmpRoom = innerRoom
      tmpRoom[field] = updateItem
      console.log(tmpRoom)
      setInnerRoom(tmpRoom)
      console.log('innerRoom',innerRoom)
      props.setRooms(innerRoom)
    }

    useEffect(() => {
      console.log('effect', innerRoom)
    },[innerRoom])

    return (
      <>
      <h2>Room {props.index + 1}</h2>
      <form className="calc-form">
        <label>Bulb Wattage (To be replaced)
          {/* <input type="number" value={innerRoom.wattageToBeReplaced} onChange={e => print(parseInt(e.target.value), 'wattageToBeReplaced')} /> */}
          {props.simple === 'simple' ? <select value={innerRoom.wattageToBeReplaced} onChange={e => print(parseInt(e.target.value), 'wattageToBeReplaced')}>
            <option value='13'>LED (13W)</option>
            <option value='70'>Halogen (70W)</option>
            <option value='20'>CFL (20W)</option>
            <option selected value='100'>Standard (100W)</option>
          </select> : <input type="number" value={innerRoom.wattageToBeReplaced} onChange={e => print(parseInt(e.target.value), 'wattageToBeReplaced')} />}
        </label>
        <label>Bulb Wattage (Replacement)
          {/* <input type="number" value={innerRoom.wattageReplacement} onChange={e => print(parseInt(e.target.value), 'wattageReplacement')} /> */}
          {props.simple === 'simple' ? <select value={innerRoom.wattageReplacement} onChange={e => print(parseInt(e.target.value), 'wattageReplacement')}>
            <option selected value='13'>LED (13W)</option>
            <option value='70'>Halogen (70W)</option>
            <option value='20'>CFL (20W)</option>
            <option value='100'>Standard (100W)</option>
          </select> : <input type="number" value={innerRoom.wattageReplacement} onChange={e => print(parseInt(e.target.value), 'wattageReplacement')} />}
        </label>
        <label>Running Time (Hours per day)
          <input type="number" min="0.0" step="0.5" value={innerRoom.runningTimeHPD} onChange={e => print(e.target.value, 'runningTimeHPD')} />
        </label>
        <label className={props.simple === 'simple' ? 'hideable' : undefined}>Energy Cost (£/kWh)
          <input type="number" min="0.00" step="0.01" value={innerRoom.energyCost} onChange={e => print(e.target.value, 'energyCost')} />
        </label>
        <label>Number of bulbs replaced
          <input type="number" value={innerRoom.numberOfBulbsReplaced || 0} onChange={e => print(parseInt(e.target.value), 'numberOfBulbsReplaced')} />
        </label>
        <label>Cost per bulb (£)
          <input type="number" min="0.00" step="0.01" value={innerRoom.costPerBulb} onChange={e => print(e.target.value, 'costPerBulb')} />
        </label>
        <label className={props.simple === 'simple' ? 'hideable' : undefined}>MyReward Discount (%)
          <input type="number" value={innerRoom.myRewardDiscount} onChange={e => print(e.target.value, 'myRewardDiscount')} />
        </label>
        <label className={props.simple === 'simple' ? 'hideable' : undefined}>Average CO2 Emissions Per kWh (kg/kWh)
          <input type="number" min="0.000" step="0.001" value={innerRoom.emissionsPerKwh || 0} onChange={e => print(e.target.value, 'emissionsPerKwh')} />
        </label>
        <label>
          {/* <input type="number" onChange={e => props.setRooms([{'hi':'hi'}])} id={'input' + props.index} /> */}
          {props.index !== 0 && <><br/><input className="buttons" type="button" value='Remove Room' id={'input' + props.index} onClick={e => props.remove(e.target.id)}/></>}
        </label>
      </form>
      </>
    );
  }

export default AppComponent;

// room inputs are saved in localstorage, outputs are calculated on both a room component and a global app view
// Steps are:
// add a room, choose a name for it (defaults to a number)
// on change of each input global state is updated and also local state files are updated, local output is updated on change of local state, gloabl ouitputs are updated on global change of state
// delete room option, this will need to remove a specific array item from the global rooms state in localstorage
// Reset button
// function to reset naming in state and id attributes
// create a universal update room function
// copyable output string to submit to the team
// what does each room section look like?

// fill out the component
