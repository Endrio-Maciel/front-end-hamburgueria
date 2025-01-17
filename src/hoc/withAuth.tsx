'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function withAuth(Component: React.ComponentType) {
  return function ProtectedPage(props: any) {
    const router = useRouter();

    useEffect(() => {
      // Verificar se há um token no localStorage
      const token = localStorage.getItem('authToken');
      console.log('aqui esta o token', token)
      if (!token) {
        router.push('/auth/login');
      }
    }, [router]);

    return <Component {...props} />;
  };
}
