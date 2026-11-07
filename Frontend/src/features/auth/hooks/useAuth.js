import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth.context.js";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }

    const { user, setUser, loading, setLoading } = context
    const [error, setError] = useState("")


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        setError("")
        try {
            const data = await login({ email, password })
            setUser(data.user)
            return true
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Unable to log in.")
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        setError("")
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            return true
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Unable to register.")
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        setError("")
        try {
            await logout()
            setUser(null)
            return true
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Unable to log out.")
            return false
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (err) {
                if (err.response?.status === 401) {
                    setUser(null)
                } else {
                    setError(err.response?.data?.message || err.message || "Unable to check your sign-in status.")
                }
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [setError, setLoading, setUser])

    return { user, loading, error, handleRegister, handleLogin, handleLogout }
}