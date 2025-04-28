import React, { Component} from 'react';

class PdQuantity extends Component {
    render() { 
        return (
        <>
            {/* <h1>加入購物車</h1> */}
            <div className='d-flex align-items-center my-3'>
                {/* 減少按鈕 */}
                <button 
                className='mx-2 rounded  paw-btn-outline-pri-darkbrown'
                onClick={this.quantityDown}>
                    <i className="bi bi-caret-down-fill"></i>
                </button>
                {/* 數量格子 */}
                <div 
                style={{
                    width: 60 ,
                  }}>
                    <input className='w-100 text-center' type="text" value={this.props.quantity} 
                    onChange={this.inputChange}/>
                </div>
                {/* 增加按鈕 */}
                <button 
                className='mx-2 rounded paw-btn-outline-pri-darkbrown'
                onClick={this.quantityUp}>
                    <i className="bi bi-caret-up-fill"></i> 
                </button>  
            </div>
        </>
        );
    }
    inputChange = (e)=>{
        const value = e.target.value
        if ( value === "" ){
            this.props.onQuantityChange("")
        }else{
            const number = parseInt(value)
            if ( !isNaN(number) && number >= 1 ){
                this.props.onQuantityChange(number)
            }
        }
    }
    quantityDown = () => {
        // alert("Down")
        const { quantity, onQuantityChange } = this.props;
        if (quantity > 1) {
          onQuantityChange(quantity - 1);
        }
    }
    quantityUp = () => {
        // alert("Up")
        const { quantity, onQuantityChange } = this.props;
    onQuantityChange(quantity + 1);
    // if (quantity < stock) { 
    //     onQuantityChange(quantity + 1);
    //   }
    }
}
 
export default PdQuantity;