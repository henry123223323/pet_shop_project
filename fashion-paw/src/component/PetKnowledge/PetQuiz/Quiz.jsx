import React, { useState } from 'react';

function Quiz() {
    return (
        <div className="container-xl">
            {/* 標題 */}
            <h3 className=" border paw-bg-pri-darkbrown text-center rounded"
                style={{ width: 200 }}>這是標題</h3>
            <div className='border rounded'>
                <h5>請選擇寵物</h5>
                <p>選擇寵物區</p>
                <button className='btn paw-btn-outline-middleorange'>開始遊戲</button>
            </div>
        </div>
    )
}


export default Quiz;