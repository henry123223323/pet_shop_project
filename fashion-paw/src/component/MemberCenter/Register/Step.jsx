import React, { Component } from 'react';

class Step extends Component {
    // 註冊上面的步驟圈圈
    render() {
        const stylelist = {
            height: '100px',
            width: '100px',
            borderRadius: '50%',
            backgroundColor: this.props.statement ? 'blue' : 'white'
        };

        return (
            <div className="col-4">
                <div
                    className="step border mx-auto d-flex justify-content-center align-items-center"
                    style={stylelist}
                >
                    {this.props.number}
                </div>
                <div className="text-center">
                    {this.props.content}
                </div>
            </div>
        );
    }
}

export default Step;
