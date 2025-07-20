// App.js
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import MainChat from "./MainChat";
import SignUp from "./SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/MainChat" element={<MainChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
