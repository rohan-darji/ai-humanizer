
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteAccountDialog({ isOpen, onClose }: DeleteAccountDialogProps) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { user } = useAuth();

  const handleDeleteAccount = async () => {
    try {
      if (!password) {
        setPasswordError("Password is required to confirm deletion");
        return;
      }
      
      setIsDeleting(true);
      setPasswordError("");
      
      // First verify the password by attempting a sign-in
      if (!user?.email) {
        throw new Error("User email not found");
      }
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password
      });
      
      if (signInError) {
        setPasswordError("Incorrect password");
        throw new Error("Password verification failed");
      }
      
      // Delete user data from Supabase - using a type assertion to handle the custom RPC
      const { error: deleteError } = await supabase.rpc('delete_user_data' as any);
      
      if (deleteError) throw deleteError;

      // Sign out the user instead of trying to delete the account
      await supabase.auth.signOut();

      toast.success("Your account data has been deleted successfully.");
      navigate("/");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      if (!passwordError) {
        toast.error(error.message || "Failed to delete account. Please try again later.");
      }
    } finally {
      setIsDeleting(false);
      if (!passwordError) {
        onClose();
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError("");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove all your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <Label htmlFor="password" className="mb-2 block">
            Enter your password to confirm deletion
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Your password"
            className={passwordError ? "border-destructive" : ""}
          />
          {passwordError && (
            <p className="mt-2 text-sm text-destructive">{passwordError}</p>
          )}
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDeleteAccount();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
