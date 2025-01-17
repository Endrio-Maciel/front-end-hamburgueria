import { Header } from "@/components/Header";
import { ManageAccounts } from "./actions";

export default function CategoriesOage () {
 return (
       <div className='space-y-4 py-4'>
        <Header />
        <main className='mx-auto w-full max-w-[1200px] space-y-4'>
          <p className='text-sm text-muted-foreground'>Selecione uma sessão</p>
           
           <ManageAccounts/>
        </main>
      </div>
 )
}