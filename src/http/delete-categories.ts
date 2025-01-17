'use server'

import { env } from "@/env";
import { cookies } from "next/headers";

export async function deleteCategory(id: string) {
 try {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token || typeof token !== 'string') {
   console.error("Token não encontrado ou é inválido.");
   throw new Error('Token não encontrado ou é inválido');
  }

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/categories/${id}/delete`, {
    method: 'DELETE',
    headers: {
     'Authorization': `Bearer ${token}`,
    } 
   });
   
   if (!response.ok) {
    const errorBody = await response.text()
    console.error("Erro na resposta da API:", errorBody);
    throw new Error("Erro ao deletar a transação.");
   }
   if(response.status === 204){
    return null
   }

   return await response.json()
 } catch (error) {
   console.error("Erro ao enviar a requisição:", error);
   throw error;
 }
}
