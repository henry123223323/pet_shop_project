import React, { Component } from 'react';
import styles from './ShareProductsBtn.module.css';

class ShareProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shareHint: false, //預設不出現
    };
  }

  render() {
    return (
      <>
        {/* <h1>這是分享按鈕</h1> */}
        <div className={styles.share}>
        <button
          className={`btn rounded ptxtb2 ${styles.shareBtn}`}
          onClick={this.shareOthers}
        >
          <i className={`bi bi-share ${styles.shareOriginal}`}></i>
          <i className={`bi bi-share-fill ${styles.shareHover}`}></i>
        </button>

        {/* 複製完成 */}
        {this.state.shareHint && (
          <div className={`rounded ptxt5 p-2 ${styles.toast}`}>
            已複製網址 ✅
          </div>
        )}
        </div>
      </>
    );
  }
  shareOthers = async () => {
    try {
    // 複製網址
      await navigator.clipboard.writeText(window.location.href); 
      this.setState({ shareHint: true });

      setTimeout(() => {
        this.setState({ shareHint: false });
      }, 500);
    } catch (err) {
      console.error('複製失敗', err);
    }
  };
}

export default ShareProducts;