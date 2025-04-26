import React, { Component } from 'react';
import styles from './AddToMyFavorite.module.css'
class AddToMyFavorite extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isFavorite: false,
        };
      }    
    render() { 
        return (<>
        {/* <h1>這是收藏按鈕</h1> */}
        <button 
        className={`btn rounded ptxtb2 ${styles.favBtn}`}
        onClick={this.favBtnClick}>
            {this.state.isFavorite ? (
                <i className={`bi bi-heart-fill ${styles.favClick}`}></i>) 
                : (
                <>
                <i className={`bi bi-heart ${styles.favOriginal}`}></i>
                <i className={`bi bi-heart-fill ${styles.favHover}`}></i>
                </>
            )}    
        </button>
        </>);
    }

    favBtnClick = () => {
        this.setState((prevState) => ({
          isFavorite: !prevState.isFavorite,
        }));
      }
    
}
 
export default AddToMyFavorite;