import { createContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('user') || 'null')
    )

    const login = (tokenValue, userData) => {
        localStorage.setItem('token', tokenValue)
        localStorage.setItem('user', JSON.stringify(userData))
        setToken(tokenValue)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
    }

    const isLoggedIn = !!token

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext