
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckIcon, ArrowRightIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import { useHumanizedTexts } from "@/hooks/useHumanizedTexts";
import { toast } from "sonner";
import { copyToClipboard } from "@/utils/clipboard";

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("humanize");
  const { user } = useAuth();
  const { availableCredits } = useUserData();
  const { saveHumanizedText } = useHumanizedTexts();
  const navigate = useNavigate();

  // Calculate credits needed based on input text
  const calculateCreditsNeeded = (text: string): number => {
    if (!text) return 0;
    // 2 credits per 100 characters (rounded up)
    return Math.ceil(text.length / 100) * 2;
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    const creditsNeeded = calculateCreditsNeeded(inputText);

    // Check if user is logged in
    if (user) {
      // Check if user has enough credits
      if (availableCredits < creditsNeeded) {
        toast.error(`Not enough credits! You need ${creditsNeeded} credits but have only ${availableCredits} available.`, {
          description: "Please upgrade your plan to get more credits.",
          action: {
            label: "Upgrade",
            onClick: () => navigate("/pricing")
          }
        });
        return;
      }
    }

    setIsProcessing(true);
    
    try {
      // Simulate AI humanization with timeout
      setTimeout(async () => {
        // Mock the humanized output
        const humanizedText = `${inputText} 

This is the humanized version of your text. In a production environment, this would be processed by our AI humanization engine to make it sound more natural and human-written, while maintaining the original meaning.

The humanized text would have varied sentence structures, natural language patterns, and would effectively bypass AI detection tools.`;
        
        setOutputText(humanizedText);
        
        // Save humanized text to Supabase if user is logged in
        if (user) {
          const title = `Project ${new Date().toLocaleDateString()}`;
          await saveHumanizedText(inputText, humanizedText, creditsNeeded, title);
          toast.success(`Project saved! Used ${creditsNeeded} credits.`);
        }
        
        setIsProcessing(false);
      }, 1500);
    } catch (error: any) {
      console.error("Error during humanization:", error);
      toast.error("Error during humanization process", {
        description: error.message
      });
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (outputText) {
      copyToClipboard(outputText);
      toast.success("Copied to clipboard!");
    }
  };

  const features = [
    {
      title: "Bypass AI Detection",
      description: "Humanize AI-generated content to bypass detection tools and checkers with ease."
    },
    {
      title: "Maintain Meaning",
      description: "Preserve the original meaning and intent of your text while making it sound human-written."
    },
    {
      title: "Multiple Styles",
      description: "Choose from different writing styles to match your specific needs and tone."
    }
  ];

  const testimonials = [
    {
      quote: "AI Humanizer completely transformed how I use AI-generated content for my work. The outputs are indistinguishable from human writing!",
      author: "Sarah L.",
      role: "Content Marketer"
    },
    {
      quote: "As a student, this tool has been invaluable for helping me refine AI-generated research summaries into natural, flowing text.",
      author: "Michael T.",
      role: "Graduate Student"
    },
    {
      quote: "The best AI humanizer on the market. My content passes all detection tools after processing with this service.",
      author: "James R.",
      role: "SEO Specialist"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-[72px]">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-humanizer-light-purple to-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-gradient">Transform AI Text</span> Into Human-Written Content
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Instantly humanize AI-generated content to bypass detection tools
                while maintaining the original meaning and improving quality.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  className="bg-gradient-purple-blue text-white py-6 px-8 text-lg" 
                  onClick={() => window.scrollTo({top: document.getElementById('humanizer-tool')?.offsetTop - 100, behavior: 'smooth'})}
                >
                  Try For Free
                </Button>
                <Link to="/pricing">
                  <Button variant="outline" className="py-6 px-8 text-lg">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Humanizer Tool Section */}
        <section id="humanizer-tool" className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                <span className="text-gradient">AI Humanizer</span> Tool
              </h2>

              {user && (
                <div className="mb-6 text-center">
                  <p className="text-humanizer-purple font-medium">
                    Available Credits: <span className="font-bold">{availableCredits}</span>
                  </p>
                </div>
              )}

              <Tabs defaultValue="humanize" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="humanize">Humanize Text</TabsTrigger>
                  <TabsTrigger value="check">Check AI Detection</TabsTrigger>
                </TabsList>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="flex flex-col h-full">
                    <TabsContent value="humanize" className="mt-0 flex-grow">
                      <Card className="h-full">
                        <CardContent className="p-6 h-full">
                          <div className="flex flex-col h-full">
                            <div className="mb-3">
                              <p className="font-medium text-gray-700">Input AI Text:</p>
                              {user && inputText && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Estimated cost: {calculateCreditsNeeded(inputText)} credits
                                </p>
                              )}
                            </div>
                            <Textarea 
                              placeholder="Paste your AI-generated text here..." 
                              className="flex-grow min-h-[300px] mb-4"
                              value={inputText}
                              onChange={(e) => setInputText(e.target.value)}
                            />
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-gray-500">
                                {inputText.length} characters
                              </div>
                              <Button 
                                className="bg-gradient-purple-blue"
                                onClick={handleSubmit}
                                disabled={isProcessing || !inputText.trim()}
                              >
                                {isProcessing ? "Humanizing..." : "Humanize"}
                                {!user && !isProcessing && (
                                  <span className="ml-2 text-xs">(Free Trial)</span>
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="check" className="mt-0 flex-grow">
                      <Card className="h-full">
                        <CardContent className="p-6 h-full">
                          <div className="flex flex-col h-full">
                            <div className="mb-3">
                              <p className="font-medium text-gray-700">Check if text is AI-generated:</p>
                            </div>
                            <Textarea 
                              placeholder="Paste text to check if it's AI-generated..." 
                              className="flex-grow min-h-[300px] mb-4"
                              value={inputText}
                              onChange={(e) => setInputText(e.target.value)}
                            />
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-gray-500">
                                {inputText.length} characters
                              </div>
                              <Button 
                                className="bg-gradient-purple-blue"
                                onClick={handleSubmit}
                                disabled={isProcessing || !inputText.trim()}
                              >
                                {isProcessing ? "Checking..." : "Check Now"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </div>

                  <div className="flex flex-col h-full">
                    <Card className="h-full">
                      <CardContent className="p-6 h-full">
                        <div className="flex flex-col h-full">
                          <div className="mb-3">
                            <p className="font-medium text-gray-700">
                              {activeTab === "humanize" ? "Humanized Output:" : "Detection Result:"}
                            </p>
                          </div>
                          <Textarea 
                            className="flex-grow min-h-[300px] mb-4 bg-gray-50"
                            value={outputText}
                            onChange={(e) => setOutputText(e.target.value)}
                            placeholder={activeTab === "humanize" 
                              ? "Your humanized text will appear here..." 
                              : "Detection results will appear here..."
                            }
                            readOnly={!outputText}
                          />
                          <div className="flex justify-end">
                            <Button 
                              variant="outline" 
                              className="mr-2"
                              disabled={!outputText}
                              onClick={handleCopy}
                            >
                              Copy
                            </Button>
                            <Button 
                              variant="outline"
                              disabled={!outputText}
                              onClick={() => setOutputText("")}
                            >
                              Clear
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </Tabs>

              {!user && (
                <div className="mt-8 p-4 bg-humanizer-light-purple/20 rounded-lg text-center">
                  <p className="mb-2">Sign in to save your humanized text and access more features.</p>
                  <Link to="/login">
                    <Button className="bg-gradient-purple-blue mt-2">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                <span className="text-gradient">Key Features</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-purple-blue flex items-center justify-center mb-6">
                        <CheckIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                What Our <span className="text-gradient">Users Say</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="border border-gray-100">
                    <CardContent className="p-6">
                      <div className="mb-4 text-humanizer-purple">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.59 4.59A2 2 0 1 1 11 7.99H9V10H11V12H7V7.99A4 4 0 0 1 9.59 4.59zM17.59 4.59A2 2 0 1 1 19 7.99H17V10H19V12H15V7.99A4 4 0 0 1 17.59 4.59z" fill="currentColor" />
                        </svg>
                      </div>
                      <p className="text-gray-700 mb-6">{testimonial.quote}</p>
                      <div className="mt-auto">
                        <p className="font-bold">{testimonial.author}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
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
                Ready to Humanize Your AI Content?
              </h2>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Start using our AI Humanizer tool today and create undetectable, high-quality content.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/pricing" onClick={() => window.scrollTo(0, 0)}>
                  <Button className="bg-white text-humanizer-purple hover:bg-gray-100 py-6 px-8 text-lg">
                    Get Started <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
