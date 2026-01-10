import { redirect } from 'next/navigation';

export default function AdminRoot() {
    // Instantly redirect to the login page
    redirect('/admin/login');
}
