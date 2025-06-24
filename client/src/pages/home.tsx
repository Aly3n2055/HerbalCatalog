import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import CartDrawer from "@/components/cart-drawer";
import BottomNavigation from "@/components/bottom-navigation";
import ProductCard from "@/components/product-card";
import CategoryCard from "@/components/category-card";
import PWAInstallPrompt from "@/components/pwa-install-prompt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Link } from "wouter";
import { Product, Category } from "@shared/schema";

export default function Home() {
  const { data: featuredProducts = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products?featured=true"],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <PWAInstallPrompt />
      <Header />
      <CartDrawer />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
          alt="Wellness lifestyle with natural herbs"
          className="w-full h-96 object-cover"
        />
        
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="px-4 w-full">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in">
                Pure. Natural. <span className="text-warm-cream">Powerful.</span>
              </h2>
              <p className="text-white/90 text-lg mb-6 animate-fade-in">
                Discover premium herbal supplements crafted from nature's finest ingredients for optimal wellness.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 animate-fade-in">
                <Link href="/products">
                  <Button className="bg-nature-green text-white px-8 py-3 hover:bg-forest-green transition-colors touch-feedback">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/distributor">
                  <Button
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 border-white/20 hover:bg-white/20 touch-feedback"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h3>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-32 skeleton"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Featured Products</h3>
            <Link href="/products">
              <Button variant="ghost" className="text-nature-green font-medium touch-feedback">
                View All
              </Button>
            </Link>
          </div>
          
          {productsLoading ? (
            <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl min-w-64 h-80 skeleton"></div>
              ))}
            </div>
          ) : (
            <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="min-w-64 flex-shrink-0"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Distributor CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-forest-green to-nature-green text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Join Our Wellness Community</h3>
          <p className="text-lg opacity-90 mb-8">
            Become a NatureVital partner and share the power of natural wellness while building your own business.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-4">💰</div>
              <h4 className="font-semibold mb-2">Competitive Commissions</h4>
              <p className="text-sm opacity-80">Earn up to 30% on personal sales and team bonuses</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-4">🎓</div>
              <h4 className="font-semibold mb-2">Comprehensive Training</h4>
              <p className="text-sm opacity-80">Access to product knowledge and business training</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-4">👥</div>
              <h4 className="font-semibold mb-2">Supportive Community</h4>
              <p className="text-sm opacity-80">Join a network of passionate wellness advocates</p>
            </div>
          </div>
          
          <Link href="/distributor">
            <Button className="bg-white text-nature-green px-8 py-3 hover:bg-gray-100 transition-colors touch-feedback">
              Learn More About Partnership
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">What Our Customers Say</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The turmeric supplement has made such a difference in my joint health. I feel more active and energized than I have in years!"
                </p>
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b17c?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64"
                    alt="Customer Sarah M."
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Sarah M.</p>
                    <p className="text-sm text-gray-500">Verified Customer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Fast shipping, quality products, and excellent customer service. NatureVital has become my go-to for all natural supplements."
                </p>
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64"
                    alt="Customer Mike R."
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Mike R.</p>
                    <p className="text-sm text-gray-500">Verified Customer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Being a distributor has allowed me to share products I truly believe in while building a meaningful income stream."
                </p>
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64"
                    alt="Distributor Emma L."
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Emma L.</p>
                    <p className="text-sm text-gray-500">Gold Partner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4 pb-20 lg:pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold text-nature-green mb-4">NatureVital</h4>
              <p className="text-gray-300 text-sm mb-4">
                Your trusted source for premium natural health products and wellness solutions.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Products</h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/products/supplements" className="hover:text-nature-green transition-colors">Supplements</Link></li>
                <li><Link href="/products/herbal-teas" className="hover:text-nature-green transition-colors">Herbal Teas</Link></li>
                <li><Link href="/products/essential-oils" className="hover:text-nature-green transition-colors">Essential Oils</Link></li>
                <li><Link href="/products/skincare" className="hover:text-nature-green transition-colors">Skincare</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-nature-green transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-nature-green transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-nature-green transition-colors">Return Policy</a></li>
                <li><a href="#" className="hover:text-nature-green transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Business</h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/distributor" className="hover:text-nature-green transition-colors">Become a Partner</Link></li>
                <li><Link href="/account" className="hover:text-nature-green transition-colors">Partner Login</Link></li>
                <li><a href="#" className="hover:text-nature-green transition-colors">Training Portal</a></li>
                <li><a href="#" className="hover:text-nature-green transition-colors">Commission Info</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 NatureVital. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>

      <BottomNavigation />
    </div>
  );
}
