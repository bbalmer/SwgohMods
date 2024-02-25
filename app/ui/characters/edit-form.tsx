'use client';

import {
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateCharacter } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { characters } from '@prisma/client';
// import { TagsInput } from "react-tag-input-component";
// import { useEffect, useState } from 'react';

export default function EditCharacterForm({ character }: {
  character: characters;
}) {
  const initialState = { message: null, errors: {} };
  const updateCharacterWithId = updateCharacter.bind(null, character.id);
  const [state, dispatch] = useFormState(updateCharacterWithId, initialState);
  // const [selected, setSelected] = useState(["gfg"]);

  // useEffect(() => {
  //   console.log(selected);
  // }, [selected])
  return (
    <form action={dispatch}>
      <input type='hidden' id='id' name='id' defaultValue={character.id} />
      <input type='hidden' id='image' name='image' defaultValue={character.image} />
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Character Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Character Name
          </label>
          <div className="relative">
            <input
              type='text'
              id='name'
              name='name'
              required
              defaultValue={character.name}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        {/* Character Nickname */}
        <div className="mb-4">
          <label htmlFor="nickname" className="mb-2 block text-sm font-medium">
            Nickname
          </label>
          <div className="relative">
            <input
              type='text'
              id='nickname'
              name='nickname'
              defaultValue={character.nickname}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* SWGOH ID */}
        <div className="mb-4">
          <label htmlFor="swgoh_id" className="mb-2 block text-sm font-medium">
            SWGOH ID
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="swgoh_id"
                name="swgoh_id"
                type="text"
                defaultValue={character.swgoh_id}
                placeholder="SWGOH Character ID"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Character Type */}
        <div className="mb-4">
          <label htmlFor="type" className="mb-2 block text-sm font-medium">
            Type
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="type"
                name="type"
                type="text"
                defaultValue={character.type}
                placeholder="Character Type"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Recommended Set */}
          <div className="mb-4">
            <label htmlFor="recommended_set" className="mb-2 block text-sm font-medium">
              Recommended Set
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="recommended_set"
                  name="recommended_set"
                  type="text"
                  defaultValue={character.recommended_set}
                  placeholder="Recommended Set"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Recommended Speed */}
          <div className="mb-4">
            <label htmlFor="recommended_speed" className="mb-2 block text-sm font-medium">
              Recommended Speed
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="recommended_speed"
                  name="recommended_speed"
                  type="text"
                  defaultValue={character.recommended_speed}
                  placeholder="Recommended SpeedType"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RECEIVER */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Receiver Primary */}
          <div className="mb-4">
            <label htmlFor="receiver_primary" className="mb-2 block text-sm font-medium">
              Receiver Primary
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="receiver_primary"
                  name="receiver_primary"
                  type="text"
                  defaultValue={character.receiver_primary}
                  placeholder="Receiver Primary"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Receiver Secondary */}
          <div className="mb-4">
            <label htmlFor="receiver_secondary" className="mb-2 block text-sm font-medium">
              Receiver Secondary
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="receiver_secondary"
                  name="receiver_secondary"
                  type="text"
                  defaultValue={character.receiver_secondary}
                  placeholder="Receiver Secondary"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>


        {/* HOLO */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Holo Primary */}
          <div className="mb-4">
            <label htmlFor="holo_primary" className="mb-2 block text-sm font-medium">
              Holo-Array Primary
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="holo_primary"
                  name="holo_primary"
                  type="text"
                  defaultValue={character.holo_primary}
                  placeholder="Holo-Array Primary"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Holo-Array Secondary */}
          <div className="mb-4">
            <label htmlFor="holo_secondary" className="mb-2 block text-sm font-medium">
              Holo-Array Secondary
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="holo_secondary"
                  name="holo_secondary"
                  type="text"
                  defaultValue={character.holo_secondary}
                  placeholder="Holo-Array Secondary"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>


        {/* MULTIPLEXER */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Multi Primary */}
          <div className="mb-4">
            <label htmlFor="multiplexer_primary" className="mb-2 block text-sm font-medium">
              Multiplexer Primary
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="multiplexer_primary"
                  name="multiplexer_primary"
                  type="text"
                  defaultValue={character.multiplexer_primary}
                  placeholder="Multiplexer Primary"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Holo-Array Secondary */}
          <div className="mb-4">
            <label htmlFor="multiplexer_secondary" className="mb-2 block text-sm font-medium">
              Multiplexer Secondary
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="multiplexer_secondary"
                  name="multiplexer_secondary"
                  type="text"
                  defaultValue={character.multiplexer_secondary}
                  placeholder="Multiplexer Secondary"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* DATABUS */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Databus Primary */}
          <div className="mb-4">
            <label htmlFor="databus_primary" className="mb-2 block text-sm font-medium">
              Databus Primary
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="databus_primary"
                  name="databus_primary"
                  type="text"
                  defaultValue={character.databus_primary}
                  placeholder="Databus Primary"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Holo-Array Secondary */}
          <div className="mb-4">
            <label htmlFor="databus_secondary" className="mb-2 block text-sm font-medium">
              Databus Secondary
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="databus_secondary"
                  name="databus_secondary"
                  type="text"
                  defaultValue={character.databus_secondary}
                  placeholder="Databus Secondary"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* TRANSMITTER */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Databus Primary */}
          <div className="mb-4">
            <label htmlFor="transmitter_primary" className="mb-2 block text-sm font-medium">
              Transmitter Primary
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="transmitter_primary"
                  name="transmitter_primary"
                  type="text"
                  defaultValue={character.transmitter_primary}
                  placeholder="Transmitter Primary"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Holo-Array Secondary */}
          <div className="mb-4">
            <label htmlFor="transmitter_secondary" className="mb-2 block text-sm font-medium">
              Transmitter Secondary
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="transmitter_secondary"
                  name="transmitter_secondary"
                  type="text"
                  defaultValue={character.transmitter_secondary}
                  placeholder="Transmitter Secondary"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>


        {/* PROCESSOR */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Databus Primary */}
          <div className="mb-4">
            <label htmlFor="processor_primary" className="mb-2 block text-sm font-medium">
              Transmitter Primary
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="processor_primary"
                  name="processor_primary"
                  type="text"
                  defaultValue={character.processor_primary}
                  placeholder="processor_primary Primary"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Holo-Array Secondary */}
          <div className="mb-4">
            <label htmlFor="processor_secondary" className="mb-2 block text-sm font-medium">
              Transmitter Secondary
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="processor_secondary"
                  name="processor_secondary"
                  type="text"
                  defaultValue={character.processor_secondary}
                  placeholder="Transmitter Secondary"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label htmlFor="notes" className="mb-2 block text-sm font-medium">
            Notes
          </label>
          <div className="relative">
            <input
              type='text'
              id='notes'
              name='notes'
              defaultValue={character.notes}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/characters"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Character</Button>
      </div>
    </form>
  );
}
