'use server'
import { env } from "@/env";
import { cookies } from "next/headers";

export async function getSummary() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token || typeof token !== 'string') {
    console.error("Token não encontrado ou é inválido.");
    throw new Error('Token não encontrado ou é inválido');
  }

  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/transactions/summary`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar resumo: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao obter resumo:', error);
    throw error;
  }
}
