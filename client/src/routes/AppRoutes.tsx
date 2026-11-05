
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/auth/LoginPage";

import PaymentTestPage from "../pages/bookings/PaymentTestPage";
import CreateBookingPage from "../pages/bookings/CreateBookingPage";

import MyEventsPage from "../pages/events/MyEventsPage";
import CreateEventPage from "../pages/events/CreateEventPage";
import EventDetailsPage from "../pages/events/EventDetailsPage";
import EditEventPage from "../pages/events/EditEventPage";

import PackagesPage from "../pages/packages/PackagesPage";
import PackageDetailsPage from "../pages/packages/PackageDetailsPage";
import ServicesPage from "../pages/services/ServicesPage";

import VendorDashboardPage from "../pages/vendors/VendorDashboardPage";
import VendorServicesPage from "../pages/vendors/VendorServicesPage";
import VendorBookingsPage from "../pages/vendors/VendorBookingsPage";
import VendorProfilePage from "../pages/vendors/VendorProfilePage";
import VendorReviewsPage from "../pages/vendors/VendorReviewsPage";
import VendorPackagesPage from "../pages/vendors/VendorPackagesPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/payment-test"
            element={<PaymentTestPage />}
          />

          <Route
            path="/events"
            element={<MyEventsPage />}
          />

          <Route
            path="/events/create"
            element={<CreateEventPage />}
          />

          <Route
            path="/events/:id"
            element={<EventDetailsPage />}
          />

          <Route
            path="/events/:id/edit"
            element={<EditEventPage />}
          />

          <Route
            path="/services"
            element={<ServicesPage />}
          />

          <Route
            path="/packages"
            element={<PackagesPage />}
          />

          <Route
            path="/packages/:id"
            element={<PackageDetailsPage />}
          />

          <Route
            path="/vendors/:id"
            element={<VendorProfilePage />}
          />

          <Route
            path="/vendor/dashboard"
            element={<VendorDashboardPage />}
          />

          <Route
            path="/vendor/services"
            element={<VendorServicesPage />}
          />

          <Route
            path="/vendor/packages"
            element={<VendorPackagesPage />}
          />

          <Route
            path="/vendor/bookings"
            element={<VendorBookingsPage />}
          />

          <Route
            path="/vendor/reviews"
            element={<VendorReviewsPage />}
          />

          <Route
            path="/bookings/create"
            element={<CreateBookingPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
