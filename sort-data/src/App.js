import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Sort Data Service</h1>
      <p>Welcome to the sort data service, where you can upload different types of data, sort them in different ways, and finally redownload your data. Keep in mind that this service is still under development</p>
      <h2>Type of Data</h2>
      <form>
        <label><input type="radio" name="datatype" text="Phone Number"></input>Phone Number</label>
        <label><input type="radio" name="datatype" text="Adresses"></input>Adresses</label>
        <label><input type="radio" name="datatype" text="Turbines and IBR's"></input>Turbines and IBR's</label>
      </form>
    </div>
  );
}

export default App;
