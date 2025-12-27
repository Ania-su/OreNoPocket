import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import Nice from "./components/Nice";
import Home from "./components/Home";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/nice" element={<Nice/>} />
      </Routes>
    </Router>
  );
}

export default App;
