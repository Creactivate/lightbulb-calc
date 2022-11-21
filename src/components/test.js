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
        'costPerBulb': '2.5',
        'myRewardDiscount': '0',
        'emissionsPerKwh': '0.193',
      }])),
      results: {},
      simple: false
        // {
        //     roomName: 'testname',
        //     wattageToBeReplaced: 'test',
        //     setWattageToBeReplaced: 'test',
        //     wattageReplacement: 'test',
        //     setWattageReplacement: 'test',
        //     runningTimeHPD: 'test',
        //     setRunningTimeHPD: 'test',
        //     energyCost: 'test',
        //     setEnergyCost: 'test',
        //     numberOfBulbsReplaced: 'test',
        //     setNumberOfBulbsReplaced: 'test',
        //     costPerBulb: 'test',
        //     setCostPerBulb: 'test',
        //     myRewardDiscount: 'test',
        //     setMyRewardDiscount: 'test',
        //     emissionsPerKwh: 'test',
        //     setEmissionsPerKWH: 'test',
        // },
      
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
      for (var i = 0; i < this.state.rooms.length; i += 1) {
        children.push(<TestRoom key={i} index={i} setRooms={this.onTest} rooms={this.state.rooms[i]} remove={this.onRemoveChild} simple={this.state.simple} />);
      };

      const calcGlobalValues = () => {
        let costToReplace = 0;
        let kwhSavingPerYear = 0;
        let savedPerYear = 0;
        let roiInFirstYear = 0;
        let kgCo2SavingPerYear = 0;
        
        // calculate output functions
        const calcCostToReplace = (tmpCostPerBulb, tmpNumberOfBulbsReplaced, tmpMyRewardDiscount) => {
          return tmpCostPerBulb * tmpNumberOfBulbsReplaced * ((100 - tmpMyRewardDiscount) / 100)
        }
        const calcKwhSavingPerYear = (tmpWattageToBeReplaced, tmpWattageReplacement, tmpRunningTimeHPD, tmpNumberOfBulbsReplaced) => {
          return ((tmpWattageToBeReplaced - tmpWattageReplacement) * tmpRunningTimeHPD * 365 * tmpNumberOfBulbsReplaced) / 1000
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
        
        this.state.rooms.forEach((room) => {
          let tempcostToReplace = calcCostToReplace(room.costPerBulb, room.numberOfBulbsReplaced, room.myRewardDiscount)
          let tempkwhSavingPerYear = calcKwhSavingPerYear(room.wattageToBeReplaced, room.wattageReplacement, room.runningTimeHPD, room.numberOfBulbsReplaced)
          let tempsavedPerYear = calcSavedPerYear(tempkwhSavingPerYear, room.energyCost)
          let temproiInFirstYear = calcRoiInFirstYear(tempsavedPerYear, tempcostToReplace)
          let tempkgCo2SavingPerYear = calcKgCo2SavingPerYear(tempkwhSavingPerYear, room.emissionsPerKwh)
          costToReplace += tempcostToReplace 
          kwhSavingPerYear += tempkwhSavingPerYear 
          savedPerYear += tempsavedPerYear 
          roiInFirstYear += temproiInFirstYear 
          kgCo2SavingPerYear += tempkgCo2SavingPerYear 
        })

        return {
          costToReplace,
          kwhSavingPerYear,
          savedPerYear,
          roiInFirstYear,
          kgCo2SavingPerYear
        }
      }

      const toggleSimple = () => {
        this.setState({
          rooms: this.state.rooms,
          numChildren: this.state.numChildren,
          results: this.state.results,
          simple: !this.state.simple
        })
      }
  
      return (
        <>
        <h1>Lightbulb Savings Calculator</h1>
        <h2>Amount Saved: {formatter.format(calcGlobalValues().savedPerYear)}</h2>
        <div>Cost to replace: {formatter.format(calcGlobalValues().costToReplace)}</div>
        <div>Return on Investment In First Year: {formatter.format(calcGlobalValues().roiInFirstYear)}</div>
        <div>Energy Saving Per Year (kWh): {calcGlobalValues().kwhSavingPerYear}</div>
        <div>Co2 Saving Per Year (kg): {calcGlobalValues().kgCo2SavingPerYear}</div>
        <br/>
        <input type='button' value='Toggle Simple/Advanced Fields' onClick={toggleSimple} />
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
        'costPerBulb': '2.5',
        'myRewardDiscount': '0',
        'emissionsPerKwh': '0.193',
      })
      this.setState({
        numChildren: this.state.numChildren + 1,
        rooms: newRooms
      });
      localStorage.setItem("rooms", JSON.stringify(this.state.rooms))
    }

    onRemoveChild = (toRemove) => {
      let tempState = this.state.rooms
      let removeIndex = 0
      toRemove && tempState.forEach((room, index) => {
        if (room.name == toRemove) {
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
        rooms: tempState
      });
      localStorage.setItem("rooms", JSON.stringify(this.state.rooms))
    }

    onTest = (roomToUpdate) => {
      let tempState = this.state.rooms
      let updateIndex = 0
      roomToUpdate && tempState.forEach((room, index) => {
        if (room.name == roomToUpdate.name) {
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
        rooms: tempState
      });
      localStorage.setItem("rooms", JSON.stringify(this.state.rooms))
    }
  }
  
  const ParentComponent = props => (
    <div className="card calculator">
      <h3><a href="#" onClick={props.addChild}>Add Another Room</a></h3>
      {/* <p><a href="#" onClick={props.removeChild}>Remove Child Component</a></p> */}
      <div id="children-pane">
        {props.children}
      </div>
    </div>
  );
  
  const TestRoom = props => {
    
    const [innerRoom, setInnerRoom] = useState(props.rooms)
        // 'wattageToBeReplaced':0,
        // 'wattageReplacement':0,
        // 'runningTimeHPD':0,
        // 'energyCost':0,
        // 'numberOfBulbsReplaced':0,
        // 'costPerBulb':0,
        // 'myRewardDiscount':0,
        // 'costToReplace':0,
    
    const print = (updateItem, field) => {
      console.log('hi')
      const tmpRoom = innerRoom
      tmpRoom[field] = updateItem
      console.log(tmpRoom)
      setInnerRoom(tmpRoom)
      console.log('innerRoom',innerRoom)
      props.setRooms(innerRoom)
    }

    const inputFields = [
      'wattageToBeReplaced',
      'wattageReplacement',
      'runningTimeHPD',
      'energyCost',
      'numberOfBulbsReplaced',
      'costPerBulb',
      'myRewardDiscount',
      'costToReplace'
    ]

    const outputs = [
      'roiInFirstYear',
      'kwhSavingPerYear',
      'kgCo2SavingPerYear',
      'savedPerYear',
      'costToReplace'
    ]

    // calculate output functions
    const calcCostToReplace = (tmpCostPerBulb, tmpNumberOfBulbsReplaced, tmpMyRewardDiscount) => {
      return tmpCostPerBulb * tmpNumberOfBulbsReplaced * ((100 - tmpMyRewardDiscount) / 100)
    }
    const calcKwhSavingPerYear = (tmpWattageToBeReplaced, tmpWattageReplacement, tmpRunningTimeHPD, tmpNumberOfBulbsReplaced) => {
      return ((tmpWattageToBeReplaced - tmpWattageReplacement) * tmpRunningTimeHPD * 365 * tmpNumberOfBulbsReplaced) / 1000
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

    useEffect(() => {
      console.log('effect', innerRoom)
    },[innerRoom])

    return (
      <>
      <h2>Room {props.index + 1}</h2>
      <form className="calc-form">
        <label>Bulb Wattage (To be replaced)
          {/* <input type="number" value={innerRoom.wattageToBeReplaced} onChange={e => print(parseInt(e.target.value), 'wattageToBeReplaced')} /> */}
          <select value={innerRoom.wattageToBeReplaced} onChange={e => print(parseInt(e.target.value), 'wattageToBeReplaced')}>
            <option value='13'>LED (13W)</option>
            <option value='70'>Halogen (70W)</option>
            <option value='20'>CFL (20W)</option>
            <option value='100'>Standard (100W)</option>
          </select>         
        </label>
        <label>Bulb Wattage (Replacement)
          {/* <input type="number" value={innerRoom.wattageReplacement} onChange={e => print(parseInt(e.target.value), 'wattageReplacement')} /> */}
          <select value={innerRoom.wattageReplacement} onChange={e => print(parseInt(e.target.value), 'wattageReplacement')}>
            <option value='13'>LED (13W)</option>
            <option value='70'>Halogen (70W)</option>
            <option value='20'>CFL (20W)</option>
            <option value='100'>Standard (100W)</option>
          </select>
        </label>
        <label>Running Time (Hours per day)
          <input type="number" value={innerRoom.runningTimeHPD} onChange={e => print(e.target.value, 'runningTimeHPD')} />
        </label>
        <label className={props.simple ? 'hideable' : undefined}>Energy Cost (kWh)
          <input type="number" value={innerRoom.energyCost} onChange={e => print(e.target.value, 'energyCost')} />
        </label>
        <label>Number of bulbs replaced
          <input type="number" value={innerRoom.numberOfBulbsReplaced || 0} onChange={e => print(parseInt(e.target.value), 'numberOfBulbsReplaced')} />
        </label>
        <label>Cost per bulb
          <input type="number" value={innerRoom.costPerBulb} onChange={e => print(e.target.value, 'costPerBulb')} />
        </label>
        <label className={props.simple ? 'hideable' : undefined}>MyReward Discount
          <input type="number" value={innerRoom.myRewardDiscount} onChange={e => print(e.target.value, 'myRewardDiscount')} />
        </label>
        <label className={props.simple ? 'hideable' : undefined}>CO2 Emissions (kg/kWh)
          <input type="number" value={innerRoom.emissionsPerKwh || 0} onChange={e => print(e.target.value, 'emissionsPerKwh')} />
        </label>
        <label>
          {/* <input type="number" onChange={e => props.setRooms([{'hi':'hi'}])} id={'input' + props.index} /> */}
          <input type="button" value='Remove Room' id={'input' + props.index} onClick={e => props.remove(e.target.id)}/>
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
