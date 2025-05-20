
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!name || !email || !subject || !message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Mock API call
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Your message has been sent!",
      });
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-24">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-gradient">Contact Us</span>
              </h1>
              <p className="text-lg text-gray-700">
                Have questions or need assistance? We're here to help. Reach out to our team using the form below.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <Card className="border-0 shadow-lg h-full">
                  <CardHeader>
                    <CardTitle>Send us a message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  {!submitted ? (
                    <form onSubmit={handleSubmit}>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Full Name
                          </label>
                          <Input
                            id="name"
                            placeholder="Your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email Address
                          </label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="subject" className="text-sm font-medium">
                            Subject
                          </label>
                          <Input
                            id="subject"
                            placeholder="How can we help you?"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="message" className="text-sm font-medium">
                            Message
                          </label>
                          <Textarea
                            id="message"
                            placeholder="Your message here..."
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-purple-blue"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                      </CardFooter>
                    </form>
                  ) : (
                    <CardContent className="py-16">
                      <div className="text-center">
                        <div className="mb-6 mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="text-green-600 w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                        <p className="text-gray-600 mb-6">
                          Thank you for reaching out. We'll get back to you shortly.
                        </p>
                        <Button 
                          className="bg-gradient-purple-blue"
                          onClick={() => setSubmitted(false)}
                        >
                          Send Another Message
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>

              <div>
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Get in touch</h2>
                    <p className="text-gray-700 mb-8">
                      Our team is always ready to help you with any questions or concerns you might have about our AI Humanizer service.
                    </p>

                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-humanizer-light-purple flex items-center justify-center mr-4">
                          <Mail className="w-5 h-5 text-humanizer-purple" />
                        </div>
                        <div>
                          <p className="font-medium">Email</p>
                          <a href="mailto:support@aihumanizer.com" className="text-humanizer-purple">
                            support@aihumanizer.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-humanizer-light-purple flex items-center justify-center mr-4">
                          <Phone className="w-5 h-5 text-humanizer-purple" />
                        </div>
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-gray-700">+1 (555) 123-4567</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-humanizer-light-purple flex items-center justify-center mr-4">
                          <MapPin className="w-5 h-5 text-humanizer-purple" />
                        </div>
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="text-gray-700">
                            AI Humanizer Inc.<br />
                            123 Tech Avenue<br />
                            San Francisco, CA 94107<br />
                            United States
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">How quickly do you respond to inquiries?</h3>
                        <p className="text-gray-700">
                          We typically respond to all inquiries within 24 business hours.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Do you offer custom enterprise solutions?</h3>
                        <p className="text-gray-700">
                          Yes, we provide tailored solutions for enterprise clients. Contact us to discuss your specific needs.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Can I request a demo before subscribing?</h3>
                        <p className="text-gray-700">
                          Absolutely! You can try our tool for free or request a personalized demo from our sales team.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
