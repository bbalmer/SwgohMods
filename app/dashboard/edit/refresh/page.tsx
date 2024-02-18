import Form from '@/app/ui/characters/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { refreshSwgohCharacters } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page() {

    const character = await refreshSwgohCharacters();


    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Characters', href: '/dashboard/characters' },
                    {
                        label: 'Refresh Characters',
                        href: `/dashboard/edit/refresh`,
                        active: true,
                    },
                ]}
            />
            <span>Refreshed Data....</span>
        </main>
    );
}