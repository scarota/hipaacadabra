import { Metadata } from 'next';
import GeneralForm from '@/app/ui/settings/general-form';

export const metadata: Metadata = {
  title: 'General Settings',
};

export default function GeneralSettingsPage() {
  return <GeneralForm />;
}
