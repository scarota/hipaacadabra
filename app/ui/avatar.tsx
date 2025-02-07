interface AvatarProps {
  firstName?: string;
  lastName?: string;
  className?: string;
}

export default function Avatar({
  firstName = '',
  lastName = '',
  className = 'h-24 w-24',
}: AvatarProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-blue-600 text-white ${className}`}
    >
      <span className="text-2xl font-medium">{initials || '?'}</span>
    </div>
  );
}
