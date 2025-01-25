'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState } from "@/hooks/use-form-state"
import Link from "next/link"
import { signInWithEmailAndPassword } from "./actions"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export function SignInForm () {
  const router = useRouter()

  const [isAdminPending, setIsAdminPending] = useState(false)

  const handleAdminLogin = async () => {
    setIsAdminPending(true)  
    try {
      const adminInfo = new FormData();
      adminInfo.append("email", "admin@example.com"); 
      adminInfo.append("password", "admin123");

      await signInWithEmailAndPassword(adminInfo); 
    } catch {
      console.log('Erro ao fazer login automático')
    } finally {
      setIsAdminPending(false)
    }
  }

  const [ {success, message, errors}, handleSubmit, isPending ] = useFormState(
    signInWithEmailAndPassword,
    () => {
      router.push('/')
    }
  )

  useEffect(()=> {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))
    if(token) {
      const tokenValue = token.split('=')[1]
      localStorage.setItem('authToken', tokenValue)
      console.log('Token armazenado no localStorage:', tokenValue)
    }
  }, [])
  
  return (
   <div className="space-y-4">
    <form className="space-y-4" onSubmit={handleSubmit} >
      {success === false && message && (
        <Alert variant={"destructive"}>
          <AlertTriangle className="size-4" />
          <AlertTitle>Falha no login!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

     <h1>Login</h1>
       <div className="space-y-1">
         <Label htmlFor="email">E-mail</Label>
         <Input name="email" type="email" id="email" />
         
         {errors?.email && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.email[0]}</p>
         )}
       </div>
       <div className="space-y-1">
        <Label htmlFor="password">Senha</Label>
        <Input name="password" type="password" id="password" />
        
        {errors?.password && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.password[0]}</p>
        )}

        <Link 
        href='/auth/forgot-password'
        className="text-xs font-medium text-foreground hover:underline"
        >
          Esqueceu sua senha? 
        </Link>

       </div>
       <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : "Entrar"}
       </Button>
    </form>
    <div>
        <Button
          className="w-full bg-blue-500 hover:bg-blue-600"
          onClick={handleAdminLogin}
          disabled={isAdminPending}  
        >
            {isAdminPending ? <Loader2 className="size-4 animate-spin" /> : "Entrar (Demonstrativo)"} 
        </Button>
    </div>
   </div>
 )
}
