import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import Auth from "./screens/Auth";
import SurvivalGuide from "./components/SurvivalGuide";

const App = () => {
  return (
    <Router>
      <SurvivalGuide />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  )
}

export default App;