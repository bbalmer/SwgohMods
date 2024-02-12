import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { Revenue } from '@/app/lib/definitions';
import { fetchRevenue } from '@/app/lib/data';
import clsx from 'clsx';
import Image from 'next/image';

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function ModChart() {


  return (
    <div className="w-full md:col-span-6">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Shapes/Slots
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        {/* NOTE: comment in this code when you get to this point in the course */}

        <div className="bg-white px-6">
          <div
            key='transmitter'
            className='flex flex-row items-center justify-between py-4'>
            <div className="flex items-center">
              <Image
                src="/mods/transmitter.png"
                alt='Transmitter profile picture'
                className="mr-4 "
                width={43}
                height={43}
              />
              <div className="min-w-0">
                <p className=" text-sm font-semibold md:text-base">
                  Transmitter
                </p>
                <p className="hidden text-sm text-gray-500 sm:block">
                  Square
                </p>
              </div>
              <div className={`${lusitana.className} pl-5  text-sm font-medium md:text-base`}>Only have the Offense % primary, maxing at 5.88% Offense</div>
            </div>
          </div>

          <div
            key='processor'
            className='flex flex-row items-center justify-between py-4 border-t'>
            <div className="flex items-center">
              <Image
                src="/mods/processor.png"
                alt='Processor profile picture'
                className="mr-4 "
                width={43}
                height={43}
              />
              <div className="min-w-0">
                <p className=" text-sm font-semibold md:text-base">
                  Processor
                </p>
                <p className="hidden text-sm text-gray-500 sm:block">
                  Diamond
                </p>
              </div>
              <div className={`${lusitana.className} pl-5  text-sm font-medium md:text-base`}>Only have the Defense % primary, maxing at 11.75% Defense</div>
            </div>
          </div>

          <div
            key='databus'
            className='flex flex-row items-center justify-between py-4 border-t'>
            <div className="flex items-center">
              <Image
                src="/mods/data-bus.png"
                alt='Databus profile picture'
                className="mr-4 "
                width={43}
                height={43}
              />
              <div className="min-w-0">
                <p className=" text-sm font-semibold md:text-base">
                  Data-Bus
                </p>
                <p className="hidden text-sm text-gray-500 sm:block">
                  Circle
                </p>
              </div>
              <div className={`${lusitana.className} pl-5  text-sm font-medium md:text-base`}>Can have either the Protection % (23.5% Protection) or Health % (5.88% Health) primaries</div>
            </div>
          </div>

          <div
            key='receiver'
            className='flex flex-row items-center justify-between py-4 border-t'>
            <div className="flex items-center">
              <Image
                src="/mods/receiver.png"
                alt='Receiver profile picture'
                className="mr-4 "
                width={43}
                height={43}
              />
              <div className="min-w-0">
                <p className=" text-sm font-semibold md:text-base">
                  Receiver
                </p>
                <p className="hidden text-sm text-gray-500 sm:block">
                  Arrow
                </p>
              </div>
              <div className={`${lusitana.className} pl-5  text-sm font-medium md:text-base`}>Can have any of the following seven primaries:
                <ul>
                  <li>Offense % (5.88% Offense)</li>
                  <li>Defense % (11.75% Defense)</li>
                  <li>Health % (5.88% Health)</li>
                  <li>Protection % (23.5% Protection)</li>
                  <li>Speed (+30 Speed)</li>
                  <li>Accuracy (12% Accuracy)</li>
                  <li>Critical Avoidance (24% Crit Avoidance)</li>
                </ul>
              </div>
            </div>
          </div>
          <div
            key='halo'
            className='flex flex-row items-center justify-between py-4 border-t'>
            <div className="flex items-center">
              <Image
                src="/mods/halo-array.png"
                alt='Halo profile picture'
                className="mr-4 "
                width={43}
                height={43}
              />
              <div className="min-w-0">
                <p className=" text-sm font-semibold md:text-base">
                  Halo-Array
                </p>
                <p className="hidden text-sm text-gray-500 sm:block">
                  Triangle
                </p>
              </div>
              <div className={`${lusitana.className} pl-5  text-sm font-medium md:text-base`}>Can have any of the following six primaries:
                <ul>
                  <li>Offense % (5.88% Offense)</li>
                  <li>Defense % (11.75% Defense)</li>
                  <li>Health % (5.88% Health)</li>
                  <li>Protection % (23.5% Protection)</li>
                  <li>Critical Chance % (12% Critical Chance)</li>
                  <li>Critical Damage % (36% Critical Damage)</li>
                </ul>
              </div>
            </div>
          </div>

          <div
            key='multi'
            className='flex flex-row items-center justify-between py-4 border-t'>
            <div className="flex items-center">
              <Image
                src="/mods/multiplexer.png"
                alt='Multi profile picture'
                className="mr-4 "
                width={43}
                height={43}
              />
              <div className="min-w-0">
                <p className=" text-sm font-semibold md:text-base">
                  Multiplexer
                </p>
                <p className="hidden text-sm text-gray-500 sm:block">
                  Cross/Plus
                </p>
              </div>
              <div className={`${lusitana.className} pl-5  text-sm font-medium md:text-base`}>Can have any of the following six primaries:
                <ul>
                  <li>Offense % (5.88% Offense)</li>
                  <li>Defense % (11.75% Defense)</li>
                  <li>Health % (5.88% Health)</li>
                  <li>Protection % (23.5% Protection)</li>
                  <li>Potency % (24% Potency)</li>
                  <li>Tenacity % (24% Tenacity)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
