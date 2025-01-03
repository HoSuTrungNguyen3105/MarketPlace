import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navigation/Navbar";
import Sidebar from "./components/Navigation/Sidebar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Sidebar />
      <div className="content-area">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
