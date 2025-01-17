'use server'

import { env } from "@/env";
import { cookies } from "next/headers";

export async function getAllCategories() {
 try {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token || typeof token !== 'string') {
   console.error("Token não encontrado ou é inválido.");
   throw new Error('Token não encontrado ou é inválido');
  }

  const url = `${env.NEXT_PUBLIC_API_URL}/categories`

  const response = await fetch(url, {
   method: 'GET', 
   headers: {
     'Authorization': `Bearer ${token}`,
    } 
   })
   
   if (!response.ok) {
   
    throw new Error("Erro ao obter categorias.");
   }

   const categoriesData = await response.json();
   console.log("Categorias recebidas:", categoriesData);
   return categoriesData;
 } catch (error) {
   console.error("Erro ao enviar a requisição:", error);
   throw error;
 }
}
