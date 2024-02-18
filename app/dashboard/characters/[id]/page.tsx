import Form from '@/app/ui/characters/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCharacterById, fetchSwgohById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const character = await fetchCharacterById(id);
    const swgoh = await fetchSwgohById(character.swgoh_id);

    let transmitterSecondary = character.transmitter_secondary?.replace(/(\/)/g, " $1 ");
    let processorSecondary = character.processor_secondary?.replace(/(\/)/g, " $1 ");
    let databusSecondary = character.databus_secondary?.replace(/(\/)/g, " $1 ");
    let holoSecondary = character.holo_secondary?.replace(/(\/)/g, " $1 ");
    let receiverSecondary = character.receiver_secondary?.replace(/(\/)/g, " $1 ");
    let multiplexerSecondary = character.multiplexer_secondary?.replace(/(\/)/g, " $1 ");

    if (!character) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Characters', href: '/dashboard/characters' },
                    {
                        label: 'View Character',
                        href: `/dashboard/characters/${id}`,
                        active: true,
                    },
                ]}
            />


            <div className="w-full bg-white border border-gray-200 rounded-lg shadow text-center ">
                <h2 className='p-10 text-3xl text-gray-900'>{character.name}</h2>
                {character.nickname &&
                    <h3 >({character.nickname})</h3>
                }
                <div className="flex flex-col items-center ">
                    <Image className="w-24 h-24 mb-3 rounded-full shadow-lg" height={100} width={100} src={character.image} alt={character.name} />
                    <span className="text-xl font-semibold">{character.type}</span>

                    <div className="grid md:grid-cols-2 gap-12 mt-4">
                        <div className='flex flex-row items-center justify-between '>
                            <div className="flex items-center">
                                <div className="min-w-0">
                                    <p className=" text-sm font-semibold md:text-base">Recommended Set</p>
                                </div>
                                <div className={` pl-5   text-gray-500`}>{character.recommended_set}</div>
                            </div>
                        </div>

                        <div className='flex flex-row items-center justify-between '>
                            <div className="flex items-center">
                                <div className="min-w-0">
                                    <p className=" text-sm font-semibold md:text-base">Recommended Speed</p>
                                </div>
                                <div className={` pl-5   text-gray-500`}>{character.recommended_speed}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6'>
                    {
                        (character.receiver_primary || character.receiver_secondary) &&
                        <div className='grid grid-cols-2 gap-4 py-4'>
                            <div className='grid grid-cols-subgrid gap-2 col-span-2'>
                                <span className="text-xl font-semibold">Receiver</span>
                            </div>
                            <div className="text-right text-sm font-semibold md:text-base">Primary</div>
                            <div className="text-left text-gray-500">{character.receiver_primary}</div>
                            <div className="text-right text-sm font-semibold md:text-base">Secondary</div>
                            <div className="text-left text-gray-500">{receiverSecondary}</div>
                        </div>
                    }
                    {
                        (character.holo_primary || character.holo_secondary) &&
                        <div className='grid grid-cols-2 gap-4 py-4'>
                            <div className='grid grid-cols-subgrid gap-2 col-span-2'>
                                <span className="text-xl font-semibold">Holo-Array</span>
                            </div>
                            <div className="text-right text-sm font-semibold md:text-base">Primary</div>
                            <div className="text-left text-gray-500">{character.holo_primary}</div>
                            <div className="text-right text-sm font-semibold md:text-base">Secondary</div>
                            <div className="text-left text-gray-500">{holoSecondary}</div>
                        </div>
                    }
                    {
                        (character.multiplexer_primary || character.multiplexer_secondary) &&
                        <div className='grid grid-cols-2 gap-4 py-4'>
                            <div className='grid grid-cols-subgrid gap-2 col-span-2'>
                                <span className="text-xl font-semibold">Multiplexer</span>
                            </div>
                            <div className="text-right text-sm font-semibold md:text-base">Primary</div>
                            <div className="text-left text-gray-500">{character.multiplexer_primary}</div>
                            <div className="text-right text-sm font-semibold md:text-base">Secondary</div>
                            <div className="text-left text-gray-500">{multiplexerSecondary}</div>
                        </div>
                    }
                    {
                        (character.databus_primary || character.databus_secondary) &&
                        <div className='grid grid-cols-2 gap-4 py-4'>
                            <div className='grid grid-cols-subgrid gap-2 col-span-2'>
                                <span className="text-xl font-semibold">Databus</span>
                            </div>
                            <div className="text-right text-sm font-semibold md:text-base">Primary</div>
                            <div className="text-left text-gray-500">{character.databus_primary}</div>
                            <div className="text-right text-sm font-semibold md:text-base">Secondary</div>
                            <div className="text-left text-gray-500">{databusSecondary}</div>
                        </div>
                    }
                    {
                        (character.transmitter_primary || character.transmitter_secondary) &&
                        <div className='grid grid-cols-2 gap-4 py-4'>
                            <div className='grid grid-cols-subgrid gap-2 col-span-2'>
                                <span className="text-xl font-semibold">Transmitter</span>
                            </div>
                            <div className="text-right text-sm font-semibold md:text-base">Primary</div>
                            <div className="text-left text-gray-500">{character.transmitter_primary}</div>
                            <div className="text-right text-sm font-semibold md:text-base">Secondary</div>
                            <div className="text-left text-gray-500">{transmitterSecondary}</div>

                        </div>
                    }
                    {
                        (character.processor_primary || character.processor_secondary) &&
                        <div className='grid grid-cols-2 gap-4 py-4'>
                            <div className='grid grid-cols-subgrid gap-2 col-span-2'>
                                <span className="text-xl font-semibold">Processor</span>
                            </div>
                            <div className="text-right text-sm font-semibold md:text-base">Primary</div>
                            <div className="text-left text-gray-500">{character.processor_primary}</div>
                            <div className="text-right text-sm font-semibold md:text-base">Secondary</div>
                            <div className="text-left text-gray-500">{processorSecondary}</div>
                        </div>
                    }
                </div>

                <div className='grid sm:grid-cols-1 md:grid-cols-1 gap-8 mt-6'>

                    <div>
                        <h5 className='text-xl font-semibold'>Alignment / Role / Affiliations</h5>
                        <div className="grid  gap-4 lg:grid-cols-4">
                            {swgoh?.abilities.map((ability) => (
                                <button key={ability} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full text-xs">
                                    {ability}
                                </button>

                            ))}
                        </div>
                    </div>
                    <div>
                        <h5 className='text-xl font-semibold'>Ability Classes</h5>
                        <div className="grid  gap-4 lg:grid-cols-4">
                            {swgoh?.roles.map((role) => (
                                <button key={role} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full text-xs">
                                    {role}
                                </button>

                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}