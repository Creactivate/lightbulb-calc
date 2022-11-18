import React, { useState, useEffect } from "react";



class AppComponent extends React.Component {
    state = {
      numChildren: Number(localStorage.getItem("numChildren")),
      rooms: JSON.parse(localStorage.getItem("rooms") || JSON.stringify([{"name":"input1","hi":4}]))
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
      const why = 'why';
      let tmpRooms = this.state.rooms
      
      const updateNumbers = (tempRooms) => {
        tempRooms.forEach((room, index) => {
          room.name = 'input' + index
        });
      }

      updateNumbers(tmpRooms);
      
      localStorage.setItem("rooms", JSON.stringify(tmpRooms))
      for (var i = 0; i < this.state.rooms.length; i += 1) {
        children.push(<TestRoom key={i} index={i} setRooms={this.onTest} rooms={this.state.rooms[i]} remove={this.onRemoveChild} />);
      };
  
      return (
        <ParentComponent addChild={this.onAddChild} removeChild={this.onRemoveChild}>
          {children}
        </ParentComponent>
      );
    }
  
    onAddChild = () => {
      localStorage.setItem("numChildren", Number(this.state.numChildren + 1))
      let newRooms = this.state.rooms
      newRooms.push({'name':'input'+String(newRooms.length+1),'hi':9})
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

    onTest = (test) => {
      this.setState({
        numChildren: test,
        rooms: test
      });
      localStorage.setItem("rooms", JSON.stringify(this.state.rooms))
    }
  }
  
  const ParentComponent = props => (
    <div className="card calculator">
      <p><a href="#" onClick={props.addChild}>Add Another Child Component</a></p>
      <p><a href="#" onClick={props.removeChild}>Remove Child Component</a></p>
      <div id="children-pane">
        {props.children}
      </div>
    </div>
  );
  
  const ChildComponent = props => <div>{"I am child " + props.number}</div>;

  const TestRoom = props => {
    const [costToReplace, setCostToReplace] = useState(0)
    const print = (e) => {
      console.log('hi')
      // props.setRooms([{'hi':e}])
      setCostToReplace(e)
    }
    return (
      //   <label>Bulb Wattage (To be replaced)
  //     <input type="number" value={wattageToBeReplaced} onChange={e => setWattageToBeReplaced(parseInt(e.target.value))} />
  //   </label>
  //   <label>Bulb Wattage (Replacement)
  //     <input type="number" value={wattageReplacement} onChange={e => setWattageReplacement(parseInt(e.target.value))} />
  //   </label>
  //   <label>Running Time (Hours per day)
  //     <input type="number" value={runningTimeHPD} onChange={e => setRunningTimeHPD(e.target.value)} />
  //   </label>
  //   <label>Energy Cost (kWh)
  //     <input type="number" value={energyCost} onChange={e => setEnergyCost(e.target.value)} />
  //   </label>
  //   <label>Number of bulbs replaced
  //     <input type="number" value={numberOfBulbsReplaced} onChange={e => setNumberOfBulbsReplaced(parseInt(e.target.value))} />
  //   </label>
  //   <label>Cost per bulb
  //     <input type="number" value={costPerBulb} onChange={e => setCostPerBulb(e.target.value)} />
  //   </label>
  //   <label>MyReward Discount
  //     <input type="number" value={myRewardDiscount} onChange={e => setMyRewardDiscount(e.target.value)} />
  //   </label>
  <>
    <form className="calc-form">
    <label>CO2 Emissions (kg/kWh)
      <input type="number" onChange={e => props.setRooms([{'hi':'hi'}])} id={'input' + props.index} />
      <input type="button" onClick={e => props.remove(e.target.previousSibling.id)}/>
    </label>
    <label>CO2 Emissions (kg/kWh)
      <input type="number" value={costToReplace} onChange={e => print(e.target.value)} />
    </label>
  </form>
  <div>{props.rooms.hi}{costToReplace}</div></>
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
