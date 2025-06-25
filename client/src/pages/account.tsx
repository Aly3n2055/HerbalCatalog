import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/header";
import CartDrawer from "@/components/cart-drawer";
import BottomNavigation from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, ShoppingBag, Heart, Settings, LogOut, Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, registerSchema, type LoginData, type RegisterData } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { apiClient } from "@/services/api";

export default function Account() {
  const { user, login, register, logout, isLoading } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({ checking: false, available: null, message: "" });

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      firstName: "",
      lastName: "",
      phone: "",
      role: "customer",
    },
  });

  const onLogin = async (data: LoginData) => {
    await login(data);
  };

  const onRegister = async (data: RegisterData) => {
    // Check username availability before submitting
    if (usernameStatus.available === false) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Please choose a different username.",
      });
      return;
    }
    
    // Validate that required fields are not empty
    if (!data.username || !data.email || !data.password || !data.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    // Validate password confirmation
    if (data.password !== data.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Passwords do not match.",
      });
      return;
    }
    
    await register(data);
  };

  const handleLogout = () => {
    logout();
  };

  // Debounced username availability check
  const checkUsernameAvailability = useCallback(async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameStatus({ checking: false, available: null, message: "" });
      return;
    }

    setUsernameStatus({ checking: true, available: null, message: "Checking..." });

    try {
      const response = await fetch(`/.netlify/functions/check-username?username=${encodeURIComponent(username)}`);
      const result = await response.json();
      setUsernameStatus({
        checking: false,
        available: result.available,
        message: result.available ? "Username is available!" : result.reason || "Username is not available"
      });
    } catch (error) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: "Error checking username availability"
      });
    }
  }, []);

  // Debounce username check
  useEffect(() => {
    const subscription = registerForm.watch((value, { name }) => {
      if (name === "username" && value.username) {
        const timer = setTimeout(() => {
          checkUsernameAvailability(value.username);
        }, 500);
        return () => clearTimeout(timer);
      }
    });

    return () => subscription.unsubscribe();
  }, [registerForm, checkUsernameAvailability]);

  if (user) {
    return (
      <div className="min-h-screen bg-stone-50">
        <CartDrawer />

        <div className="px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-nature-green/10 w-16 h-16 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-nature-green" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Welcome back, {user.firstName || user.username}!
                </h1>
                <p className="text-gray-600">{user.email}</p>
                {user.role === "distributor" && (
                  <Badge className="bg-golden text-white mt-1">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                )}
              </div>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Full Name</label>
                        <p className="text-gray-800">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : user.username}
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-gray-800">{user.email}</p>
                      </div>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-gray-800">{user.phone || "Not provided"}</p>
                      </div>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-gray-600">Account Type</label>
                        <p className="text-gray-800 capitalize">{user.role}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {user.role === "distributor" && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Distributor Dashboard</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-nature-green/10 rounded-lg">
                            <div className="text-2xl font-bold text-nature-green">$0</div>
                            <p className="text-sm text-gray-600">This Month</p>
                          </div>
                          <div className="text-center p-4 bg-golden/10 rounded-lg">
                            <div className="text-2xl font-bold text-golden">$0</div>
                            <p className="text-sm text-gray-600">Total Earnings</p>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <label className="text-sm font-medium text-gray-600">Distributor ID</label>
                          <p className="text-gray-800 font-mono">
                            {user.distributorId || "Not assigned"}
                          </p>
                        </div>
                        <Button className="w-full bg-nature-green hover:bg-forest-green">
                          View Training Materials
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No orders yet</p>
                      <Link href="/products">
                        <Button className="bg-nature-green hover:bg-forest-green">
                          Start Shopping
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        Preferences
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Heart className="h-4 w-4 mr-2" />
                        Wishlist
                      </Button>
                      <Separator />
                      <Button
                        variant="destructive"
                        className="w-full justify-start"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <CartDrawer />

      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {isLogin ? "Welcome Back" : "Join NatureVital"}
              </CardTitle>
              <p className="text-center text-gray-600">
                {isLogin 
                  ? "Sign in to your account to continue" 
                  : "Create your account to get started"}
              </p>
            </CardHeader>
            <CardContent>
              {isLogin ? (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              {...field}
                              value={field.value || ""}
                              onChange={field.onChange}
                              className="touch-feedback"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                {...field}
                                value={field.value || ""}
                                onChange={field.onChange}
                                className="touch-feedback pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-nature-green hover:bg-forest-green touch-feedback"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                placeholder="Choose a username"
                                value={field.value || ""}
                                onChange={(e) => {
                                  const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                                  field.onChange(value);
                                }}
                                autoComplete="username"
                                className="touch-feedback pr-10"
                              />
                              <div className="absolute right-0 top-0 h-full flex items-center px-3">
                                {usernameStatus.checking && (
                                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                )}
                                {!usernameStatus.checking && usernameStatus.available === true && (
                                  <Check className="h-4 w-4 text-green-500" />
                                )}
                                {!usernameStatus.checking && usernameStatus.available === false && (
                                  <X className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            </div>
                          </FormControl>
                          {usernameStatus.message && (
                            <p className={`text-sm ${
                              usernameStatus.available === true 
                                ? 'text-green-600' 
                                : usernameStatus.available === false 
                                ? 'text-red-600' 
                                : 'text-gray-500'
                            }`}>
                              {usernameStatus.message}
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter your email"
                              value={field.value || ""}
                              autoComplete="email"
                              className="touch-feedback"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                name={field.name}
                                autoComplete="new-password"
                                className="touch-feedback pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                name={field.name}
                                autoComplete="new-password"
                                className="touch-feedback pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your first name"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                name={field.name}
                                autoComplete="given-name"
                                className="touch-feedback"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your last name"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                name={field.name}
                                autoComplete="family-name"
                                className="touch-feedback"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={registerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="Enter your phone number"
                              value={field.value || ""}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              autoComplete="tel"
                              className="touch-feedback"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-nature-green hover:bg-forest-green touch-feedback"
                      disabled={isLoading || (usernameStatus.available === false)}
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              )}

              <div className="mt-6 text-center">
                <Button
                  variant="ghost"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-nature-green hover:text-forest-green"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
