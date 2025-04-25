import React, { useState } from 'react';
import TouchDog from "../images/TouchDogv2.png"
import TouchCat from "../images/TouchCat.png"
import TouchHamster from "../images/TouchHamsterv2.png"
import TouchBird from "../images/TouchBirdv2.png"




// 描述元件:根據props顯示部位標題和說明內容
function PartDescription({ label, title, title2, description, description2 }) {
    return (
        <div>
            <h3 className='paw-bg-primary'>{label}</h3>
            <h6>{title}</h6>
            <p>{description}</p>
            <h6>{title2}</h6>
            <p>{description2}</p>
        </div>
    )
}


function Touch() {
    const swiPet = [
        {
            name: "狗狗",
            img: TouchDog,
            hotspots: [
                {
                    label: '耳朵', x: 160, y: 30, width: 30, height: 50,
                    title: '狗狗耳朵為什麼容易生病?',
                    description: '狗狗的耳道是L型的結構，東西一旦進入就很容易堆積，堆積的耳屎、髒污灰塵若沒清理，再加上洗澡、緩解殘留的水氣，就容易讓細菌滋生，並可能感染發炎。',
                    title2: '常見的狗狗耳朵疾病、狀況',
                    description2: '1. 潮濕造成黴菌、真菌感染（有異味、最常見）2. 過敏引起發炎（無異味）3. 寄生蟲感染（有異味、大量分泌物）'
                },

                {
                    label: '鼻子', x: 100, y: 50, width: 20, height: 20,
                    title: '呼吸道疾病',
                    description: '常見症狀: 流鼻水、鼻塞、打噴嚏、鼻子癢，這些症狀有可能是鼻炎、鼻竇炎、支氣管肺炎、犬瘟熱...等等。',
                    title2: '有可能的原因',
                    description2: '1. 感冒 2. 細菌感染 3. 灰塵或塵蟎'
                },
                {
                    label: '眼睛', x: 110, y: 30, width: 40, height: 20,
                    title: '狗狗眼睛容易有什麼疾病?',
                    description: '白內障、青光眼、結膜炎、乾眼症、角膜潰傷、視網膜退化',
                    title2: '出現這些徵兆要注意!',
                    description2: '觀察狗狗眼睛顏色，顏色呈灰白色或者紅色時，建議帶狗狗就醫給醫生檢查。除了觀察眼睛顏色，還可以觀察是否有異常的行為，如畏光、眼白佈滿血絲、眼睛睜不開...等等。'
                },
                {
                    label: '皮膚', x: 110, y: 100, width: 80, height: 100,
                    title: '常見皮膚問題',
                    description: '1. 細菌及黴菌感染 2. 異位性皮膚炎 3. 指間炎 4. 濕疹 5. 毛囊炎 6. 免疫性皮膚疾病（如紅斑性狼瘡） ',
                    title2: '有這些症狀需留意',
                    description2: '如果出現皮膚紅腫癢一直去搔抓、掉毛、出現異味、皮屑增加...等，頻率越來越高，甚至抓破皮，建議趕快帶狗狗去看醫生唷!'
                }
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
    const touchPet = swiPet[currentIndex]
    // 點擊圖片部位事件
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
            setTooltip({
                label: hit.label,
                title: hit.title, description: hit.description,
                title2: hit.title2, description2: hit.description2,
                x: hit.x + hit.width / 2, y: hit.y
            });
        } else {
            setTooltip(null);
        }
    }



    return (
        <div className="container-xl">
            <h3 className="paw-hover-primary text-center" style={{ width: 200 }}>這是標題</h3>
            {/* 切換寵物按鈕 */}
            <p className='ptxt5 paw-text-darkgreen'>我是測試文字</p>
            <label htmlFor="change">{touchPet.name}</label>
            {/* <button id="change" onClick={petSwitchBtn}>▶️</button> */}
            <div className="flex justify-center gap-2 mb-4">
                <button onClick={prevPet} className="px-3 py-1 btn paw-btn-outline-lightorangepink rounded">上一隻</button>
                <button onClick={nextPet} className="px-3 py-1 btn paw-btn-outline-darkorange rounded">下一隻</button>
            </div>

            {/* 點擊部位觸發訊息並連動說明區塊 */}
            <div style={{ position: 'relative', width: 300, height: 300, overflow: 'hidden', margin: '0 auto', backgroundColor: "pink" }}>
                <img
                    src={touchPet.img}
                    alt={touchPet.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: "pointer" }}
                    onClick={handleImageClick}
                />
                {/* 如果有 tooltip，就在圖片上顯示浮動提示 */}
                {tooltip && (
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
                )}
            </div>

            {/* <div style={{ backgroundColor: "black", width: 300 }}>
                <img src={TouchDog} alt="點擊寵物部位圖" onClick={petSwitchBtn} style={{ width: '100%', width: '100%', objectFit: 'cover' }} />
            </div> */}

            {/* 觸碰後說明區塊 */}
            {tooltip && <PartDescription label={tooltip.label}
                title={tooltip.title} description={tooltip.description}
                title2={tooltip.title2} description2={tooltip.description2} />}
        </div>

    )
}

export default Touch;