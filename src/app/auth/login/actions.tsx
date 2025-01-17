'use server'

import { signInWithPassword } from '@/http/sign-in-with-password'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const signInSchema = z.object({
 email: z.string().email({message: 'Por favor, insira um email válido.'}),
 password: z.string().min(1 , { message: 'Por favor, insira sua senha'}),
})

export async function signInWithEmailAndPassword(data: FormData) {
 
  const result = signInSchema.safeParse(Object.fromEntries(data))

 if(!result.success) {
  const errors = result.error.flatten().fieldErrors

  return {success: false, message: null, errors}
 }

 const { email, password } = result.data

 try{
  const { token } = await signInWithPassword({email, password})
  
  ;(await cookies()).set('token', token, {
   path: '/',
   maxAge: 60 * 60 * 24 * 7, // 7 days
  })
 
 } catch (error) {
  console.error(error)

  return { success: false, message: "Unexpected error, try again in a few minutes", errors: null }
}

redirect('/')

}