'use server'

import { env } from "@/env";
import { cookies } from "next/headers";

// interface TransactionResponse {
//   title: string;
//   amount: number;
//   type: string;
//   categoryId: string;
//   description?: string;
//   category: {name: string}
//   dueDate: string;
//   paymentDate?: string;
//   accountId: string;
//   creditCardId?: string;
// }

export async function getAllTransactions(page?: number, perPage?: number) {
 try {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token || typeof token !== 'string') {
   console.error("Token não encontrado ou é inválido.");
   throw new Error('Token não encontrado ou é inválido');
  }

  let url = `${env.NEXT_PUBLIC_API_URL}/transactions`

  const params: URLSearchParams = new URLSearchParams()
  if(page) params.append('page', page.toString())
  if(perPage) params.append('perPage', perPage.toString())

  if(params.toString()) {
   url += `?${params.toString()}`
  } 

  const response = await fetch(url, {
    headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json',
    } 
   }).then();
   
   if (!response.ok) {
    console.error("Erro na resposta da API:", await response.json());
    throw new Error("Erro ao obter transaçôes.");
   }

   return await response.json()
 } catch (error) {
   console.error("Erro ao enviar a requisição:", error);
   throw error;
 }
}
