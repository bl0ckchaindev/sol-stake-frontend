"use client"

import { useTheme } from "next-themes"
import { Toaster } from "sonner"

export function ToasterWrapper() {
  const { theme } = useTheme()
  
  return (
    <Toaster 
      expand={true}
      position="bottom-right" 
      richColors
      theme={theme as "light" | "dark" | "system"}
    />
  )
}
