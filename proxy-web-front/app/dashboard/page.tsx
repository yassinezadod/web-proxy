"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Activity, Globe, TrendingUp, Users } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

interface Stats {
  totalRequests: number
  totalBandwidth: number
  topUrls: Array<{
    _id: string
    count: number
  }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const fetchStats = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("http://localhost:5000/api/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(response.ok)
        

        if (!response.ok) {
          throw new Error(`Stat API error: ${response.status}`)
        }

        const data = await response.json()
        
        setStats(data)
      } catch (err) {
        setError("Erreur lors du chargement des statistiques.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [token])

  const formatBandwidth = (bytes: number) => {
    const units = ["B", "KB", "MB", "GB", "TB"]
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
        </div>
      </div>

      {error && (
        <div className="text-red-600 font-semibold mb-4">{error}</div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requêtes totales</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.totalRequests?.toLocaleString() ?? 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Nombre total de requêtes proxy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bande passante</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.totalBandwidth ? formatBandwidth(stats.totalBandwidth) : "0 B"}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Bande passante totale utilisée</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">URLs populaires</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.topUrls?.length ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Nombre d'URLs différentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statut</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Actif</div>
            <p className="text-xs text-muted-foreground">Service proxy opérationnel</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Top URLs accédées</CardTitle>
            <CardDescription>Les URLs les plus visitées via le proxy</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            ) : stats?.topUrls?.length ? (
              <div className="space-y-2">
                {stats.topUrls.slice(0, 10).map((url, index) => (
                  <div key={url._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        #{index + 1}
                      </span>
                      <span className="text-sm truncate max-w-xs">{url._id}</span>
                    </div>
                    <span className="text-sm font-medium">{url.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune donnée disponible</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
