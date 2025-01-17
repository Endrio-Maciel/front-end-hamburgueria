import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ForgotPasswordPage() {
 return (
   <form action="" className="space-y-4" >
     <h1>Recuperar senha</h1>
   
    <div className="space-y-1">
      <Label>E-mail</Label>
      <Input name="email" type="email" id="email"/>
    </div>
   
      <Button className="w-full" type="submit">
       Recuperar senha
      </Button>
     
      <Button className="w-full" size="sm" variant="link" asChild>
        <Link href="/auth/login">
          Voltar para o login
        </Link>
      </Button>
   </form>
 )
}