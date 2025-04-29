import React, { Component } from 'react';

class SellerTitle extends Component {
  render() {
    const { sellerName } = this.props;

    return (
      <div className="mt-3 mb-2">
        <h4>{sellerName} 的賣場</h4>
      </div>
    );
  }
}

export default SellerTitle;