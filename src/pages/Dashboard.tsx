import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRightIcon, ChevronRightIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import { useHumanizedTexts } from "@/hooks/useHumanizedTexts";
import ProjectsList from "@/components/ProjectsList";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");
  const { signOut, user } = useAuth();
  const { profile, credits, subscription, availableCredits, loading: userDataLoading } = useUserData();
  const { texts: humanizedTexts, loading: textsLoading } = useHumanizedTexts();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Calculate credits percentage
  const creditsPercentage = credits ? (credits.used_credits / credits.total_credits) * 100 : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    try {
      setIsChangingPassword(true);

      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Current password is incorrect");
      }

      // If current password is correct, update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      toast.success("Password updated successfully");
      setIsChangePasswordOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Error updating password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (userDataLoading || textsLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Loading your dashboard...</h2>
            <p className="text-gray-500">Please wait while we fetch your data.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Fetch payment history (mock data based on subscription)
  const paymentHistory = subscription ? [
    {
      id: "INV-001",
      date: new Date().toISOString().split('T')[0],
      amount: subscription.plan_type === 'standard' ? "$19.00" : 
              subscription.plan_type === 'premium' ? "$49.00" : "$0.00",
      status: "Paid",
      plan: `${subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1)} (Monthly)`
    }
  ] : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-500">Welcome back, {profile?.full_name || user?.email}</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Link to="/">
                <Button className="bg-gradient-purple-blue">
                  New Project <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {subscription?.plan_type.charAt(0).toUpperCase() + subscription?.plan_type.slice(1) || "Free"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {subscription?.plan_type === 'free' ? 'Free Tier' : 'Monthly Subscription'}
                    </p>
                  </div>
                  <Link to="/pricing">
                    <Button variant="outline" size="sm">
                      Upgrade <ChevronRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Credits Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">
                    {credits?.used_credits || 0} / {credits?.total_credits || 0}
                  </p>
                  <Progress value={creditsPercentage} className="h-2 bg-gray-200" />
                  <p className="text-sm text-gray-500">
                    {availableCredits.toLocaleString()} credits remaining
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Recent Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{humanizedTexts.length}</p>
                  <p className="text-sm text-gray-500">
                    {humanizedTexts.length > 0 
                      ? `Last updated ${formatDate(humanizedTexts[0].updated_at)}`
                      : 'No projects yet'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="projects" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="billing">Billing & Payments</TabsTrigger>
              <TabsTrigger value="account">Account Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              <ProjectsList projects={humanizedTexts} />
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Payments</CardTitle>
                  <CardDescription>
                    Manage your subscription and view payment history.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Subscription Details</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <div>
                            <p className="font-medium">
                              {subscription?.plan_type.charAt(0).toUpperCase() + subscription?.plan_type.slice(1) || "Free"} Plan
                            </p>
                            <p className="text-sm text-gray-500">
                              {subscription?.plan_type === 'standard' ? "$19.00 / month" :
                               subscription?.plan_type === 'premium' ? "$49.00 / month" : "Free tier"}
                            </p>
                          </div>
                          <div className="mt-4 md:mt-0">
                            <Link to="/pricing">
                              <Button variant="outline" size="sm">Change Plan</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Payment History</h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Invoice</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Plan</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paymentHistory.length > 0 ? (
                              paymentHistory.map((payment) => (
                                <TableRow key={payment.id}>
                                  <TableCell className="font-medium">{payment.id}</TableCell>
                                  <TableCell>{payment.date}</TableCell>
                                  <TableCell>{payment.amount}</TableCell>
                                  <TableCell>
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      {payment.status}
                                    </div>
                                  </TableCell>
                                  <TableCell>{payment.plan}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                  No payment history available.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </CardContent>
                {paymentHistory.length > 0 && (
                  <CardFooter>
                    <Button variant="outline" className="ml-auto">Download All Invoices</Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Update your account information and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Full Name</label>
                          <input
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={profile?.full_name || ''}
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email Address</label>
                          <input
                            type="email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={user?.email || ''}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Security</h3>
                      <div className="space-y-4">
                        <Button variant="outline" onClick={() => setIsChangePasswordOpen(true)}>
                          Change Password
                        </Button>
                        <Button variant="outline">Enable Two-Factor Authentication</Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">API Access</h3>
                      <div className="space-y-4">
                        <Button variant="outline">Generate API Key</Button>
                        <Button variant="outline">View API Documentation</Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Account Actions</h3>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />

      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsChangePasswordOpen(false)}
              disabled={isChangingPassword}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="bg-gradient-purple-blue"
            >
              {isChangingPassword ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
