import React, { Component } from 'react';
import PdDescription from './PdDescription'
import PdAttr from './PdAttr'
class PdInfo extends Component {
    state = {  } 
    render() { 
        return (<>
        {/* <h1>二手商品說明頁</h1> */}
        <div className='m-2 px-3 paw-bg-lightenbrown'>
        <PdDescription />
        <PdAttr />
        <br /><br />
        </div>
        </>);
    }
}
 
export default PdInfo;