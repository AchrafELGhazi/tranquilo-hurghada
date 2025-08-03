import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/config/i18n';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { Layout } from './layout/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const initializeApp = async () => {
      const steps = [
        { message: 'Loading translations...', progress: 20, delay: 800 },
        { message: 'Initializing router...', progress: 40, delay: 600 },
        { message: 'Setting up components...', progress: 60, delay: 500 },
        { message: 'Applying theme...', progress: 80, delay: 400 },
        { message: 'Almost ready...', progress: 100, delay: 500 },
      ];

      for (const step of steps) {
        setLoadingProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, step.delay));
      }

      await new Promise(resolve => setTimeout(resolve, 300));
      setIsAppLoading(false);
    };

    initializeApp();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        {isAppLoading ? (
          <LoadingScreen progress={loadingProgress} />
        ) : (
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
          </Layout>
        )}
      </Router>
    </I18nextProvider>
  );
};

export default App;