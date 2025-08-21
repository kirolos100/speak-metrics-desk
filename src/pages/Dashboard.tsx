import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MetricCard from "@/components/MetricCard";
import PieChartComponent from "@/components/PieChart";
import BarChartComponent from "@/components/BarChart";
import ServicesList from "@/components/ServicesList";
import { Smile } from "lucide-react";

const Dashboard = () => {
  const callTypesData = [
    { name: "Inquiry", value: 46.2, color: "#F59E0B" },
    { name: "Request", value: 43.6, color: "#10B981" },
    { name: "Complaint", value: 10.2, color: "#EF4444" }
  ];

  const agentProfessionalismData = [
    { name: "Highly Professional", value: 92.3, color: "#3B82F6" },
    { name: "Professional", value: 5.2, color: "#10B981" },
    { name: "Needs Improvement", value: 2.5, color: "#EF4444" }
  ];

  const servicesData = [
    { name: "Financial assistance", requests: 1, inquiries: 3, complaints: 0 },
    { name: "Mobile application", requests: 1, inquiries: 0, complaints: 0 },
    { name: "Home appliance repair", requests: 2, inquiries: 6, complaints: 0 },
    { name: "Online solutions", requests: 3, inquiries: 4, complaints: 1 }
  ];

  const topRequestServices = [
    { rank: 1, service: "Product delivery", requests: 7 },
    { rank: 2, service: "Maintenance service", requests: 2 },
    { rank: 3, service: "Home appliance repair", requests: 2 },
    { rank: 4, service: "Financial assistance", requests: 1 },
    { rank: 5, service: "Appliance purchase support", requests: 1 }
  ];

  const topInquiryServices = [
    { rank: 1, service: "Product delivery", requests: 5 },
    { rank: 2, service: "Appliance purchase support", requests: 5 },
    { rank: 3, service: "Network connection", requests: 3 },
    { rank: 4, service: "Online solutions", requests: 3 },
    { rank: 5, service: "Financial assistance", requests: 1 }
  ];

  const topComplaintServices = [
    { rank: 1, service: "Online solutions", requests: 1 },
    { rank: 2, service: "Maintenance service", requests: 1 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Total Number of Calls"
            value="54"
            gradient="primary"
          />
          <MetricCard
            title="Customer Satisfaction Rate"
            value="73%"
            gradient="purple"
            icon={<Smile />}
          />
          <MetricCard
            title="Average Call Duration"
            value="4.83"
            unit="Minutes"
            gradient="coral"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PieChartComponent title="Call Types" data={callTypesData} />
          <PieChartComponent title="Agents Professionalism" data={agentProfessionalismData} />
        </div>

        {/* Services Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <BarChartComponent 
              title="Services" 
              subtitle="Services usage and demand"
              data={servicesData} 
            />
          </div>
          
          <div className="lg:col-span-2 space-y-4">
            <ServicesList 
              title="Top Service - No. of Requests Calls"
              data={topRequestServices}
              type="requests"
            />
            
            <ServicesList 
              title="Top Service - No. of Inquiry Calls"
              data={topInquiryServices}
              type="inquiries"
            />
            
            <ServicesList 
              title="Top Service - No. of Complaints Calls"
              data={topComplaintServices}
              type="complaints"
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;