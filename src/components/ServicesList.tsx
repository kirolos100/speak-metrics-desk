import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiceData {
  rank: number;
  service: string;
  requests: number;
}

interface ServicesListProps {
  title: string;
  data: ServiceData[];
  type: 'requests' | 'inquiries' | 'complaints';
}

const ServicesList = ({ title, data, type }: ServicesListProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((service) => (
          <div key={service.rank} className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground w-4">{service.rank}</span>
              <span className="text-sm">{service.service}</span>
            </div>
            <span className="text-sm font-medium">{service.requests}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ServicesList;