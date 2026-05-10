import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout   from "./layouts/AuthLayout";
import MainLayout   from "./layouts/MainLayout";

import Login           from "./pages/Login";
import Signup          from "./pages/Signup";
import Dashboard       from "./pages/Dashboard";
import CreateTrip      from "./pages/CreateTrip";
import MyTrips         from "./pages/MyTrips";
import ItineraryBuilder from "./pages/ItineraryBuilder";
import ItineraryView   from "./pages/ItineraryView";
import CitySearch      from "./pages/CitySearch";
import ActivitySearch  from "./pages/ActivitySearch";
import Budget          from "./pages/Budget";
import Checklist       from "./pages/Checklist";
import Share           from "./pages/Share";
import Profile         from "./pages/Profile";
import Notes           from "./pages/Notes";
import Admin           from "./pages/Admin";
import AIPlanner       from "./pages/AIPlanner";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard"               element={<Dashboard />} />
          <Route path="/create-trip"             element={<CreateTrip />} />
          <Route path="/my-trips"                element={<MyTrips />} />
          <Route path="/itinerary-builder/:tripId" element={<ItineraryBuilder />} />
          <Route path="/itinerary-view/:tripId"  element={<ItineraryView />} />
          <Route path="/city-search"             element={<CitySearch />} />
          <Route path="/activity-search"         element={<ActivitySearch />} />
          <Route path="/budget/:tripId"          element={<Budget />} />
          <Route path="/checklist/:tripId"       element={<Checklist />} />
          <Route path="/profile"                 element={<Profile />} />
          <Route path="/notes/:tripId"           element={<Notes />} />
          <Route path="/admin"                   element={<Admin />} />
          <Route path="/ai-planner"              element={<AIPlanner />} />
        </Route>

        {/* Public share route */}
        <Route path="/share/:shareCode" element={<Share />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;