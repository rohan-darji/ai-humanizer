import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PaymentForm from "@/components/PaymentForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const PricingCard = ({ 
  plan, 
  price, 
  period, 
  description, 
  features, 
  credits,
  popular = false,
  buttonText = "Get Started",
  onSelectPlan,
  currentPlan = "",
  isCurrentPlan = false
}) => (
  <Card className={`w-full ${popular ? 'border-humanizer-purple shadow-lg' : ''}`}>
    {popular && (
      <div className="bg-humanizer-purple text-white py-1 px-3 text-sm font-medium rounded-t-md text-center">
        Most Popular
      </div>
    )}
    <CardHeader>
      <CardTitle className="text-xl">{plan}</CardTitle>
      <CardDescription>{description}</CardDescription>
      <div className="mt-4">
        <span className="text-3xl font-bold">${price}</span>
        <span className="text-gray-500">/{period}</span>
      </div>
    </CardHeader>
    <CardContent>
      <p className="mb-4 font-medium text-humanizer-purple">
        {credits} credits per month
      </p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon className="h-5 w-5 text-humanizer-purple shrink-0 mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button 
        className={popular ? "bg-gradient-purple-blue w-full" : "w-full"} 
        variant={popular ? "default" : "outline"}
        onClick={() => onSelectPlan(plan.toLowerCase())}
        disabled={isCurrentPlan}
      >
        {isCurrentPlan ? "Current Plan" : buttonText}
      </Button>
    </CardFooter>
  </Card>
);

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription } = useUserData();
  
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  
  const pricingPlans = {
    monthly: [
      {
        plan: "Free",
        price: "0",
        period: "month",
        description: "For occasional use and trying out the service.",
        credits: "500",
        features: [
          "Basic text humanizing",
          "Limited AI detection checks",
          "Standard processing speed",
          "Web access only"
        ],
        buttonText: "Sign Up Free"
      },
      {
        plan: "Standard",
        price: "19",
        period: "month",
        description: "Perfect for regular content creators.",
        credits: "5,000",
        features: [
          "Advanced text humanizing",
          "Priority AI detection checks",
          "Faster processing speed",
          "Web access & basic API",
          "Email support"
        ],
        popular: true
      },
      {
        plan: "Premium",
        price: "49",
        period: "month",
        description: "For professional content teams and agencies.",
        credits: "20,000",
        features: [
          "Professional text humanizing",
          "Advanced AI detection checks",
          "Fastest processing speed",
          "Full API access",
          "Multiple writing styles",
          "Priority support",
          "Team collaboration"
        ]
      }
    ],
    yearly: [
      {
        plan: "Free",
        price: "0",
        period: "year",
        description: "For occasional use and trying out the service.",
        credits: "500",
        features: [
          "Basic text humanizing",
          "Limited AI detection checks",
          "Standard processing speed",
          "Web access only"
        ],
        buttonText: "Sign Up Free"
      },
      {
        plan: "Standard",
        price: "190",
        period: "year",
        description: "Perfect for regular content creators.",
        credits: "5,000",
        features: [
          "Advanced text humanizing",
          "Priority AI detection checks",
          "Faster processing speed",
          "Web access & basic API",
          "Email support"
        ],
        popular: true
      },
      {
        plan: "Premium",
        price: "490",
        period: "year",
        description: "For professional content teams and agencies.",
        credits: "20,000",
        features: [
          "Professional text humanizing",
          "Advanced AI detection checks",
          "Fastest processing speed",
          "Full API access",
          "Multiple writing styles",
          "Priority support",
          "Team collaboration"
        ]
      }
    ]
  };

  const faqs = [
    {
      question: "What are credits and how do they work?",
      answer: "Credits are used to pay for text processing. One credit is approximately equal to processing 100 characters. Credits reset monthly and do not roll over to the next month."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact our support team within 7 days of purchase."
    },
    {
      question: "Is there a limit to how much text I can process?",
      answer: "The only limit is the number of credits in your plan. Once you've used all your credits, you can purchase more or wait until they reset at the start of your next billing cycle."
    },
    {
      question: "Do you offer enterprise plans?",
      answer: "Yes, we offer custom enterprise plans for organizations with high-volume needs. Contact us for more information."
    }
  ];

  const handleSelectPlan = (planType: string) => {
    // If user is not logged in, redirect to login/signup
    if (!user) {
      navigate('/login');
      return;
    }

    // If it's the free plan, update directly
    if (planType === 'free') {
      handleUpdatePlan(planType);
      return;
    }

    // Otherwise show payment form
    setSelectedPlan(planType);
    setShowPaymentForm(true);
  };

  const handleUpdatePlan = async (planType: string) => {
    try {
      setShowPaymentForm(false); // Close the payment form
      
      // Update or create the subscription in the database
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .upsert({ 
          user_id: user!.id,
          plan_type: planType,
          is_active: true,
          updated_at: new Date().toISOString(),
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString()
        },{ onConflict: 'user_id' })
        .select()
        .single();
      
      if (subscriptionError) throw subscriptionError;
      
      // Update credits based on plan
      let totalCredits = 0;
      
      if (planType === 'free') {
        totalCredits = 500;
      } else if (planType === 'standard') {
        totalCredits = 5000;
      } else if (planType === 'premium') {
        totalCredits = 20000;
      }
      
      const { data: existing, error: fetchError } = await supabase
      .from('credits')
      .select('*')
      .eq('user_id', user!.id)
      .maybeSingle();
    
      if (fetchError) throw fetchError;
      
      let creditsError;
      
      if (existing) {
        // Update
        const { error } = await supabase
          .from('credits')
          .update({
            total_credits: totalCredits,
            used_credits: 0,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user!.id);
        creditsError = error;
      } else {
        // Insert
        const { error } = await supabase
          .from('credits')
          .insert({
            user_id: user!.id,
            total_credits: totalCredits,
            used_credits: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        creditsError = error;
      }
      
      if (creditsError) throw creditsError;
      
      toast.success(`Successfully upgraded to ${planType} plan!`);
      
      // Redirect to dashboard after successful upgrade
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error: any) {
      console.error('Error updating subscription:', error);
      toast.error(`Error updating subscription: ${error.message}`);
      setShowPaymentForm(false);
    }
  };

  const handlePaymentSuccess = () => {
    if (selectedPlan) {
      handleUpdatePlan(selectedPlan);
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    setSelectedPlan("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-24">
        {/* Pricing Header */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Simple, <span className="text-gradient">Transparent Pricing</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Choose the plan that's right for you and start humanizing your AI-generated content today.
              </p>
              
              <div className="inline-block mb-8">
                <Tabs
                  defaultValue="monthly"
                  value={billingCycle}
                  onValueChange={setBillingCycle}
                  className="w-[400px] max-w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly">
                      Yearly <span className="ml-2 bg-humanizer-purple/10 text-humanizer-purple text-xs px-2 py-0.5 rounded-full">Save 20%</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pricingPlans[billingCycle].map((plan, index) => (
                  <PricingCard 
                    key={index} 
                    {...plan} 
                    onSelectPlan={handleSelectPlan}
                    currentPlan={subscription?.plan_type || ''}
                    isCurrentPlan={subscription?.plan_type === plan.plan.toLowerCase()}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                Frequently <span className="text-gradient">Asked Questions</span>
              </h2>
              
              <div className="space-y-8">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold text-xl mb-3">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-purple-blue text-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Sign up now and get your first 500 credits for free, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to={user ? "/dashboard" : "/login"} onClick={() => window.scrollTo(0, 0)}>
                  <Button className="bg-white text-humanizer-purple hover:bg-gray-100 py-6 px-8 text-lg">
                    {user ? "Go to Dashboard" : "Sign Up Free"}
                  </Button>
                </Link>
                <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
                  <Button className="bg-white text-humanizer-purple hover:bg-gray-100 py-6 px-8 text-lg">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* Payment Form Dialog */}
      <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
        <DialogContent className="max-w-4xl">
          <PaymentForm
            planName={selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
            amount={selectedPlan === 'standard' ? (billingCycle === 'yearly' ? 190 : 19) : (billingCycle === 'yearly' ? 490 : 49)}
            billingCycle={billingCycle}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pricing;
