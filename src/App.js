import './App.css';
import { Routes, Route } from "react-router-dom"
import Login from './Components/Login/Login';
import Server from './Components/Server/Server';
import User from './Components/User/User';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/server" exact element={<Server />} />
        <Route path="/user" exact element={<User />} />
      </Routes>
    </div>
  );
}

export default App;
