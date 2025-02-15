import { getUserOrganization } from '@/app/lib/kinde-data';

export default async function AcmeLogo({ className }: { className?: string }) {
  const org = await getUserOrganization();

  return (
    <div className={`flex items-center ${className}`}>
      {org?.orgLogo ? (
        <img src={org.orgLogo} alt="Organization logo" className="h-8 w-auto" />
      ) : (
        <div className="flex items-center text-blue-600">
          <span className="font-bold">Hipaacadabra</span>
        </div>
      )}
    </div>
  );
}
