'use server'
import { env } from "@/env";
import { cookies } from "next/headers";

export async function deleteAccount(id: string) {
 try {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token || typeof token !== 'string') {
   throw new Error('Token não encontrado ou é inválido');
  }

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/account/${id}/delete`, {
    method: 'DELETE',
    headers: {
     'Authorization': `Bearer ${token}`,
    } 
   });
   console.log('Resposta da requisição:', response.status, response.statusText);


   if (!response.ok) {
    const errorText = await response.text();  
    console.error('Erro ao atualizar categoria:', errorText);
    throw new Error(`Erro ao atualizar categoria: ${errorText}`);
   }

   return await response.json()
 } catch (error) {
   console.error('Erro ao editar categoria:', error);
   throw error;
 }
}
