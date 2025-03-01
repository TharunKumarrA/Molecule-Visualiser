import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import MoleculeVisualizer from "./pages/mainApp";
import Teams from "./pages/Teams";

export default function App() {
  return (
    <Router>
      <div className="bg-[#141414] text-white min-h-screen font-inter">
        <Routes>
          <Route path="/" element={<MoleculeVisualizer />} />
          <Route path="/teams" element={<Teams />} />
        </Routes>
      </div>
    </Router>
  );
}
