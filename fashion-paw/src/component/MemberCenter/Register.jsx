import React, { Component } from 'react';
import MainImg from './Login/Main_img';
import RegisterCompute from './Register/Register_Compute';
class Register extends Component {
    state = {  } 
    render() { 
        return (
            <div className="row paw-bg-primary">
                {/* MainImg source是圖片連結 className是包覆著img的div的class */}
                <MainImg source="/cat.jpg" className="d-none d-md-block col-md-6" />
            {/* RegisterCompute為三步驟表單的所有內容  */}
            <RegisterCompute />
        </div>
        );
    }
}
 
export default Register;