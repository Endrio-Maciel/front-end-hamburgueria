import { Header } from "@/components/Header";
import { TransactionForm } from "@/components/Transactions-Form";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { AddTransactionPage } from "./actions";

export default function TransactionPage () {
 return (
       <div className='space-y-4 py-4'>
        <Header />
        <main className='mx-auto w-full max-w-[1200px] space-y-4'>
          <p className='text-sm text-muted-foreground'>Selecione uma sessão</p>
           
           <AddTransactionPage />

           <Separator />

           <TransactionForm />
        </main>
      </div>
 )
}