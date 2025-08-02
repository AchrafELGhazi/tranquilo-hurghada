import React, { useState, useEffect } from 'react';
import { I18nProvider } from '@/contexts/I18nContext';
import { LoadingScreen } from '@/components/common/LoadingScreen';

import '@/styles/globals.css';

type PageType = 'home' | 'profile' | 'settings';

const App: React.FC = () => {
      const [isLoading, setIsLoading] = useState(true);
      const [loadingProgress, setLoadingProgress] = useState(0);
      const [currentPage, setCurrentPage] = useState<PageType>('home');

      useEffect(() => {
            const initializeApp = async () => {
                  // Simulate loading steps with progress updates
                  const steps = [
                        { message: 'Loading translations...', progress: 25 },
                        { message: 'Initializing components...', progress: 50 },
                        { message: 'Setting up theme...', progress: 75 },
                        { message: 'Almost ready...', progress: 100 },
                  ];

                  for (const step of steps) {
                        setLoadingProgress(step.progress);
                        await new Promise(resolve => setTimeout(resolve, 500));
                  }

                  // Final delay to show completion
                  await new Promise(resolve => setTimeout(resolve, 300));
                  setIsLoading(false);
            };

            initializeApp();
      }, []);

      const renderPage = (): React.ReactNode => {
            switch (currentPage) {
                  case 'home':
                        return <Home />;
                  case 'profile':
                        return <Profile />;
                  case 'settings':
                        return <Settings />;
                  default:
                        return <Home />;
            }
      };

      if (isLoading) {
            return (
                        <I18nProvider>
                              <LoadingScreen progress={loadingProgress} showProgress={true} />
                        </I18nProvider>
            );
      }

      return (
                  <I18nProvider>
                        <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
                              {renderPage()}
                        </Layout>
                  </I18nProvider>
      );
};

export default App;
