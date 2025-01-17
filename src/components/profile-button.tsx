import { ChevronDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { auth } from "@/auth/auth";

function getInitials(name: string): string {
 return name
   .split(" ")
   .map((word) => word.charAt(0).toUpperCase())
   .slice(0, 2)
   .join("");
}

export async function ProfileButton() {
 const { user } = await auth() 
 
 return (
  <DropdownMenu>
    <DropdownMenuTrigger className="flex items-center fap-3 outline-none">
     <div className="flex flex-col items-end">
       <span className="text-sm font-medium">{user.name}</span>
       <span className="text-xs text-muted-foreground">{user.email}</span>
     </div>
     <Avatar>
       < AvatarFallback>{getInitials(user.name)}</AvatarFallback>
     </Avatar>
      <ChevronDown className="size-4 text-muted-foreground" />
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end">
      <DropdownMenuItem asChild>
        <a href="">
         <LogOut className="mr-2 size-4"/>
         Sair
        </a>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
 )
}