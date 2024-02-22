import './App.css';
import Phone from './Phone';
import Address from './Address';
import Turbine from './Turbine';

import React from 'react';
import { useState } from 'react';

function App() {
  const [selectedForm, setSelectedForm] = useState(null);

  const handleChange = (event) => {
    setSelectedForm(event.target.value);
  }

  return (
    <div className="App">
      <h1>Sort Data Service</h1>
      <p>Welcome to the sort data service, where you can upload different types of data, sort them in different ways, and finally redownload your data. Keep in mind that this service is still under development</p>
      <h2>Type of Data</h2>
      <form>
        <label><input type="radio" name="datatype" text="Phone Number" value="phone" checked={selectedForm === "phone"} onChange={handleChange}></input>Phone Number</label>
        <label><input type="radio" name="datatype" text="Adresses" value="address" checked={selectedForm === "address"} onChange={handleChange}></input>Addresses</label>
        <label><input type="radio" name="datatype" text="Turbines and IBR's" value="turbine" checked={selectedForm === "turbine"} onChange={handleChange}></input>Turbines and IBR's</label>
      </form>
      {selectedForm === "phone" && <Phone />}
      {selectedForm === "address" && <Address />}
      {selectedForm === "turbine" && <Turbine />}
    </div>
    
  );
}

export default App;
