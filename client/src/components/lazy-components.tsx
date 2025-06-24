
import { lazy } from 'react';

// Lazy load heavy components
export const LazyProductDetail = lazy(() => import('../pages/product-detail'));
export const LazyCheckout = lazy(() => import('../pages/checkout'));
export const LazyAccount = lazy(() => import('../pages/account'));
export const LazyDistributor = lazy(() => import('../pages/distributor'));

// Lazy load complex components
export const LazyPayPalButton = lazy(() => import('./PayPalButton'));
export const LazyMobileMenu = lazy(() => import('./mobile-menu'));

// Component with suspense wrapper
export function withSuspense<P extends object>(
  Component: React.ComponentType<P>,
  fallback = <div className="flex items-center justify-center p-8">Loading...</div>
) {
  return function SuspenseWrapper(props: P) {
    return (
      <React.Suspense fallback={fallback}>
        <Component {...props} />
      </React.Suspense>
    );
  };
}
