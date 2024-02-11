import Image from 'next/image';
import { EditCharacter } from '@/app/ui/characters/buttons';
import { fetchFilteredCharacters } from '@/app/lib/data';

export default async function CharacterListingTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {

  const characters = await fetchFilteredCharacters(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {characters?.map((char) => (
              <div
                key={char.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
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
                      <p>{char.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{char.type}</p>
                  </div>
                  {/* <InvoiceStatus status={char.recommended_set} /> */}
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {/* {formatCurrency(invoice.amount)} */}
                    </p>
                    {/* <p>{formatDateToLocal(invoice.date)}</p> */}
                  </div>
                  <div className="flex justify-end gap-2">
                    <EditCharacter id={char.id} />
                    {/* <DeleteInvoice id={char.id} /> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                  Recommended Set
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Recommended Speed
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
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
                      <p>{char.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {char.type}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {char.recommended_set}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {char.recommended_speed}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <EditCharacter id={char.id} />
                      {/* <DeleteInvoice id={char.id} /> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
