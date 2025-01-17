'use server'

import { env } from "@/env";
import { cookies } from "next/headers";

export async function editCategoryInBackend(id: string, name: string) {
 try {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token || typeof token !== 'string') {
   throw new Error('Token não encontrado ou é inválido');
  }

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/categories/${id}/change`, {
    method: 'PUT',
    body: JSON.stringify({name}),
    headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json',
    } 
   });
   console.log('Resposta da requisição:', response.status, response.statusText);


   if (!response.ok) {
    const errorText = await response.text();  // Pega o texto da resposta
    console.error('Erro ao atualizar categoria:', errorText);
    throw new Error(`Erro ao atualizar categoria: ${errorText}`);
   }

   return await response.json()
 } catch (error) {
   console.error('Erro ao editar categoria:', error);
   throw error;
 }
}
