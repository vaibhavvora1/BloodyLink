import { createBrowserRouter } from "react-router-dom";
import AdminDashboard from "./Pages/AdminDashboard";
import Navbar from "./Components/Navbar";
import DonationRequest from "./Pages/DonationRequest";
import DonorHome from "./Pages/DonorHome";
import Home from "./Pages/Home";
import PatientDashboard from "./Pages/PatientDashboard";
import Profile from "./Pages/Profile";
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
    path: "/request-blood",
    element: (
      <>
        <Navbar />
        <DonationRequest />
      </>
    ),
  },
  {
    path: "/donation-request",
    element: (
      <>
        <Navbar />
        <DonationRequest />
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
    path: "/profile",
    element: (
      <>
        <Navbar />
        <Profile />
      </>
    ),
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },
]);