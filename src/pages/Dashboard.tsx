
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRightIcon, ChevronRightIcon } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");

  // Mock user data
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    plan: "Standard",
    creditsUsed: 1850,
    totalCredits: 5000,
    projects: [
      { 
        id: 1, 
        name: "Blog Article Draft", 
        lastEdited: "2023-05-10T12:30:00", 
        status: "Completed",
        characterCount: 3200,
        creditsUsed: 32
      },
      { 
        id: 2, 
        name: "Marketing Email", 
        lastEdited: "2023-05-15T14:45:00", 
        status: "Completed",
        characterCount: 1500,
        creditsUsed: 15
      },
      { 
        id: 3, 
        name: "Product Description", 
        lastEdited: "2023-05-18T09:20:00", 
        status: "In Progress",
        characterCount: 800,
        creditsUsed: 8
      },
      { 
        id: 4, 
        name: "Social Media Post", 
        lastEdited: "2023-05-20T16:10:00", 
        status: "Completed",
        characterCount: 280,
        creditsUsed: 3
      }
    ],
    paymentHistory: [
      {
        id: "INV-001",
        date: "2023-05-01",
        amount: "$19.00",
        status: "Paid",
        plan: "Standard (Monthly)"
      },
      {
        id: "INV-002",
        date: "2023-04-01",
        amount: "$19.00",
        status: "Paid",
        plan: "Standard (Monthly)"
      }
    ]
  };

  // Calculate credits percentage
  const creditsPercentage = (userData.creditsUsed / userData.totalCredits) * 100;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric"
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-500">Manage your projects and account settings</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/">
                <Button className="bg-gradient-purple-blue">
                  New Project <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
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
                    <p className="text-2xl font-bold">{userData.plan}</p>
                    <p className="text-sm text-gray-500">Monthly Subscription</p>
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
                    {userData.creditsUsed} / {userData.totalCredits}
                  </p>
                  <Progress value={creditsPercentage} className="h-2 bg-gray-200" />
                  <p className="text-sm text-gray-500">
                    {(userData.totalCredits - userData.creditsUsed).toLocaleString()} credits remaining
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
                  <p className="text-2xl font-bold">{userData.projects.length}</p>
                  <p className="text-sm text-gray-500">
                    Last updated {formatDate(userData.projects[0].lastEdited)}
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
              <Card>
                <CardHeader>
                  <CardTitle>Your Projects</CardTitle>
                  <CardDescription>
                    View and manage all your AI humanizer projects.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Characters</TableHead>
                          <TableHead>Credits</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userData.projects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.name}</TableCell>
                            <TableCell>
                              {formatDate(project.lastEdited)}
                              <div className="text-xs text-gray-500">
                                {formatTime(project.lastEdited)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                project.status === "Completed" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {project.status}
                              </div>
                            </TableCell>
                            <TableCell>{project.characterCount.toLocaleString()}</TableCell>
                            <TableCell>{project.creditsUsed}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-gray-500">
                    Showing {userData.projects.length} projects
                  </p>
                  <Button variant="outline">View All Projects</Button>
                </CardFooter>
              </Card>
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
                            <p className="font-medium">{userData.plan} Plan</p>
                            <p className="text-sm text-gray-500">$19.00 / month</p>
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
                            {userData.paymentHistory.map((payment) => (
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
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="ml-auto">Download All Invoices</Button>
                </CardFooter>
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
                            value={userData.name}
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email Address</label>
                          <input
                            type="email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={userData.email}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Security</h3>
                      <div className="space-y-4">
                        <Button variant="outline">Change Password</Button>
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
    </div>
  );
};

export default Dashboard;
