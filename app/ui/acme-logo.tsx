import { getUserOrganization } from '@/app/lib/kinde-data';
import Image from 'next/image';

export default async function AcmeLogo({ className }: { className?: string }) {
  const org = await getUserOrganization();

  return (
    <div className={`flex items-center ${className}`}>
      {org?.orgLogo ? (
        <Image
          src={org.orgLogo}
          alt="Organization logo"
          width={32}
          height={32}
          className="h-8 w-auto"
          priority
        />
      ) : (
        <div className="flex items-center text-blue-600">
          <span className="font-bold">{org?.orgName}</span>
        </div>
      )}
    </div>
  );
}
