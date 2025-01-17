'use server'

import { env } from "@/env";
import { cookies } from "next/headers";

interface CreateTransactionRequest {
  title: string;
  amount: number;
  type: string;
  categoryId: string;
  description?: string;
  dueDate: string;
  paymentDate?: string;
  accountId: string;
}

export async function createTransaction(data: CreateTransactionRequest) {
 try {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token || typeof token !== 'string') {
   console.error("Token não encontrado ou é inválido.");
   throw new Error('Token não encontrado ou é inválido');
  }

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/transactions/register`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json',
    } 
   });
   
   if (!response.ok) {
    console.error("Erro na resposta da API:", await response.json());
    throw new Error("Erro ao criar transação.");
   }

   return await response.json()
 } catch (error) {
   console.error("Erro ao enviar a requisição:", error);
   throw error;
 }
}
