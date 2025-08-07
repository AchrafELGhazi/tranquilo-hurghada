import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useParams, useLocation, useNavigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/utils/i18n';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { Layout } from './layout/public/Layout';
import { About } from './pages/public/About';
import { Services } from './pages/public/Services';
import { Contact } from './pages/public/Contact';
import { NotFound } from './pages/public/NotFound';
import { AdminLayout } from './layout/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Unauthorized } from './pages/public/Unauthorized';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';
import { VisitorInfo } from './pages/public/VisitorInfo';
import Home from './pages/public/Home';

const LanguageRedirect: React.FC = () => {
    const { lang } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!lang) {
            const detectedLang = i18n.language || 'en';
            navigate(`/${detectedLang}${location.pathname}`, { replace: true });
        }
    }, [lang, location, navigate]);

    return null;
};

const App: React.FC = () => {
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        const initializeApp = async () => {
            const steps = [
                { message: 'Loading translations...', progress: 20, delay: 200 },
                { message: 'Initializing router...', progress: 40, delay: 100 },
                { message: 'Setting up components...', progress: 60, delay: 200 },
                { message: 'Applying theme...', progress: 80, delay: 200 },
                { message: 'Almost ready...', progress: 100, delay: 100 },
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
        <div className='min-h-screen bg-cream'>
            <I18nextProvider i18n={i18n}>
                <AuthProvider>
                    <Router>
                        {isAppLoading ? (
                            <LoadingScreen progress={loadingProgress} />
                        ) : (
                            <Routes>
                                <Route path='/' element={<LanguageRedirect />} />

                                {/* Public Routes */}
                                <Route
                                    path='/:lang'
                                    element={
                                        <Layout>
                                            <Outlet />
                                        </Layout>
                                    }
                                >
                                    <Route index element={<Home />} />
                                    <Route path='about' element={<About />} />
                                    <Route path='services' element={<Services />} />
                                    <Route path='visitorInfo' element={<VisitorInfo />} />
                                    <Route path='contact' element={<Contact />} />
                                    <Route path='signin' element={<Login />} />
                                    <Route path='register' element={<Register />} />
                                    <Route path='404' element={<NotFound />} />
                                    <Route path='unauthorized' element={<Unauthorized />} />
                                </Route>

                                <Route
                                    path='/:lang/auth'
                                    element={
                                        <Layout>
                                            <Outlet />
                                        </Layout>
                                    }
                                >
                                    <Route path='login' element={<Login />} />
                                    <Route path='register' element={<Register />} />{' '}
                                </Route>

                                {/* Protected Admin Routes */}
                                <Route
                                    path='/:lang/admin'
                                    element={
                                        <ProtectedRoute requireAdmin>
                                            <AdminLayout>
                                                <Outlet />
                                            </AdminLayout>
                                        </ProtectedRoute>
                                    }
                                >
                                    <Route index element={<AdminDashboard />} />
                                </Route>

                                <Route path='*' element={<NotFound />} />
                            </Routes>
                        )}
                    </Router>
                </AuthProvider>
            </I18nextProvider>
        </div>
    );
};

export default App;
