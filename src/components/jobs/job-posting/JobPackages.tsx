
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface JobPackagesProps {
  selectedPackage: string;
  onSelectPackage: (packageId: string) => void;
}

export const JobPackages: React.FC<JobPackagesProps> = ({ selectedPackage, onSelectPackage }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Chọn gói dịch vụ</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PackageCard 
          id="basic"
          name="Cơ bản"
          price="1,000,000 VNĐ"
          duration="30 ngày"
          isSelected={selectedPackage === 'basic'}
          onSelect={() => onSelectPackage('basic')}
          features={[
            { text: "Hiển thị 30 ngày", included: true },
            { text: "Tiếp cận không giới hạn ứng viên", included: true },
            { text: "Đẩy tin tuyển dụng", included: false }
          ]}
        />
        
        <PackageCard 
          id="standard"
          name="Nâng cao"
          price="2,500,000 VNĐ"
          duration="30 ngày"
          isSelected={selectedPackage === 'standard'}
          onSelect={() => onSelectPackage('standard')}
          popular={true}
          features={[
            { text: "Hiển thị 30 ngày", included: true },
            { text: "Tiếp cận không giới hạn ứng viên", included: true },
            { text: "Đẩy tin tuyển dụng (7 ngày)", included: true }
          ]}
        />
        
        <PackageCard 
          id="premium"
          name="Premium"
          price="5,000,000 VNĐ"
          duration="30 ngày"
          isSelected={selectedPackage === 'premium'}
          onSelect={() => onSelectPackage('premium')}
          features={[
            { text: "Hiển thị 30 ngày", included: true },
            { text: "Tiếp cận không giới hạn ứng viên", included: true },
            { text: "Đẩy tin tuyển dụng (15 ngày)", included: true }
          ]}
        />
      </div>
    </div>
  );
};

interface PackageCardProps {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: { text: string; included: boolean }[];
  isSelected: boolean;
  onSelect: () => void;
  popular?: boolean;
}

const PackageCard: React.FC<PackageCardProps> = ({ 
  id, name, price, duration, features, isSelected, onSelect, popular 
}) => (
  <Card 
    className={`border hover:border-primary cursor-pointer transition-all ${isSelected ? 'border-primary ring-2 ring-primary ring-opacity-50' : ''} ${popular ? 'relative' : ''}`}
    onClick={onSelect}
  >
    {popular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs px-2 py-1 rounded">
        Phổ biến nhất
      </div>
    )}
    <CardContent className="pt-6">
      <div className="text-center mb-4">
        <h4 className="text-lg font-bold">{name}</h4>
        <p className="text-2xl font-bold mt-2">{price}</p>
        <p className="text-sm text-muted-foreground">{duration}</p>
      </div>
      <ul className="space-y-2 text-sm">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Badge variant="outline" className={`mr-2 ${feature.included ? 'bg-green-50' : ''}`}>
              {feature.included ? '✓' : '✕'}
            </Badge>
            <span className={!feature.included ? 'text-muted-foreground' : ''}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);
