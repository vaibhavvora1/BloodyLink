import { createBrowserRouter } from "react-router-dom";
import AdminDashboard from "./Pages/AdminDashboard";
import Navbar from "./Components/Navbar";
import DonorHome from "./Pages/DonorHome";
import Home from "./Pages/Home";
import PatientDashboard from "./Pages/PatientDashboard";
import Register from "./Pages/Register";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
  },
  {
    path: "/donor",
    element: (
      <>
        <Navbar />
        <DonorHome />
      </>
    ),
  },
  {
    path: "/register",
    element: (
      <>
        <Navbar />
        <Register />
      </>
    ),
  },
  {
    path: "/patient-dashboard",
    element: (
      <>
        <Navbar />
        <PatientDashboard />
      </>
    ),
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },
]);