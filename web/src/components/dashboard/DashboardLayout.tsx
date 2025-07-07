import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ServiceTable from './ServiceTable';
import KPIStats from './KPIStats';
import ServiceStatusPie from './ServiceStatusPie';
import ServiceStatusBar from './ServiceStatusBar';
import ServiceTrendLine from './ServiceTrendLine';

export default function DashboardLayout() {
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
        <KPIStats />

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Service Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ServiceStatusPie />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Status Bar</CardTitle>
            </CardHeader>
            <CardContent>
              <ServiceStatusBar />
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Services per Day</CardTitle>
            </CardHeader>
            <CardContent>
              <ServiceTrendLine />
            </CardContent>
          </Card>
        </div>

        {/* Services Table */}
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
            <CardDescription>Manage all your services</CardDescription>
          </CardHeader>
          <CardContent>
            <ServiceTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
