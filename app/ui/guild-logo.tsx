
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function GuildLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Image src='/guild_icon_flame.png' height='64' width='64' className="h-12 w-12 rotate-[15deg]" alt='Brutals Guild Logo' />
      <p className="text-[44px]">Brutals</p>
    </div>
  );
}
