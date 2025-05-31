"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/components/auth-provider"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user } = useAuth()

  // Pages qui n'ont pas besoin de sidebar (page d'accueil publique et login)
  const publicPages = ["/", "/login"]
  const isPublicPage = publicPages.includes(pathname)

  // Si c'est une page publique ou si l'utilisateur n'est pas connecté
  if (isPublicPage && !user) {
    return <>{children}</>
  }

  // Si l'utilisateur est connecté, utiliser le layout avec sidebar
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  )
}
