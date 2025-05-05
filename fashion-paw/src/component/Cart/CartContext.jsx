// src/context/CartContext.jsx
import React, { Component, createContext } from 'react';

export const CartContext = createContext();

export class CartProvider extends Component {
    state = {
        cartList: [],
        sellers: [], // 從 PdDetailPage 設定
    };

    render() {
        return (
            <CartContext.Provider
                value={{
                    cartList: this.state.cartList,
                    addToCart: this.addToCart,
                    updateQuantity: this.updateQuantity,
                    removeFromCart: this.removeFromCart,
                    clearCart: this.clearCart,
                    setSellers: this.setSellers,
                    getSellerName: this.getSellerName
                }}
            >
                {this.props.children}
            </CartContext.Provider>
        );
    }

    // 設定 seller 名單（從 PdDetailPage 傳入）
    setSellers = (userList) => {
        if (Array.isArray(userList)) {
            // console.log("🧾 設定 sellers：", userList); 
            this.setState({ sellers: userList });
        }
    };

    // 透過 uid 找 seller username
    getSellerName = (uid) => {
        const seller = this.state.sellers.find(user => user.uid === String(uid));
        // console.log("🔍 查詢賣家名稱：", uid, "=>", seller?.username);
        return seller ? seller.username : `UID: ${uid}`;
    };

    normalizeCartItem = (item) => {
        return {
            cart_id: item.cart_id || `${item.pid}`, // 假資料已設定就保留，接資料庫由後端回傳
            pid: item.pid,
            uid: item.uid || null,
            condition: item.condition || "new",
            quantity: item.quantity || 1,
            productName: item.pd_name || item.productName,
            unit_price: parseInt(item.price || item.unit_price || 0),
            image: Array.isArray(item.images)
                ? item.images[0]?.img_path
                : item.image || "/media/default/no-image.png",
            color: item.attribute?.color || item.color || "無",
        };
    };

    componentDidMount() {
        const savedCart = localStorage.getItem('cartList');
        if (savedCart) {
            this.setState({ cartList: JSON.parse(savedCart) });
        }
        const savedSellers = localStorage.getItem('sellers');
        if (savedSellers) {
            this.setState({ sellers: JSON.parse(savedSellers) });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.cartList !== this.state.cartList) {
            localStorage.setItem('cartList', JSON.stringify(this.state.cartList));
        }
        if (prevState.sellers !== this.state.sellers) {
            localStorage.setItem('sellers', JSON.stringify(this.state.sellers));
          }
    }

    addToCart = (rawItem) => {
        const newItem = this.normalizeCartItem(rawItem);
        return new Promise((resolve) => {
            this.setState((prev) => {
                const exists = prev.cartList.find(item => item.cart_id === newItem.cart_id);
                if (exists) {
                    const updatedList = prev.cartList.map(item =>
                        item.cart_id === newItem.cart_id
                            ? { ...item, quantity: item.quantity + newItem.quantity }
                            : item
                    );
                    resolve('updated');
                    return { cartList: updatedList };
                } else {
                    resolve('new');
                    return { cartList: [...prev.cartList, newItem] };
                }
            });
        });
    };

    updateQuantity = (cart_id, quantity) => {
        this.setState((prev) => ({
            cartList: prev.cartList.map((item) =>
                item.cart_id === cart_id ? { ...item, quantity } : item
            ),
        }));
    };

    removeFromCart = (cart_id) => {
        this.setState((prev) => ({
            cartList: prev.cartList.filter((item) => item.cart_id !== cart_id),
        }));
    };

    clearCart = () => this.setState({ cartList: [] });


}