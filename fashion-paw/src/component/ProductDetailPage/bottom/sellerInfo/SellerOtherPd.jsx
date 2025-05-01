import React, { Component } from 'react';
import styles from './SellerOtherPd.module.css'
import AddToMyFavorite from '../../../share/AddToMyFavorite';
import AddToCartBtn from '../../../share/AddToCartBtn';
class SellerOtherPd extends Component {
    constructor(props) {
        super(props);
        this.scrollRef = React.createRef();
        this.state = {
            showArrows: false,
        };
    }
    render() {
        const { sellerOtherPd } = this.props
        const { showArrows } = this.state
        return (<>
            {/* 商品區 */}
            <div className="paw-bg-pri-darkbrown py-1">
  <p className="px-3 py-2 ptxtb2">賣家的其他商品</p>

  {/* 改這一層：用 flex 排列箭頭 + 商品 */}
  <div className={`d-flex align-items-center ${styles.main}`}>
    
    {/* 左鍵 */}
    {showArrows && (
      <div className="d-flex justify-content-center align-items-center px-2">
        <i
          className="paw-btn-outline-middlegreen bi bi-caret-left-fill ptxt2"
          onClick={this.leftArrowClick}
          style={{ cursor: 'pointer', fontSize: '24px' }}
        ></i>
      </div>
    )}

    {/* 商品區：這一塊 scrollable */}
    <div
      className="flex-grow-1 overflow-hidden"
      ref={this.scrollRef}
      style={{ scrollBehavior: 'smooth', display: 'flex', flexWrap: 'nowrap' }}
    >
      {sellerOtherPd.map((pd) => (
        <div key={pd.pid} className="card rounded mx-1" style={{ maxWidth:'200px', minWidth: '150px' }}>
          <a href={`/product/${pd.pid}`}>
            <img
              src={pd.images[0]?.img_path}
              className="card-img-top p-2"
              alt="二手商品圖"
            />
          </a>
          <div className="px-3">
            <a href={`/product/${pd.pid}`} className="ptxtb4 d-block">
              {pd.pd_name}
            </a>
            <div className="d-flex justify-content-center">
              <AddToMyFavorite />
              <AddToCartBtn type="icon" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* 右鍵 */}
    {showArrows && (
      <div className="d-flex justify-content-center align-items-center px-2">
        <i
          className="paw-btn-outline-middlegreen bi bi-caret-right-fill ptxt2"
          onClick={this.rightArrowClick}
          style={{ cursor: 'pointer', fontSize: '24px' }}
        ></i>
      </div>
    )}
  </div>
</div>
        </>);
    }
    componentDidMount() {
        this.updateScrollBtn();
        this.scrollRef.current.addEventListener('scroll', this.updateScrollBtn);
        window.addEventListener('resize', this.updateScrollBtn);
    }

    componentWillUnmount() {
        this.scrollRef.current.removeEventListener('scroll', this.updateScrollBtn);
        window.removeEventListener('resize', this.updateScrollBtn);
    }

    updateScrollBtn = () => {
        const container = this.scrollRef.current;
        if (!container) return;
        const { scrollWidth, clientWidth } = container;
        this.setState({ showArrows: scrollWidth > clientWidth + 1 });
    };

    leftArrowClick = () => {
        this.scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    };

    rightArrowClick = () => {
        this.scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
}

export default SellerOtherPd;