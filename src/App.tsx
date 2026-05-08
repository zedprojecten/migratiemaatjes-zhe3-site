import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CookieBanner } from "./components/CookieBanner";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import HoeHetWerkt from "./pages/HoeHetWerkt";
import UseCases from "./pages/UseCases";
import Tarieven from "./pages/Tarieven";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hoe-het-werkt" element={<HoeHetWerkt />} />
          <Route path="/use-cases" element={<UseCases />} />
          <Route path="/tarieven" element={<Tarieven />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </main>
      <Footer />
      <CookieBanner />
    </BrowserRouter>
  );
};

export default App;
