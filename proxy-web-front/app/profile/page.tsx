"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Mail, User } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

interface UserProfile {
  _id: string
  email: string
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchProfile()
    }
  }, [token])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase()
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Mon Profil</h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Informations utilisateur</span>
            </CardTitle>
            <CardDescription>Détails de votre compte administrateur</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {loading ? "?" : profile ? getInitials(profile.email) : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <Badge variant="secondary">Administrateur</Badge>
                <p className="text-sm text-muted-foreground">Accès complet au système proxy</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  {loading ? (
                    <Skeleton className="h-4 w-48" />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Date de création</p>
                  {loading ? (
                    <Skeleton className="h-4 w-32" />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {profile ? formatDate(profile.createdAt) : "Non disponible"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Dernière mise à jour</p>
                  {loading ? (
                    <Skeleton className="h-4 w-32" />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {profile ? formatDate(profile.updatedAt) : "Non disponible"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques du compte</CardTitle>
            <CardDescription>Informations sur votre utilisation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">Admin</p>
                <p className="text-sm text-muted-foreground">Niveau d'accès</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">Actif</p>
                <p className="text-sm text-muted-foreground">Statut du compte</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Permissions</p>
              <div className="space-y-2">
                <Badge variant="outline" className="mr-2">
                  Gestion des logs
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Statistiques
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Configuration proxy
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
