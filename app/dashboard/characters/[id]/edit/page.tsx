import Form from '@/app/ui/characters/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCharacterById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const character = await fetchCharacterById(id);

    if (!character) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Characters', href: '/dashboard/characters' },
                    {
                        label: 'Edit Mod',
                        href: `/dashboard/characters/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form character={character} />
        </main>
    );
}