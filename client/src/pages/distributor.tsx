import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/header";
import CartDrawer from "@/components/cart-drawer";
import BottomNavigation from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, TrendingUp, Award, DollarSign, BookOpen, Heart } from "lucide-react";
import { insertDistributorLeadSchema, type InsertDistributorLead } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Distributor() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<InsertDistributorLead>({
    resolver: zodResolver(insertDistributorLeadSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  const submitLeadMutation = useMutation({
    mutationFn: async (data: InsertDistributorLead) => {
      const response = await apiRequest("POST", "/api/distributor-leads", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. We'll contact you within 24 hours.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertDistributorLead) => {
    submitLeadMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <CartDrawer />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
          alt="Successful wellness entrepreneurs"
          className="w-full h-80 object-cover"
        />
        
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="px-4 w-full">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in">
                Join the <span className="text-warm-cream">Herbal Wellness Clinic</span> Family
              </h1>
              <p className="text-white/90 text-lg mb-6 animate-fade-in">
                Transform lives through natural wellness while building your own thriving business.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Benefits Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
              Why Partner With Herbal Wellness Clinic?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="bg-nature-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-nature-green" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Competitive Commissions</h3>
                  <p className="text-gray-600 text-sm">
                    Earn up to 30% commission on personal sales plus team bonuses and leadership rewards.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="bg-nature-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-nature-green" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Comprehensive Training</h3>
                  <p className="text-readable-muted text-sm">
                    Access world-class product knowledge, sales training, and business development resources.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="bg-nature-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-nature-green" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Supportive Community</h3>
                  <p className="text-readable-muted text-sm">
                    Join a network of passionate wellness advocates dedicated to helping each other succeed.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Commission Structure */}
          <section className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Our Compensation Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-b from-nature-green/5 to-nature-green/10 rounded-lg">
                    <Badge className="bg-nature-green text-white mb-2">Starter</Badge>
                    <div className="text-2xl font-bold text-nature-green mb-1">20%</div>
                    <p className="text-sm text-gray-600">Personal Sales Commission</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-b from-golden/5 to-golden/10 rounded-lg">
                    <Badge className="bg-golden text-white mb-2">Bronze</Badge>
                    <div className="text-2xl font-bold text-golden mb-1">25%</div>
                    <p className="text-sm text-gray-600">+ Team Bonus Eligible</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-b from-gray-400/5 to-gray-400/10 rounded-lg">
                    <Badge className="bg-gray-500 text-white mb-2">Silver</Badge>
                    <div className="text-2xl font-bold text-gray-600 mb-1">30%</div>
                    <p className="text-sm text-gray-600">+ Leadership Rewards</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-b from-yellow-400/5 to-yellow-400/10 rounded-lg">
                    <Badge className="bg-yellow-500 text-white mb-2">Gold</Badge>
                    <div className="text-2xl font-bold text-yellow-600 mb-1">35%</div>
                    <p className="text-sm text-readable-muted">+ Elite Benefits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Success Stories */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
              Success Stories
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64"
                      alt="Emma Thompson"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">Emma Thompson</p>
                      <p className="text-sm text-gray-500">Gold Partner</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    "In just 18 months, I've built a six-figure business while helping hundreds of people improve their health naturally."
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64"
                      alt="Marcus Johnson"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">Marcus Johnson</p>
                      <p className="text-sm text-gray-500">Silver Partner</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    "The training and support system here is incredible. I went from zero experience to consistent monthly income."
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b17c?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64"
                      alt="Sarah Chen"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">Sarah Chen</p>
                      <p className="text-sm text-gray-500">Bronze Partner</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    "This opportunity gave me the flexibility to work from home while making a real impact on people's wellness journeys."
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Application Form */}
          <section className="max-w-2xl mx-auto">
            {isSubmitted ? (
              <Card className="text-center">
                <CardContent className="p-8">
                  <CheckCircle className="h-16 w-16 text-nature-green mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Application Submitted Successfully!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for your interest in becoming a Herbal Wellness Clinic partner. Our team will review your application and contact you within 24 hours.
                  </p>
                  <div className="bg-nature-green/10 rounded-lg p-4">
                    <p className="text-sm text-nature-green font-medium">
                      Next Steps: Watch for an email from our partnership team with your welcome package and next steps.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Start Your Journey Today</CardTitle>
                  <p className="text-center text-gray-600">
                    Fill out the form below to begin your application process. No purchase required.
                  </p>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your first name"
                                  {...field}
                                  className="touch-feedback"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your last name"
                                  {...field}
                                  className="touch-feedback"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Enter your email address"
                                {...field}
                                className="touch-feedback"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="Enter your phone number"
                                {...field}
                                className="touch-feedback"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Why are you interested in this opportunity?</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about your goals and what excites you about natural wellness..."
                                rows={4}
                                {...field}
                                className="touch-feedback"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-nature-green hover:bg-forest-green text-white py-3 touch-feedback"
                        disabled={submitLeadMutation.isPending}
                      >
                        {submitLeadMutation.isPending ? "Submitting..." : "Submit Application"}
                      </Button>
                    </form>
                  </Form>

                  <div className="mt-6 p-4 bg-warm-cream/20 rounded-lg">
                    <p className="text-xs text-gray-600 text-center">
                      By submitting this form, you agree to be contacted by our partnership team. 
                      No purchase required to become a distributor. Income results may vary.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
