import { Switch, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';
import { queryClient } from '@/lib/queryClient';

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

function App() {

  const PageLoader = () => (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nature-green"></div>
    </div>
  );

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <div className="min-h-screen bg-gradient-to-br from-nature-light via-white to-sage-light">
          <Header />
          <PWAInstallPrompt />
          <CartDrawer />

          <Suspense fallback={<PageLoader />}>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/products" component={Products} />
              <Route path="/products/:id" component={LazyProductDetail} />
              <Route path="/checkout" component={LazyCheckout} />
              <Route path="/account" component={LazyAccount} />
              <Route path="/distributor" component={LazyDistributor} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>

          <BottomNavigation />
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;