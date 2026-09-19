import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/auth/LoginPage";

import PaymentTestPage from "../pages/bookings/PaymentTestPage";

import MyEventsPage from "../pages/events/MyEventsPage";
import CreateEventPage from "../pages/events/CreateEventPage";
import EventDetailsPage from "../pages/events/EventDetailsPage";
import EditEventPage from "../pages/events/EditEventPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Home */}
          <Route
            path="/"
            element={<HomePage />}
          />

          {/* Authentication */}
          <Route
            path="/login"
            element={<LoginPage />}
          />

          {/* Payment Test */}
          <Route
            path="/payment-test"
            element={<PaymentTestPage />}
          />

          {/* Customer Events */}
          <Route
            path="/events"
            element={<MyEventsPage />}
          />

          {/* Create Event */}
          <Route
            path="/events/create"
            element={<CreateEventPage />}
          />

          {/* Event Details */}
          <Route
            path="/events/:id"
            element={<EventDetailsPage />}
          />

          {/* Edit Event */}
          <Route
            path="/events/:id/edit"
            element={<EditEventPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;