// 這是購物車跟結帳頁面的確認按鈕

import React, { Component } from 'react';
class ConfirmBtn extends Component {
    render() {
        const {onClick, type} =this.props
        return (<>
            <div className='px-4 my-2'>
            <div className="btn paw-btn-lightorangepink w-100" onClick={onClick}>
                {type === "toPayPage" ? "前往結帳":"確認付款"}
            </div>
            </div>
        </>);
    }
}

export default ConfirmBtn;