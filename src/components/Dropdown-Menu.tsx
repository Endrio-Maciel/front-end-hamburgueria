import { ChevronDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import Link from 'next/link'

export function DropdownMenuSwithcer () {
  // const {} = await getProfile()
 
  return (
  <DropdownMenu>
    <DropdownMenuTrigger className="flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <span className="text-muted-foreground">Selecione</span>
      <ChevronDown className="ml-auto size-4 text-muted-foreground" />
   
    </DropdownMenuTrigger> 
    <DropdownMenuContent align="end" alignOffset={-16} className="w-[200px]" sideOffset={12} >
      <DropdownMenuGroup>
        <DropdownMenuLabel>Menu de ações</DropdownMenuLabel>
          <DropdownMenuItem>
            <Link href={'/'}>
                Painel
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={'/transactions'}>
                Entradas & Saídas
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={'/categories'}>
                Categorias
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={'/accounts'}>
                Contas & Caixa
            </Link>
          </DropdownMenuItem>

      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
 )
}