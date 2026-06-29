import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UpdatePrompt } from "./components/UpdatePrompt";
import { OfflineIndicator } from "./components/OfflineIndicator";

// Asynchronously load routes with named export resolution for optimal performance
const HomePage = lazy(() => import("./pages/HomePage").then((module) => ({ default: module.HomePage })));
const WelcomePage = lazy(() => import("./pages/WelcomePage").then((module) => ({ default: module.WelcomePage })));
const LoginPage = lazy(() => import("./pages/LoginPage").then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import("./pages/RegisterPage").then((module) => ({ default: module.RegisterPage })));
const OfflinePage = lazy(() => import("./pages/OfflinePage").then((module) => ({ default: module.OfflinePage })));
const GymDetailPage = lazy(() => import("./pages/GymDetailPage").then((module) => ({ default: module.GymDetailPage })));
// Profile page (new)
const ProfilePage = lazy(() => import("./pages/ProfilePage").then((module) => ({ default: module.ProfilePage })));
// Subscriptions page (new)
const Subscriptions = lazy(() => import("./pages/Subscriptions").then((module) => ({ default: module.default })));

import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Sleek glassmorphic skeleton loader for premium dynamic routes
function LoadingFallback() {
  return (
    <div className="fixed inset-0 bg-[#07070A] z-50 flex flex-col justify-center items-center pointer-events-none select-none">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Pulsating central energy glow */}
        <div className="absolute inset-0 bg-primary/25 rounded-full blur-2xl animate-pulse" />
        
        {/* Double spinning rings */}
        <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-primary animate-spin" />
        <div className="absolute w-12 h-12 rounded-full border-b-2 border-l-2 border-[#FFB000]/60 animate-spin-[reverse_1.5s_linear_infinite]" />
      </div>
      <p className="mt-6 text-sm font-black font-vazir text-primary tracking-widest animate-pulse">FITOPIA</p>
    </div>
  );
}

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/gym/:gymId" element={
          <ProtectedRoute>
            <GymDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/subscriptions" element={
          <ProtectedRoute>
            <Subscriptions />
          </ProtectedRoute>
        } />
        <Route path="/offline" element={<OfflinePage />} />
        {/* Clean redirect for any other path directly to /home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* 1. Global Offline Connectivity Tracker */}
        <OfflineIndicator />

        {/* 2. Global Hot Service Worker Dynamic Updater Toast */}
        <UpdatePrompt />

        {/* 3. Suspense Lazy Route Code Splitting Wrapper with Auth State Loading Barrier */}
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
