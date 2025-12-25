'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logoutAction() {
  const cookieStore = await cookies()
  
  // 1. Borramos la cookie de sesión
  cookieStore.delete('session_token')

  // 2. Redirigimos al Login del Portal Principal usando la variable de entorno
  // Usamos una URL absoluta para forzar el salto entre puertos/proyectos
  const mainUrl = process.env.NEXT_PUBLIC_MAIN_URL || 'http://localhost:3000'
  
  redirect(`${mainUrl}/login`)
}