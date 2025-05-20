import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import PaymentProcessing from "@/components/PaymentProcessing";

interface PaymentFormProps {
  planName: string;
  amount: number;
  billingCycle: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm = ({ planName, amount, billingCycle, onSuccess, onCancel }: PaymentFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    // Basic validation for demo purposes
    if (!formData.cardNumber || formData.cardNumber.length !== 16) {
      toast.error("Please enter a valid 16-digit card number");
      return false;
    }
    if (!formData.cardName) {
      toast.error("Please enter cardholder name");
      return false;
    }
    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      toast.error("Please enter a valid expiry date (MM/YY)");
      return false;
    }
    if (!formData.cvv || formData.cvv.length !== 3) {
      toast.error("Please enter a valid 3-digit CVV");
      return false;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
      toast.error("Please fill in all address fields");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setShowProcessing(true);
  };

  const handleProcessingSuccess = () => {
    setShowProcessing(false);
    onSuccess();
  };

  const handleProcessingClose = () => {
    setShowProcessing(false);
    onCancel();
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto flex flex-col max-h-[100vh] h-full sm:h-[90vh]">
        <CardHeader className="sticky top-0 bg-white z-10 border-b">
          <CardTitle>Enter Payment Details</CardTitle>
          <CardDescription>
            {planName} Plan - ${amount}/{billingCycle}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <CardContent className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {/* Card Details Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Card Details</h3>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  maxLength={16}
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  name="cardName"
                  placeholder="John Doe"
                  value={formData.cardName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    maxLength={3}
                    value={formData.cvv}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Billing Information Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Billing Information</h3>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main St"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="NY"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  placeholder="10001"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="sticky bottom-0 bg-white z-10 border-t p-4">
            <div className="flex justify-between w-full gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-purple-blue flex-1"
                disabled={isProcessing}
              >
                Continue to Payment
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>

      <PaymentProcessing
        open={showProcessing}
        onClose={handleProcessingClose}
        planName={planName}
        onSuccess={handleProcessingSuccess}
      />
    </>
  );
};

export default PaymentForm; 