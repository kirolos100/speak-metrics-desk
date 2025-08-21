import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

interface BarChartData {
  name: string;
  requests: number;
  inquiries: number;
  complaints: number;
}

interface BarChartComponentProps {
  title: string;
  subtitle?: string;
  data: BarChartData[];
}

const BarChartComponent = ({ title, subtitle, data }: BarChartComponentProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              className="text-xs"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis className="text-xs" />
            <Legend />
            <Bar dataKey="requests" fill="#10B981" name="Requests" />
            <Bar dataKey="inquiries" fill="#F59E0B" name="Inquiries" />
            <Bar dataKey="complaints" fill="#EF4444" name="Complaints" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BarChartComponent;