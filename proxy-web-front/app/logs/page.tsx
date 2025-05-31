"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Trash2, RefreshCw } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

interface LogEntry {
  _id: string
  url: string
  ip: string
  userAgent: string
  statusCode: number
  bandwidthUsed: number
  timestamp: string
  settingsUsed: {
    disableJS: boolean
    blockAds: boolean
  }
}

const PAGE_SIZE = 5
const API_BASE_URL = "http://localhost:5000"

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { token } = useAuth()

  // Pagination (page starts at 1)
  const [page, setPage] = useState(1)

  // Fetch logs from API (fetch all, then paginate client-side)
  const fetchLogs = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`)
      }
      const data = await response.json()
      setLogs(data)
      setFilteredLogs(data)
      setPage(1) // reset page à 1 à chaque chargement
    } catch (e) {
      setError("Erreur lors du chargement des logs.")
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  // Debounce recherche (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      const filtered = logs.filter(
        (log) =>
          log.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.ip.includes(searchTerm) ||
          log.statusCode.toString().includes(searchTerm),
      )
      setFilteredLogs(filtered)
      setPage(1) // reset à la page 1 lors d'une nouvelle recherche
    }, 300)
    return () => clearTimeout(handler)
  }, [searchTerm, logs])

  // Pagination: logs à afficher sur la page courante
  const paginatedLogs = filteredLogs.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  )

  const formatBandwidth = (bytes: number) => {
    const units = ["B", "KB", "MB", "GB"]
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-100 text-green-800"
    if (status >= 300 && status < 400) return "bg-yellow-100 text-yellow-800"
    if (status >= 400 && status < 500) return "bg-orange-100 text-orange-800"
    if (status >= 500) return "bg-red-100 text-red-800"
    return "bg-gray-100 text-gray-800"
  }

  const deleteLog = async (logId: string) => {
    if (!token) return
    if (!confirm("Voulez-vous vraiment supprimer ce log ?")) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/logs/${logId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        setLogs((prev) => prev.filter((log) => log._id !== logId))
        setFilteredLogs((prev) => prev.filter((log) => log._id !== logId))
      } else {
        alert("Erreur lors de la suppression.")
      }
    } catch (e) {
      console.error(e)
      alert("Erreur lors de la suppression.")
    }
  }

  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Logs des requêtes</h2>
        </div>
        <Button onClick={fetchLogs} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des requêtes proxy</CardTitle>
          <CardDescription>Toutes les requêtes effectuées via le proxy web</CardDescription>
          <div className="flex items-center space-x-2 mt-2 max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              aria-label="Rechercher dans les logs"
              placeholder="Rechercher par URL, IP ou code de statut..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
              disabled={loading}
            />
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
          )}

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Bande passante</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && (
                  [...Array(PAGE_SIZE)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(7)].map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full max-w-[150px]" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}

                {!loading && paginatedLogs.length === 0 && (
                  <TableRow key="empty">
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucun log trouvé
                    </TableCell>
                  </TableRow>
                )}

                {!loading && paginatedLogs.length > 0 && paginatedLogs.map((log) => (
                  <TableRow key={log._id} className="group hover:bg-muted">
                    <TableCell className="max-w-xs truncate" title={log.url}>
                      {log.url}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(log.statusCode)}>{log.statusCode}</Badge>
                    </TableCell>
                    <TableCell>{formatBandwidth(log.bandwidthUsed)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {log.settingsUsed.disableJS && (
                          <Badge variant="outline" className="text-xs">
                            No JS
                          </Badge>
                        )}
                        {log.settingsUsed.blockAds && (
                          <Badge variant="outline" className="text-xs">
                            No Ads
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(log.timestamp)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLog(log._id)}
                        className="h-8 w-8 p-0"
                        aria-label={`Supprimer le log ${log._id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!loading && filteredLogs.length > 0 && (
            <div className="mt-4 flex justify-center space-x-2">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
              >
                Précédent
              </Button>
              <span className="flex items-center px-2">
                Page {page} / {totalPages}
              </span>
              <Button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                variant="outline"
              >
                Suivant
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
