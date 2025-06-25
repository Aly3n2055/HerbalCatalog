import { Switch, Route } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';

import Home from '@/pages/home';
import Products from '@/pages/products';
import NotFound from '@/pages/not-found';
import Header from '@/components/header';
import BottomNavigation from '@/components/bottom-navigation';
import PWAInstallPrompt from '@/components/pwa-install-prompt';
import CartDrawer from '@/components/cart-drawer';

// Lazy load heavy components
const LazyProductDetail = lazy(() => import('@/pages/product-detail'));
const LazyCheckout = lazy(() => import('@/pages/checkout'));
const LazyAccount = lazy(() => import('@/pages/account'));
const LazyDistributor = lazy(() => import('@/pages/distributor'));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id">
        {(params) => (
          <Suspense fallback={<div className="flex items-center justify-center p-8">Loading product...</div>}>
            <LazyProductDetail {...params} />
          </Suspense>
        )}
      </Route>
      <Route path="/checkout">
        {() => (
          <Suspense fallback={<div className="flex items-center justify-center p-8">Loading checkout...</div>}>
            <LazyCheckout />
          </Suspense>
        )}
      </Route>
      <Route path="/account">
        {() => (
          <Suspense fallback={<div className="flex items-center justify-center p-8">Loading account...</div>}>
            <LazyAccount />
          </Suspense>
        )}
      </Route>
      <Route path="/distributor">
        {() => (
          <Suspense fallback={<div className="flex items-center justify-center p-8">Loading distributor info...</div>}>
            <LazyDistributor />
          </Suspense>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const queryClient = new QueryClient();
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Header />
        <PWAInstallPrompt />
        <CartDrawer />
        <Router />
        <BottomNavigation />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;