import { Routes, Route } from "react-router-dom";
import NBAApp from "./NBAApp.jsx";
import AnalysisApp from "./AnalysisApp.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NBAApp />} />
      <Route path="/analysis" element={<AnalysisApp />} />
    </Routes>
  );
}

export default App;
