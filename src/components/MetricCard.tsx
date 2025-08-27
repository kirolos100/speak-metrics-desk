import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  gradient: 'primary' | 'purple' | 'coral' | 'success';
  className?: string;
}

const MetricCard = ({ title, value, unit, icon, gradient, className = "" }: MetricCardProps) => {
  const gradientClasses = {
    primary: 'bg-gradient-primary',
    purple: 'bg-gradient-purple', 
    coral: 'bg-gradient-coral',
    success: 'bg-gradient-success'
  };

  return (
    <Card className={`relative overflow-hidden shadow-card ${className}`}>
      <CardContent className={`p-6 ${gradientClasses[gradient]} text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1">
              <h3 className="text-3xl font-bold">{value}</h3>
              {unit && <span className="text-sm opacity-90">{unit}</span>}
            </div>
            <p className="text-sm opacity-90 mt-1">{title}</p>
          </div>
          {icon && (
            <div className="opacity-20 text-6xl">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;