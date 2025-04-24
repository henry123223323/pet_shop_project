import React, { useState } from 'react';
import TouchDog from "../images/TouchDogv2.png"
import TouchCat from "../images/TouchCat.png"
import TouchHamster from "../images/TouchHamsterv2.png"
import TouchBird from "../images/TouchBirdv2.png"

function Touch() {

    const swiPet = [
        {
            name: "狗狗",
            img: TouchDog,
            hotspots: [
                { label: '耳朵', x: 160, y: 30, width: 30, height: 50 },
                { label: '鼻子', x: 100, y: 50, width: 20, height: 20 },
                { label: '尾巴', x: 80, y: 200, width: 30, height: 30 }
            ]
        },
        { name: "貓咪", img: TouchCat },
        { name: "倉鼠", img: TouchHamster },
        { name: "鳥", img: TouchBird }
    ]

    // 確認圖片在index的第幾個
    const [currentIndex, setCurrentIndex] = useState(0);
    const [tooltip, setTooltip] = useState(null);
    // 下一張圖片
    const nextPet = () => {
        setCurrentIndex((currentIndex + 1) % swiPet.length);
        setTooltip(null);
    };
    // 上一張圖片
    const prevPet = () => {
        setCurrentIndex((currentIndex - 1 + swiPet.length) % swiPet.length);
        setTooltip(null);
    };

    // const petSwitchBtn = () => {
    //     alert("切換寵物(狗貓鼠鳥)")
    // }

    const handleImageClick = (e) => {

        const rect = e.target.getBoundingClientRect();
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);
        const { hotspots } = touchPet;
        const hit = hotspots.find(h =>
            x >= h.x && x <= h.x + h.width &&
            y >= h.y && y <= h.y + h.height
        );

        if (hit) {
            // alert(`${hit.label} 被點擊了！座標：(${x}, ${y})`);
            setTooltip({ label: hit.label });
        } else {
            setTooltip(null);
        }
    }

    const touchPet = swiPet[currentIndex]

    return (
        <div className="container-xl">
            <h3 className="paw-hover-primary text-center" style={{ width: 200 }}>這是標題</h3>
            {/* 切換寵物按鈕 */}
            <label htmlFor="change">{touchPet.name}</label>
            {/* <button id="change" onClick={petSwitchBtn}>▶️</button> */}
            <div className="flex justify-center gap-2 mb-4">
                <button onClick={prevPet} className="px-3 py-1 bg-gray-200 rounded">上一隻</button>
                <button onClick={nextPet} className="px-3 py-1 bg-gray-200 rounded">下一隻</button>
            </div>

            {/* 點擊部位觸發訊息並連動說明區塊 */}
            <div style={{ width: 300, height: 300, overflow: 'hidden', margin: '0 auto', backgroundColor: "pink" }}>
                <img
                    src={touchPet.img}
                    alt={touchPet.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: "point" }}
                    onClick={handleImageClick}
                />
                {/* 如果有 tooltip，就在圖片上顯示浮動提示 */}
                {/* {tooltip && (
                    <div
                        style={{
                            position: 'absolute',
                            left: tooltip.x,
                            top: tooltip.y,
                            transform: 'translate(-50%, -120%)',
                            backgroundColor: 'rgba(0,0,0,0.75)',
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: 4,
                            pointerEvents: 'none',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {tooltip.label}
                    </div>
                )} */}
            </div>

            {/* <div style={{ backgroundColor: "black", width: 300 }}>
                <img src={TouchDog} alt="點擊寵物部位圖" onClick={petSwitchBtn} style={{ width: '100%', width: '100%', objectFit: 'cover' }} />
            </div> */}

            {/* 觸碰後說明區塊 */}
            {tooltip && (
                <div>
                    <h3 className="paw-hover-primary text-center" >{tooltip.label}</h3>
                    <hr />
                    <h6>123</h6>
                    <p>qqqqqqqqqq</p>
                    <h6>123</h6>
                    <p>qqqqqqqqqq</p>
                </div>
            )}
        </div>

    )
}

export default Touch;