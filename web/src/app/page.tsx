import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Service Management Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your services with a modern, intuitive interface
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex gap-4 mb-8">
          <Button>Create Service</Button>
          <Button variant="outline">Import Services</Button>
          <Button variant="secondary">Export Data</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Services
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20m9-9H3" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Services
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Services
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">38</div>
              <p className="text-xs text-muted-foreground">
                +4% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Services */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Services</CardTitle>
            <CardDescription>
              A list of your recent service activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Website Maintenance</p>
                  <p className="text-sm text-muted-foreground">
                    Customer: John Doe
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$150.00</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Logo Design</p>
                  <p className="text-sm text-muted-foreground">
                    Customer: Jane Smith
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$300.00</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Database Optimization</p>
                  <p className="text-sm text-muted-foreground">
                    Customer: Tech Corp
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$500.00</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Services
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
