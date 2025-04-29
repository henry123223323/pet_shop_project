import React, { Component } from 'react';
import FavoriteCard from './mycollect/Favorite';
class mycollect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favorites: [
                { id: 1, img: '/logo512.png', pd_name: '貓飼料', price: 350 },
                { id: 1, img: '/logo512.png', pd_name: '貓飼料', price: 350 },
                { id: 1, img: '/logo512.png', pd_name: '貓飼料', price: 350 },
                { id: 1, img: '/logo512.png', pd_name: '貓飼料', price: 350 },
                { id: 1, img: '/logo512.png', pd_name: '貓飼料', price: 350 },
                { id: 1, img: '/logo512.png', pd_name: '貓飼料', price: 350 },
                { id: 2, img: '/logo192.png', pd_name: '狗狗玩具', price: 250 }
            ]
        };
    }

    removeFavorite = (id) => {
        this.setState(prevState => ({
            favorites: prevState.favorites.filter(fav => fav.id !== id)
        }));
    }

    render() {
        return (<>
            <h3>我的收藏</h3>
            <div className="d-flex flex-wrap gap-3">
                {this.state.favorites.map(fav => (
                    <FavoriteCard
                        key={fav.id}
                        img={fav.img}
                        pd_name={fav.pd_name}
                        price={fav.price}
                        onRemove={() => this.removeFavorite(fav.id)}
                    />
                ))}
            </div></>
        );
    }
}

export default mycollect;
