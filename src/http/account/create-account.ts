'use server'

import { env } from "@/env";
import { cookies } from "next/headers";

export async function createAccount(name: string, balance: number ) {
 
 try {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token || typeof token !== 'string') {
   console.error("Token não encontrado ou é inválido.");
   throw new Error('Token não encontrado ou é inválido');
  }

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/account/register`, {
    method: 'POST',
    body: JSON.stringify({name, balance}),
    headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json',
    } 
   });
   
   if (!response.ok) {
    console.error("Erro na resposta da API:", await response.json());
    throw new Error("Erro ao criar categoria.");
   }

   return await response.json()
 } catch (error) {
   console.error("Erro ao enviar a requisição:", error);
   throw error;
 }
}
