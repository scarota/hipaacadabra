import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { getOrganizationUsers } from './kinde-data';

export async function getCurrentUserRole() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.email) {
        return null;
    }

    const orgUsers = await getOrganizationUsers();

    const currentUser = orgUsers.find((orgUser) => orgUser.email === user.email);

    if (!currentUser?.roles.length) {
        return 'standard';
    }

    if (currentUser.roles.includes('admin')) {
        return 'admin';
    }

    return 'standard';
}

export async function protectRoute(allowedRoles: string[]) {
    const role = await getCurrentUserRole();

    if (!role || !allowedRoles.includes(role)) {
        redirect('/');
    }
}
