import React, { Component } from 'react';
class CheckList extends Component {
    state = {}
    render() {
        return (<>
            {/* <h3>結帳確認區</h3> */}
            <div className='px-4'>
                <div className='my-2'>
                    <span>原價總金額：</span> <span>$$</span>
                </div>
                <div className='my-2'>
                    <span >折扣：</span> <span>-$$</span>
                </div>
                <hr />
                <div>
                    <span className='ptxtb3'>結帳金額：</span> <span>$$$</span>
                    <p></p>
                    
                </div>
            </div>
        </>);
    }
    checkOut = () => {
        alert("結帳button")
    }
}

export default CheckList;