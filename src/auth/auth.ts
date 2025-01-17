'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getProfile } from "@/http/get-profile"

export async function isAuthenticated() {
 const cookieStore = await cookies()
 const token = cookieStore.get('token')?.value

 if(!token) {
  return false
 }

 return true
}

export async function auth(){

 const cookieStore = await cookies()
 const token = cookieStore.get('token')?.value

 if(!token){
  redirect('auth/login')
 }
 try {
  const { user } = await getProfile()

  return { user }
 } catch  {
  console.log('erro ao buscar perfil')
  redirect('/api/auth/sign-out')
 }
}
