import React, { Component} from 'react';

class PdQuantity extends Component {
    constructor(props) {
        super(props);
        this.state = {
          count: 1
        };
      }
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
                    <input className='w-100 text-center' type="text" value={this.state.count} 
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
            this.setState({count:""})
        }else{
            const number = parseInt(value)
            if ( !isNaN(number) && value >= 1 ){
                this.setState({count:number})
            }
        }
    }
    quantityDown = () => {
        // alert("Down")
        if(this.state.count > 1){
            this.setState({count:this.state.count - 1})

        }
    }
    quantityUp = () => {
        // alert("Up")
        this.setState({count: this.state.count + 1})
    }
}
 
export default PdQuantity;