import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/utils/i18n';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { Layout } from './layout/public/Layout';
import { About } from './pages/guest/About';
import { Services } from './pages/guest/Services';
import { Contact } from './pages/guest/Contact';
import { NotFound } from './pages/guest/NotFound';
import { AdminLayout } from './layout/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Unauthorized } from './pages/guest/Unauthorized';
import { Login } from './pages/guest/Login';
import { Register } from './pages/guest/Register';
import { VisitorInfo } from './pages/guest/VisitorInfo';
import Home from './pages/guest/Home';
import ScrollToTop from './utils/scrollToTop';
import { supportedLanguages } from '@/utils/constants';
import { normalizeLanguageCode } from '@/utils/normalizeLanguageCode';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Booking from './pages/guest/Booking';
import MyBookings from './pages/guest/MyBookings';
import Profile from './pages/guest/Profile';

const RootRedirect: React.FC = () => {
    const storedLang = localStorage.getItem('preferred-language');
    const targetLang =
        storedLang && supportedLanguages.includes(storedLang as any)
            ? storedLang
            : normalizeLanguageCode(navigator.language);

    return <Navigate to={`/${targetLang}`} replace />;
};

const LanguageRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { lang } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [isValidating, setIsValidating] = useState(true);

    useEffect(() => {
        const validateLanguage = () => {
            if (!lang) {
                navigate('/', { replace: true });
                return;
            }

            const normalizedLang = normalizeLanguageCode(lang);

            // If language needs normalization, redirect
            if (lang !== normalizedLang) {
                const pathSegments = location.pathname.split('/');
                pathSegments[1] = normalizedLang;
                const newPath = pathSegments.join('/') + location.search;
                navigate(newPath, { replace: true });
                return;
            }

            // If language is not supported, redirect to English version
            if (!supportedLanguages.includes(normalizedLang as any)) {
                const pathSegments = location.pathname.split('/');
                pathSegments[1] = 'en';
                const newPath = pathSegments.join('/') + location.search;
                navigate(newPath, { replace: true });
                return;
            }

            // Valid language - sync i18n and localStorage
            if (i18n.language !== normalizedLang) {
                i18n.changeLanguage(normalizedLang);
            }
            localStorage.setItem('preferred-language', normalizedLang);

            // Language is valid, allow rendering
            setIsValidating(false);
        };

        validateLanguage();
    }, [lang, location.pathname, location.search, navigate]);

    // Show nothing while validating/redirecting
    if (isValidating) {
        return null;
    }

    // Language is valid, render children
    return <>{children}</>;
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
        <div className='bg-cream'>
            <I18nextProvider i18n={i18n}>
                <AuthProvider>
                    <Router>
                        <ScrollToTop />
                        {isAppLoading ? (
                            <LoadingScreen progress={loadingProgress} />
                        ) : (
                            <Routes>
                                {/* Root path redirect */}
                                <Route path='/' element={<RootRedirect />} />

                                {/* Public Routes */}
                                <Route
                                    path='/:lang'
                                    element={
                                        <LanguageRoute>
                                            <Layout>
                                                <Outlet />
                                            </Layout>
                                        </LanguageRoute>
                                    }
                                >
                                    <Route index element={<Home />} />
                                    <Route path='about' element={<About />} />
                                    <Route path='services' element={<Services />} />
                                    <Route path='visitorInfo' element={<VisitorInfo />} />
                                    <Route path='contact' element={<Contact />} />
                                    <Route path='profile' element={<Profile />} />
                                    <Route path='booking' element={<Booking />} />
                                    <Route path='my-bookings' element={<MyBookings />} />
                                    <Route path='signin' element={<Login />} />
                                    <Route path='register' element={<Register />} />
                                    <Route path='404' element={<NotFound />} />
                                    <Route path='unauthorized' element={<Unauthorized />} />
                                </Route>

                                <Route
                                    path='/:lang/auth'
                                    element={
                                        <LanguageRoute>
                                            <Layout>
                                                <Outlet />
                                            </Layout>
                                        </LanguageRoute>
                                    }
                                >
                                    <Route path='login' element={<Login />} />
                                    <Route path='register' element={<Register />} />
                                </Route>

                                {/* Protected Admin Routes */}
                                <Route
                                    path='/:lang/admin'
                                    element={
                                        <LanguageRoute>
                                            <ProtectedRoute requireAdmin>
                                                <AdminLayout>
                                                    <Outlet />
                                                </AdminLayout>
                                            </ProtectedRoute>
                                        </LanguageRoute>
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
