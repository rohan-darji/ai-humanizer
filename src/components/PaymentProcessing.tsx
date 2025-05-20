
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckIcon } from "lucide-react";

interface PaymentProcessingProps {
  open: boolean;
  onClose: () => void;
  planName: string;
  onSuccess: () => void;
}

const PaymentProcessing = ({ open, onClose, planName, onSuccess }: PaymentProcessingProps) => {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<"processing" | "success">("processing");

  useEffect(() => {
    if (open && step === "processing") {
      // Simulate payment processing
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setStep("success");
            return 100;
          }
          return prev + 10;
        });
      }, 400);

      return () => clearInterval(timer);
    }
  }, [open, step]);

  const handleClose = () => {
    if (step === "success") {
      onSuccess();
    }
    onClose();
    // Reset state for next time
    setTimeout(() => {
      setProgress(0);
      setStep("processing");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "processing" ? "Processing Payment" : "Payment Successful!"}
          </DialogTitle>
          <DialogDescription>
            {step === "processing" 
              ? `Please wait while we process your subscription to the ${planName} plan.`
              : `Your subscription to the ${planName} plan has been activated successfully.`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          {step === "processing" ? (
            <div className="space-y-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Verifying payment details...</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-500">
                Thank you for your payment. Your subscription is now active.
              </p>
            </div>
          )}
        </div>
        
        {step === "success" && (
          <div className="flex justify-end">
            <Button onClick={handleClose}>Continue</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentProcessing;
