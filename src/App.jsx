import { Routes, Route } from "react-router-dom";
import TopBar from "./nav/Topbar";
import Navbar from "./nav/Navbar";
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import Footer from "./footer/Footer";
import ApiManagement from "./pages/ApiManagement";
import ApiList from "./pages/ApiList";

export default function App() {
  return (
    <>
      <TopBar />
      <Navbar />

      {/* KEEP same wrapper & spacing */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/energy-calculation" element={<Calculator />} />
          <Route path="/api-management" element={<ApiManagement />} />
          <Route path="/api-list" element={<ApiList />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
