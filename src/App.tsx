
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Faq from "./pages/Faq";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
