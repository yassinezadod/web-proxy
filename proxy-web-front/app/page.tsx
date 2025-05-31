"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Globe, Loader2, ExternalLink, Shield, Zap, LogIn } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function HomePage() {
  const [url, setUrl] = useState("")
  const [disableJS, setDisableJS] = useState(false)
  const [blockAds, setBlockAds] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [proxyUrl, setProxyUrl] = useState("")
  const router = useRouter()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validation de l'URL
      if (!url) {
        setError("Veuillez entrer une URL")
        return
      }

      // Ajouter http:// si pas de protocole
      let formattedUrl = url
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        formattedUrl = "https://" + url
      }

      // Construire l'URL du proxy avec l'API externe
      const params = new URLSearchParams({
        url: formattedUrl,
        disableJS: disableJS.toString(),
        blockAds: blockAds.toString(),
      })

      const generatedProxyUrl = `http://localhost:5000/api/proxy?${params.toString()}`
      setProxyUrl(generatedProxyUrl)

      // Ouvrir dans un nouvel onglet
      window.open(generatedProxyUrl, "_blank")
    } catch (err) {
      setError("Erreur lors de la génération de l'URL proxy")
    } finally {
      setLoading(false)
    }
  }

  const openInNewTab = () => {
    if (proxyUrl) {
      window.open(proxyUrl, "_blank")
    }
  }

  const handleLoginClick = () => {
    router.push("/login")
  }

  const handleDashboardClick = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header avec bouton login/dashboard */}
      <div className="w-full p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Proxy Web</h1>
              <p className="text-sm text-gray-600">Navigation sécurisée et anonyme</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {user ? (
              <Button onClick={handleDashboardClick} variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Administration
              </Button>
            ) : (
              <Button onClick={handleLoginClick} variant="outline">
                <LogIn className="h-4 w-4 mr-2" />
                Connexion Admin
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Naviguez en toute sécurité</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Accédez à n'importe quel site web via notre proxy sécurisé. Bloquez les publicités et désactivez
              JavaScript selon vos besoins.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span>Interface Proxy</span>
                </CardTitle>
                <CardDescription>Entrez une URL pour la visiter via notre proxy sécurisé</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="url" className="text-base font-medium">
                      URL à visiter
                    </Label>
                    <Input
                      id="url"
                      type="text"
                      placeholder="example.com ou https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      className="h-12 text-lg"
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <Label className="flex items-center space-x-2 text-base font-medium">
                          <Zap className="h-5 w-5 text-orange-500" />
                          <span>Désactiver JavaScript</span>
                        </Label>
                        <p className="text-sm text-gray-600">Empêche l'exécution des scripts JavaScript</p>
                      </div>
                      <Switch checked={disableJS} onCheckedChange={setDisableJS} />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <Label className="flex items-center space-x-2 text-base font-medium">
                          <Shield className="h-5 w-5 text-green-500" />
                          <span>Bloquer les publicités</span>
                        </Label>
                        <p className="text-sm text-gray-600">Bloque les publicités simples (iframe, div avec 'ad')</p>
                      </div>
                      <Switch checked={blockAds} onCheckedChange={setBlockAds} />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    <Globe className="mr-2 h-5 w-5" />
                    Visiter via Proxy
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-blue-600">Comment ça marche ?</CardTitle>
                <CardDescription>Guide d'utilisation du proxy web</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Entrez l'URL</p>
                      <p className="text-gray-600">Saisissez l'URL du site que vous souhaitez visiter</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Configurez les options</p>
                      <p className="text-gray-600">
                        Activez ou désactivez JavaScript et le blocage des publicités selon vos besoins
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Naviguez en sécurité</p>
                      <p className="text-gray-600">Le site s'ouvrira dans un nouvel onglet via notre proxy sécurisé</p>
                    </div>
                  </div>
                </div>

                {proxyUrl && (
                  <div className="pt-6 border-t">
                    <Label className="text-sm font-medium text-gray-900">Dernière URL générée :</Label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                      <code className="text-sm break-all text-gray-700">{proxyUrl}</code>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3" onClick={openInNewTab}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ouvrir à nouveau
                    </Button>
                  </div>
                )}

                <div className="pt-6 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">100%</p>
                      <p className="text-sm text-gray-600">Anonyme</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">24/7</p>
                      <p className="text-sm text-gray-600">Disponible</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
