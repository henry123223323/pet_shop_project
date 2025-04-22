import React, { Component } from 'react';
class Main_img
 extends Component {
    state = {  } 
    render() { 
        return (
            <div className='w-50'>
                <img src={this.props.source} alt="主視覺" className='w-50 h-auto' />
            </div>
        );
    }
}
 
export default Main_img
;