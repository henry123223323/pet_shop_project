import React from 'react';
function ProductCarousel() {
    return (
        <>
            <div className="banner-carousel">
                新品
                <div className="slide">Banner 1</div>
                <div className="slide">Banner 2</div>
                <div className="slide">Banner 3</div>
            </div>
            <div className="banner-carousel">
                二手
                <div className="slide">Banner 1</div>
                <div className="slide">Banner 2</div>
                <div className="slide">Banner 3</div>
            </div>
        </>
    )
}
export default ProductCarousel;