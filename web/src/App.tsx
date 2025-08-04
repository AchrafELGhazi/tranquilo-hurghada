import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Outlet,
    useParams,
    useLocation,
    useNavigate,
} from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/config/i18n';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { Layout } from './layout/public/Layout';
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Profile } from './pages/public/Profile';
import { Settings } from './pages/public/Settings';
import { NotFound } from './pages/public/NotFound';
import { AdminLayout } from './layout/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Unauthorized } from './pages/public/Unauthorized';
import { Login } from './pages/admin/Login';
import { Register } from './pages/admin/Register';

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
                                <Route path='profile' element={<Profile />} />
                                <Route path='settings' element={<Settings />} />
                                <Route path='login' element={<Login />} />
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
    );
};

export default App;
