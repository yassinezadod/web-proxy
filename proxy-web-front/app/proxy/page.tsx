"use client"

import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Globe, Loader2, ExternalLink, Shield, Zap } from "lucide-react"

export default function ProxyPage() {
  const [url, setUrl] = useState("")
  const [disableJS, setDisableJS] = useState(false)
  const [blockAds, setBlockAds] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [proxyUrl, setProxyUrl] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const validateUrl = (inputUrl: string) => {
    try {
      // Si l’URL ne contient pas de protocole, ajoute https://
      const fullUrl = inputUrl.match(/^https?:\/\//i) ? inputUrl : `https://${inputUrl}`
      const urlObj = new URL(fullUrl)
      return urlObj.href
    } catch {
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    
    const formattedUrl = validateUrl(url)
    if (!formattedUrl) {
      setError("URL invalide. Veuillez entrer une URL correcte.")
      return
    }

    setLoading(true)

    try {
      // Construire l’URL du proxy
      const params = new URLSearchParams({
        url: formattedUrl,
        disableJS: disableJS.toString(),
        blockAds: blockAds.toString(),
      })
      const generatedProxyUrl = `http://localhost:5000/api/proxy?${params.toString()}`

      setProxyUrl(generatedProxyUrl)
      setSuccessMessage("URL proxy générée avec succès, ouverture dans un nouvel onglet...")

      // Ouvrir dans un nouvel onglet après un petit délai pour UX
      setTimeout(() => {
        window.open(generatedProxyUrl, "_blank", "noopener,noreferrer")
      }, 300)
    } catch {
      setError("Erreur lors de la génération de l'URL proxy.")
    } finally {
      setLoading(false)
    }
  }

  const openInNewTab = () => {
    if (proxyUrl) {
      window.open(proxyUrl, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Interface Proxy</h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" aria-hidden="true" />
              <span>Naviguer via Proxy</span>
            </CardTitle>
            <CardDescription>Entrez une URL pour la visiter via le proxy web</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="url">URL à visiter</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="example.com ou https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value.trim())}
                  required
                  aria-describedby="urlHelp"
                  aria-invalid={!!error}
                />
                <p id="urlHelp" className="text-xs text-muted-foreground">
                  Entrez l’URL complète ou partielle du site.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center space-x-2" htmlFor="disableJS">
                      <Zap className="h-4 w-4" aria-hidden="true" />
                      <span>Désactiver JavaScript</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">Empêche l'exécution des scripts JavaScript</p>
                  </div>
                  <Switch
                    id="disableJS"
                    checked={disableJS}
                    onCheckedChange={setDisableJS}
                    aria-checked={disableJS}
                    role="switch"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center space-x-2" htmlFor="blockAds">
                      <Shield className="h-4 w-4" aria-hidden="true" />
                      <span>Bloquer les publicités</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Bloque les publicités simples (iframe, div avec 'ad')
                    </p>
                  </div>
                  <Switch
                    id="blockAds"
                    checked={blockAds}
                    onCheckedChange={setBlockAds}
                    aria-checked={blockAds}
                    role="switch"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive" role="alert" aria-live="assertive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert variant="default" role="status" aria-live="polite">
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading} aria-disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                <Globe className="mr-2 h-4 w-4" aria-hidden="true" />
                Visiter via Proxy
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
            <CardDescription>Comment utiliser le proxy web</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                {
                  step: "1",
                  title: "Entrez l'URL",
                  desc: "Saisissez l'URL du site que vous souhaitez visiter",
                },
                {
                  step: "2",
                  title: "Configurez les options",
                  desc: "Activez ou désactivez JavaScript et le blocage des publicités",
                },
                {
                  step: "3",
                  title: "Visitez le site",
                  desc: "Le site s'ouvrira dans un nouvel onglet via le proxy",
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                    {step}
                  </div>
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {proxyUrl && (
              <div className="pt-4 border-t">
                <Label className="text-sm font-medium">Dernière URL générée :</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-md break-words">
                  <code className="text-sm">{proxyUrl}</code>
                </div>
                <Button variant="outline" size="sm" className="mt-2" onClick={openInNewTab}>
                  <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                  Ouvrir à nouveau
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
