import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importación correcta
import Header from './components/ui/Header';
import IncidentReporting from './pages/incident-reporting';
import StudentDashboard from './pages/student-dashboard';
import CampusIncidentMonitor from './pages/campus-incident-monitor';
import Login from './pages/login';
import RequestAssistance from './pages/request-assistance';
import RouteNavigation from './pages/route-navigation';
import DebugPanel from './components/DebugPanel'; // Solo para desarrollo

function App() {
  return (
    <Router> {/* Ahora Router está importado correctamente */}
      <div className="min-h-screen bg-background">
        <main>
          <Routes>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/incident-reporting" element={<IncidentReporting />} />
            <Route path="/campus-incident-monitor" element={<CampusIncidentMonitor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/request-assistance" element={<RequestAssistance />} />
            <Route path="/route-navigation" element={<RouteNavigation />} />
          </Routes>
        </main>
        
        {/* Panel de debug solo en desarrollo 
        {process.env.NODE_ENV === 'development' && <DebugPanel />}*/}
      </div>
    </Router>
  );
}

export default App;