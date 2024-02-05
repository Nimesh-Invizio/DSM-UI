import './App.css';
import { Routes, Route } from "react-router-dom"
import Login from './Components/Login/Login';
import Server from './Components/Server/Server';
import User from './Components/User/User';
import Company from './Components/Company/company';
import Shop from './Components/Shop/Shop';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/server" exact element={<Server />} />
        <Route path="/server/company" exact element={<Company />} />
        <Route path="/server/company/shop" exact element={<Shop />} />
        <Route path="/user" exact element={<User />} />
      </Routes>
    </div>
  );
}

export default App;
