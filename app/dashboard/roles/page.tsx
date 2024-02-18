
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchRoles } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';


export default async function Page() {

    const roles = await fetchRoles();

    if (!roles) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    {
                        label: 'View Roles',
                        href: `/dashboard/roles`,
                        active: true,
                    },
                ]}
            />

            <div className="w-full bg-white  rounded-lg  text-center ">
                <div className="grid  gap-4 lg:grid-cols-4">
                    {roles?.map((role) => (
                        <Link
                            key={role.type}
                            href={`/dashboard/roles/${role.type}`}
                            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            <span className="hidden md:block">{role.type}</span>

                        </Link>
                    ))}
                </div>

            </div>
        </main>
    );
}