import EditProfileForm from '@/app/ui/profile/edit-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Profile',
};

export default function ProfilePage() {
    return <EditProfileForm />;
}
