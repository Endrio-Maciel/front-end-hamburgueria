import 'dotenv/config'
import { z } from 'zod'


const envSchema = z.object({
 
 NEXT_PUBLIC_API_URL: z.string().url(),
 PORT: z.coerce.number().default(3000),

})

const _env = envSchema.safeParse(process.env)

if( _env.success == false) {
 console.log('Invalid environment varíables')
 throw new Error('Invalid environment varíables')
}

export const env = _env.data