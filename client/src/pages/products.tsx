
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import ProductCard from "@/components/product-card";
import CategoryCard from "@/components/category-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCardSkeleton, CategoryCardSkeleton } from "@/components/ui/skeleton";
import { Search, Filter } from "lucide-react";
import { Product, Category } from "@shared/schema";

export default function Products() {
  const { category: categorySlug } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  const apiUrl = categorySlug
    ? `/api/products?category=${categorySlug}`
    : searchQuery
    ? `/api/products?search=${searchQuery}`
    : "/api/products";

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: [apiUrl],
    queryFn: async () => {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const selectedCategory = categories.find(cat => cat.slug === categorySlug);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "rating":
        return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="px-4 py-6 pt-20">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedCategory ? selectedCategory.name : "All Products"}
            </h1>
            {selectedCategory && (
              <p className="text-gray-600">{selectedCategory.description}</p>
            )}
          </div>

          {/* Categories Grid - Only show if not in a specific category */}
          {!categorySlug && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Shop by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {categories.length === 0 ? (
                  [...Array(4)].map((_, i) => (
                    <CategoryCardSkeleton key={i} />
                  ))
                ) : (
                  categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))
                )}
              </div>
            </section>
          )}

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-gray-500 text-lg mb-4">
                  {searchQuery ? "No products found matching your search." : "No products available."}
                </p>
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery("")}
                    className="bg-nature-green hover:bg-forest-green"
                  >
                    Clear Search
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}