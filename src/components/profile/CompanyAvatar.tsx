
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CompanyProfile } from '@/types/profile';

type CompanyAvatarProps = {
  profile: CompanyProfile | null;
};

const CompanyAvatar = ({ profile }: CompanyAvatarProps) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <Avatar className="h-20 w-20">
        <AvatarImage src={profile?.logo || ''} alt={profile?.name || ''} />
        <AvatarFallback>{profile?.name?.slice(0, 2) || 'C'}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-lg font-medium">{profile?.name || 'Chưa cập nhật tên công ty'}</h3>
        <p className="text-sm text-muted-foreground">Cập nhật logo và thông tin công ty</p>
      </div>
    </div>
  );
};

export default CompanyAvatar;
