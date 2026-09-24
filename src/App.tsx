import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UpdatePrompt } from "./components/UpdatePrompt";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { MobileOnlyGate } from "./components/MobileOnlyGate";
import { AddToHomeScreen } from "./components/AddToHomeScreen";
import { PageLoader } from "./components/PageLoader";

// Asynchronously load routes with named export resolution for optimal performance
const HomePage = lazy(() => import("./pages/HomePage").then((module) => ({ default: module.HomePage })));
const WelcomePage = lazy(() => import("./pages/WelcomePage").then((module) => ({ default: module.WelcomePage })));
const LoginPage = lazy(() => import("./pages/LoginPage").then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import("./pages/RegisterPage").then((module) => ({ default: module.RegisterPage })));
const OfflinePage = lazy(() => import("./pages/OfflinePage").then((module) => ({ default: module.OfflinePage })));
const GymDetailPage = lazy(() => import("./pages/GymDetailPage").then((module) => ({ default: module.GymDetailPage })));
const AllGymsPage = lazy(() => import("./pages/AllGymsPage").then((module) => ({ default: module.AllGymsPage })));
const ProfilePage = lazy(() => import("./pages/ProfilePage").then((module) => ({ default: module.ProfilePage })));
const Subscriptions = lazy(() => import("./pages/Subscriptions").then((module) => ({ default: module.default })));
const SubscriptionHistoryPage = lazy(() => import("./pages/SubscriptionHistoryPage").then((module) => ({ default: module.SubscriptionHistoryPage })));
const PaymentPage = lazy(() => import("./pages/PaymentPage").then((module) => ({ default: module.PaymentPage })));
const GymAccessTokenPage = lazy(() => import("./pages/GymAccessTokenPage").then((module) => ({ default: module.GymAccessTokenPage })));
const GymMapPage = lazy(() => import("./pages/GymMapPage").then((module) => ({ default: module.GymMapPage })));

import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader label="در حال آماده‌سازی…" />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
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
        <Route path="/gym/all" element={
          <ProtectedRoute>
            <AllGymsPage />
          </ProtectedRoute>
        } />
        <Route path="/gym-map" element={
          <ProtectedRoute>
            <GymMapPage />
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
        <Route path="/subscriptions/history" element={
          <ProtectedRoute>
            <SubscriptionHistoryPage />
          </ProtectedRoute>
        } />
        <Route path="/subscriptions/payment" element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        } />
        <Route path="/gym-access/tokens" element={
          <ProtectedRoute>
            <GymAccessTokenPage />
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
        <MobileOnlyGate>
          {/* 1. Global Offline Connectivity Tracker */}
          <OfflineIndicator />

          {/* 2. Global Hot Service Worker Dynamic Updater Toast */}
          <UpdatePrompt />

          {/* 3. Add to Home Screen banner + guide */}
          <AddToHomeScreen />

          {/* 4. Suspense Lazy Route Code Splitting Wrapper with Auth State Loading Barrier */}
          <AppContent />
        </MobileOnlyGate>
      </BrowserRouter>
    </AuthProvider>
  );
}
