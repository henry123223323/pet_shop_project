import React, { Component } from 'react';
import PdDescription from './PdDescription'
import PdAttr from './PdAttr'
class PdInfo extends Component {
    state = {  } 
    render() { 
        const {condition, description,images,pdAttr}=this.props
        return (<>
        {/* <h1>二手商品說明頁</h1> */}
        <div className='m-2 px-3 paw-bg-lightenbrown'>
        <PdDescription condition={condition} description={description} images={images}/>
        <PdAttr condition={condition} pdAttr={pdAttr} />
        <br /><br />
        </div>
        </>);
    }
}
 
export default PdInfo;