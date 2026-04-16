import { Routes, Route } from "react-router-dom";
import NBAApp from "./NBAApp.jsx";
import AnalysisApp from "./AnalysisApp.jsx";
import MLBApp from "./MLBApp.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NBAApp />} />
      <Route path="/analysis" element={<AnalysisApp />} />
      <Route path="/mlb" element={<MLBApp />} />
    </Routes>
  );
}

export default App;
