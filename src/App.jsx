// App.jsx
import { Routes, Route, BrowserRouter } from "react-router-dom";
import TopBar from "./nav/Topbar";
import Navbar from "./nav/Navbar";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <TopBar />
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}
