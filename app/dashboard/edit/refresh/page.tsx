'use client';
import Form from '@/app/ui/characters/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { refreshSwgohCharacters } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page() {



    async function handleClick() {
        const character = await refreshSwgohCharacters();
    }

    return (
        <main>

            <button onClick={handleClick} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Refresh Swgoh Characters</button>

        </main>
    );
}