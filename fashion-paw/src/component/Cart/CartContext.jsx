// src/context/CartContext.jsx
import React, { Component, createContext } from 'react';

export const CartContext = createContext();

export class CartProvider extends Component {
    state = {
        cartList: [],
        sellers: [], 
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

    // 設定 seller 名單
    setSellers = (userList) => {
        if (Array.isArray(userList)) {
            const merged = [...this.state.sellers, ...userList];
            const uniqueSellers = Array.from(
                new Map(merged.map(user => [String(user.uid), user])).values()
            );
            this.setState({ sellers: uniqueSellers });
        }else {
            console.warn("❌ 傳入 setSellers 的不是陣列：", userList);
          }
    };

    // 透過 uid 找 seller username
    getSellerName = (uid) => {
        if (!uid) return '未知賣家';
      
        const seller = this.state.sellers.find(user => String(user.uid) === String(uid));
      
        // 避免 seller 為 undefined 時就嘗試存取 .username
        if (seller) {
        //   console.log("🔍 找到 seller =", seller.username);
          return seller.username;
        } else {
        //   console.log("⚠️ 沒有找到 seller：uid =", uid);
          return `UID: ${uid}（未找到賣家）`;
        }
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

    //統一不同地方的命名
    normalizeCartItem = (item) => {
        // 1. 找第一張圖片（如果有）
        const firstImg = Array.isArray(item.images)
          ? item.images.find(img => img?.img_path)
          : null;
      
        // 2. 抓圖片路徑
        const rawPath = firstImg?.img_path || item.image;
      
        // 3. 不加 IMAGE_HOST，直接用相對路徑
        const fullImagePath = rawPath || "/media/default/no-image.png";
      
        console.log("🧪 圖片處理", {
          img_path: rawPath,
          final: fullImagePath,
        });
      
        return {
          cart_id: item.cart_id || `${item.pid}`,
          pid: item.pid,
          uid: item.uid || null,
          condition: item.condition || "new",
          quantity: item.quantity || 1,
          productName: item.pd_name || item.productName || item.name ,
          unit_price: parseInt(item.price || item.unit_price || 0),
          image: fullImagePath,
        //   color: item.attribute?.color || item.color || "無",
        };
      };


}