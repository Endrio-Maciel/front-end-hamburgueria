import Image from "next/image";
import LogoChama from '@/assets/LogoChama.svg'
import { Slash } from "lucide-react";
import { DropdownMenuSwithcer } from "./Dropdown-Menu";
import { ProfileButton } from "./profile-button";
import Link from "next/link";

export function Header() {
 return (
  <div className="p-3 mx-auto flex max-w [1200px] items-center justify-between">
    <div className="flex items-center gap-3">
      <Link href={'/'}>
      <Image 
       src={LogoChama}
       alt="LogoChama"
       className="h-8 w-8"
      />
      </Link>
      <Slash className="h-4 w-4 -rotate-[24deg] text-border"/>

      <DropdownMenuSwithcer />
    </div>
    <div className="flex items-center gap-4">
      <ProfileButton />
    </div>
  </div>
 )
}