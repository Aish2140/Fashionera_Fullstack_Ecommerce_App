import { createContext, useCallback, useState } from 'react'
import api from '../api/axios'
import { useAuth } from './useAuth'

const CartContext = createContext(null)

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([])
    const { isLoggedIn } = useAuth()

    const fetchCart = useCallback(async () => {
        try {
            const res = await api.get('/cart')
            setCartItems(res.data)
        } catch (err) {
            console.error(err)
        }
    }, [])

    const addToCart = async (productId) => {
        await api.post('/cart', { productId, quantity: 1 })
        await fetchCart()
    }

    const increaseQuantity = async (productId) => {
        const item = cartItems.find((cartItem) => Number(cartItem.productId) === Number(productId))

        if (!item) {
            await addToCart(productId)
            return
        }

        await api.put(`/cart/${item.id}`, { quantity: item.quantity + 1 })
        await fetchCart()
    }

    const decreaseQuantity = async (productId) => {
        const item = cartItems.find((cartItem) => Number(cartItem.productId) === Number(productId))

        if (!item) return;

        if (item.quantity > 1) {
            await api.put(`/cart/${item.id}`, { quantity: item.quantity - 1 })
        } else {
            await api.delete(`/cart/${item.id}`)
        }
        await fetchCart()
    }

    return (
        <CartContext.Provider
            value={{
                cartItems: isLoggedIn ? cartItems : [],
                addToCart,
                increaseQuantity,
                decreaseQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export default CartContext