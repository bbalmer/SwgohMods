import Form from '@/app/ui/characters/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCharacterById, fetchCharactersByAbility } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default async function Page({ params }: { params: { id: string } }) {
    const id = decodeURI(params.id);
    const characters = await fetchCharactersByAbility(id);

    if (!characters) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Characters', href: '/dashboard/characters' },
                    {
                        label: `${id}`,
                        href: `/dashboard/abilities/${id}`,
                        active: true,
                    },
                ]}
            />

            <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                            Name
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium">
                            Type
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium">
                            Abilities
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {characters?.map((char) => (
                        <tr
                            key={char.id}
                            className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                        >
                            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                <div className="flex items-center gap-3">
                                    {char.image &&
                                        < Image
                                            src={char.image}
                                            className="mr-2 rounded-full"
                                            width={28}
                                            height={28}
                                            alt={`${char.image}'s profile picture`}
                                        />}
                                    {!char.image &&
                                        < Image
                                            src='/default-profile.png'
                                            className="mr-2 rounded-full"
                                            width={28}
                                            height={28}
                                            alt={`Default profile picture`}
                                        />}
                                    <p>
                                        <Link href={`/dashboard/characters/${char.id}`} className=" p-2 hover:bg-gray-100 underline">{char.name}</Link>
                                    </p>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-3">
                                {char.type}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3">
                                {char.abilities?.map((idx, a) => (
                                    <span key={idx}>&apos;{a}&apos;&nbsp;&nbsp;</span>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}