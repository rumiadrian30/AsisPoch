import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LoginPage from './pages/login';
import RequestAssistance from './pages/request-assistance';
import CampusIncidentMonitor from './pages/campus-incident-monitor';
import StudentDashboard from './pages/student-dashboard';
import IncidentReporting from './pages/incident-reporting';
import RouteNavigation from './pages/route-navigation';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<StudentDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/request-assistance" element={<RequestAssistance />} />
        <Route path="/campus-incident-monitor" element={<CampusIncidentMonitor />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/incident-reporting" element={<IncidentReporting />} />
        <Route path="/route-navigation" element={<RouteNavigation />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
