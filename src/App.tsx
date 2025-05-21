import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context providers
import { AgeGroupProvider } from './context/AgeGroupContext';
import { AuthProvider } from './context/AuthContext';

// Components
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';

// Theme
import { theme } from './theme';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage/HomePage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage/DashboardPage'));
const LearningModulePage = React.lazy(() => import('./pages/LearningModulePage/LearningModulePage'));
const ParentDashboardPage = React.lazy(() => import('./pages/ParentDashboardPage/ParentDashboardPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage/AboutPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage/NotFoundPage'));
const TestComponents = React.lazy(() => import('./pages/TestComponents'));

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AgeGroupProvider>
          <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navigation />
              <main style={{ flexGrow: 1 }}>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/learning/:moduleId?" element={<LearningModulePage />} />
                    <Route path="/parent-dashboard" element={<ParentDashboardPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/test-components" element={<TestComponents />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </React.Suspense>
              </main>
              <Footer />
            </div>
          </Router>
        </AgeGroupProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
