'use server'

import { env } from "@/env";
import { cookies } from "next/headers";

interface UpdatedTransactionRequest {
 type?: "INCOME" | "EXPENSE";
 title?: string;
 description?: string;
 amount?: number;
 dueDate?: string;
 paymentDate?: string;
 categoryId?: string;
}

export async function updateTransaction(id: string, data: UpdatedTransactionRequest) {
 try {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token || typeof token !== 'string') {
   throw new Error('Token não encontrado ou é inválido');
  }

  const sanitizedData = {
   ...data,
   dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
   paymentDate: data.paymentDate ? new Date(data.paymentDate).toISOString() : null
  }


  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/transactions/${id}/change`, {
    method: 'PUT',
    body: JSON.stringify(sanitizedData),
    headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json',
    } 
   });
   
   if (!response.ok) {
    throw new Error("Erro ao atualizar transação.");
   }

   return await response.json()
 } catch (error) {
   throw error;
 }
}
