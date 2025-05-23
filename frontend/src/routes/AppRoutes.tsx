import { lazy, Suspense } from 'react'


import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import { useAppSelector } from '../store/store'
import LoginPageLoader from '../skeletons/LoginPageLoader';
import ChatSkeleton from '../skeletons/ChatSkeleton';
import EmailVerification from '../components/EmailVerification';
import WebRtcContextProvider from '../context/WebRtcContext';
import HamburgerContextProvider from '../context/HamburgerContext';
import UserActionsProvider from '../context/UserActionsContext';
const Home = lazy(() => import('../pages/Home'));
const SignUp = lazy(() => import('../pages/SignUp'));
const Login = lazy(() => import('../pages/Login'));
const Chat = lazy(() => import("../pages/Chat"));
function AppRoutes() {
    const { authenticated } = useAppSelector(state => state.auth);
    return (
        <Routes>
            <Route path="/" element={
                <Suspense fallback={<div className='flex justify-center items-center h-screen'>Loading Home...</div>}>

                    <Home />
                </Suspense>
            } />
            <Route path="/signup" element={
                <Suspense fallback={<div className='flex justify-center items-center h-screen'>Loading signup</div>}>
                    <SignUp />
                </Suspense>

            } />
            <Route path="/verify-email" element={
                <Suspense fallback={<div className='flex justify-center items-center h-screen'>Loading Email Verification page</div>}>
                    <EmailVerification />
                </Suspense>

            } />
            <Route path="/login" element={
                <Suspense fallback={<LoginPageLoader />}>
                    <Login />
                </Suspense>

            } />
            <Route path="/chat" element={
                <Suspense fallback={<ChatSkeleton />}>

                    <ProtectedRoute authenticated={authenticated} >
                        <UserActionsProvider>
                            <WebRtcContextProvider >
                                <HamburgerContextProvider>
                                    <Chat />
                                </HamburgerContextProvider>
                            </WebRtcContextProvider>
                        </UserActionsProvider>
                    </ProtectedRoute>
                </Suspense>
            } />
        </Routes>
    )
}

export default AppRoutes