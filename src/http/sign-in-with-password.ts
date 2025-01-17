import { api } from "../services/api";

interface SignInWithPasswordRequest {
  email: string,
  password: string,
 }
 
 interface SignInWithPasswordResponse {
  token: string,
 }
 
 
 export async function signInWithPassword({email, password}: SignInWithPasswordRequest) {
 
  const result = await api
    .post('sessions/password', {
     json: {
      email,
      password,
     },
    }).json<SignInWithPasswordResponse>()
 
  return result
}