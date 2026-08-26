import { createBrowserRouter } from "react-router-dom";
import AdminDashboard from "./Pages/AdminDashboard";
import Navbar from "./Components/Navbar";
import DonationRequest from "./Pages/DonationRequest";
import DonorHome from "./Pages/DonorHome";
import DonorRequests from "./Pages/Donorrequestt";
import DonorScheduling from "./Pages/DonorScheduling";
import Home from "./Pages/Home";
import PatientDashboard from "./Pages/PatientDashboard";
import Profile from "./Pages/Profile";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import NotificationDemo from "./Pages/NotificationDemo";

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
    path: "/schedule",
    element: (
      <>
        <Navbar />
        <DonorScheduling />
      </>
    ),
  },
  {
    path: "/donor-scheduling",
    element: (
      <>
        <Navbar />
        <DonorScheduling />
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
    path: "/donorrequest",
    element: (
      <>
        <Navbar />
        <DonorRequests />
      </>
    ),
  },
  {
    path: "/donate-request",
    element: (
      <>
        <Navbar />
        <DonorRequests />
      </>
    ),
  },
  {
    path: "/donor/donate-request",
    element: (
      <>
        <Navbar />
        <DonorRequests />
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
    path: "/login",
    element: (
      <>
        <Navbar />
        <Login />
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
  {
    path: "/notifications",
    element: (
      <>
        <Navbar />
        <NotificationDemo />
      </>
    ),
  },
  {
    path: "/notifications-demo",
    element: (
      <>
        <Navbar />
        <NotificationDemo />
      </>
    ),
  },
]);