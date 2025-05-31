"use client"

import { useEffect, useState, createContext, useContext } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  email: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  logout: () => void
  login: (token: string) => Promise<void>
  token: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
  login: async () => {},
  token: null,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  const fetchUserProfile = async () => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken) {
      setLoading(false)
      setToken(null)
      setUser(null)
      return
    }

    setToken(storedToken)

    try {
      const response = await fetch("http://localhost:5000/api/user/me", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        console.error("Échec récupération profil, statut:", response.status)
        localStorage.removeItem("token")
        setUser(null)
        setToken(null)
        router.push("/login")
      }
    } catch (error) {
      console.error("Erreur récupération profil:", error)
      localStorage.removeItem("token")
      setUser(null)
      setToken(null)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const login = async (newToken: string) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
    await fetchUserProfile()
    router.push("/dashboard")
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setToken(null)
    router.push("/login")
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, logout, login, token }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
