import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import TouchDog from "../images/TouchDogv2.png"
import TouchCat from "../images/TouchCat.png"
import TouchHamster from "../images/TouchHamsterv2.png"
import TouchBird from "../images/TouchBirdv2.png"
import PartDescription from "./PartDescription.json"




// 描述元件:根據props顯示部位標題和說明內容
function PartData({ label, paragraph }) {
    return (
        <>
            <h3 className='paw-bg-lightorange'>{label}</h3>
            <div className='prose whitespace-pre-line'>
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                    {paragraph}
                </ReactMarkdown>
            </div>
        </>
    )
}

// 宣告imageMap物件，抓json裡面的img放到jsx宣告的變數裡
const imageMap = {
    'TouchDogv2.png': TouchDog,
    'TouchCat.png': TouchCat,
    'TouchHamsterv2.png': TouchHamster,
    'TouchBirdv2.png': TouchBird,
};

// 建立函式Touch，裡面寫回調函數
function Touch() {
    // 使用hook宣告一個狀態，陣列第一個元素是目前的狀態值，第二個元素是用來更新該狀態的函式
    // 確認圖片在index的第幾個
    const [currentIndex, setCurrentIndex] = useState(0);
    // hook宣告並管理一個「可變的資料」，就是所謂的state
    // 建立一個 state，它的初始值是 null。第一個變數 tooltip：用來讀取目前這個 state 的值，
    // 第二個函式 setTooltip：用來更新這個 state。呼叫時傳入新值，React 就會重新渲染（re-render）這個元件
    // tooltip 存的就是「目前點擊到哪個部位」的資訊（例如 Label、說明文字和要顯示的位置）
    // 當 tooltip 是 null：代表目前沒有任何部位被選中，所以畫面上不會顯示提示框，也不會渲染下方的說明區塊
    // 當呼叫 setTooltip(...)，並傳入像 { label: '耳朵', description: 'XXX', x: 120, y: 50 } 這樣的物件後，
    // tooltip 就會變成那個物件，React 立即把它帶到畫面上，顯示對應的浮動提示和部位說明
    const [tooltip, setTooltip] = useState(null);
    // 新增一個 state 追蹤目前懸停的圖片熱區索引
    const [hoveredHotspot, setHoveredHotspot] = useState(null);
    // 呼叫setCurrentIndex()更新函式，呼叫這個 state 更新函式，把新的索引存回 state，React 就會依照這個新值重新渲染，
    // 圖片跟部位資訊就會換成下一隻寵物。
    // currentIndex+1先把目前的索引值加 1，代表要往後移一隻。
    // % PartDescription.length => 對寵物清單的長度取餘數（modulo），確保當索引加到最後一個以後，
    // 再按「下一隻」會回到 0，實現 循環輪播。
    // 下一張圖片
    const nextPet = () => {
        setCurrentIndex((currentIndex + 1) % PartDescription.length);
        // 每次切換寵物前，都把 tooltip（也就是「哪個部位被點擊」的 state）設為 null，
        // 避免上一隻寵物的提示框或說明遺留到下一隻上。
        setTooltip(null);
    };
    // 上一張圖片
    const prevPet = () => {
        setCurrentIndex((currentIndex - 1 + PartDescription.length) % PartDescription.length);
        setTooltip(null);
    };

    // PartDescription 這個變數（從你的 JSON 檔案匯入）本質上是一個陣列，裡面每個元素都代表一隻寵物的設定
    // （名稱、圖片路徑、各部位的熱區資料、描述文字等）
    // currentIndex 則是一個 state，記錄目前在看陣列中第幾筆資料（哪一隻寵物）
    // 就是「從這個寵物設定的陣列裡，根據 currentIndex 取出對應的那一隻寵物物件」，並把它存到 touchPet 這個常數
    const touchPet = PartDescription[currentIndex]
    // 根據目前選中的寵物，動態取得對應的打包後圖片 URL。
    // 這是 JavaScript 的「Bracket Notation（中括號存取屬性）」用法，等同於imageMap['TouchDogv2.png']
    const imgModule = imageMap[touchPet.img];

    // 點擊圖片部位事件處理函式
    const handleImageClick = (e) => {
        // 取得點擊位置相對圖片的座標，getBoundingClientRect() 拿到 <img> 在畫面上的位置及大小
        const rect = e.target.getBoundingClientRect();
        // e.clientX/Y 是游標相對瀏覽器視窗左上角的座標，兩者相減後，就得到游標「落在圖片上」的相對座標 (x, y)
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);
        // 找出被點擊到的熱區
        // touchPet.hotspots 是一個陣列，裡面每個物件 h 都有 x, y, width, height，代表一個可點擊的區塊範圍
        const { hotspots } = touchPet;
        // find 會找出第一個符合「點擊座標在這個區塊內」的熱區，若找不到就回傳 undefined
        const hit = hotspots.find(h =>
            x >= h.x && x <= h.x + h.width &&
            y >= h.y && y <= h.y + h.height
        );
        // 更新提示框的 state
        if (hit) {
            // alert(`${hit.label} 被點擊了！座標：(${x}, ${y})`);
            setTooltip({
                label: hit.label,
                paragraph: hit.paragraph,
                x: hit.x + hit.width / 2, y: hit.y
            });
        } else {
            setTooltip(null);
        }
    }


    // 網頁框架，放便回調函式的變數們
    return (
        <div className="container-xl">
            {/* 標題 */}
            <h3 className=" border paw-bg-pri-darkbrown text-center rounded" style={{ width: 200 }}>這是標題</h3>

            {/* 切換寵物按鈕 */}
            <label htmlFor="change">{touchPet.name}</label>
            <div className="flex justify-center gap-2 mb-4">
                <button onClick={prevPet} className="px-3 py-1 btn paw-btn-outline-lightorangepink rounded">上一隻</button>
                <button onClick={nextPet} className="px-3 py-1 btn paw-btn-outline-darkorange rounded">下一隻</button>
            </div>
            <p className="text-center text-sm text-gray-600 mb-2">
                👉 將滑鼠移到寵物身上想點擊的部位，懸停後框線會出現，再點擊查看說明
            </p>


            {/* 點擊部位觸發訊息框並連動說明區塊 */}
            <div style={
                {
                    position: 'relative', width: 400, height: 300,
                    overflow: 'visable', zIndex: 999, margin: '0 auto'
                }}
            >
                {/* 1. 圖片點擊區 */}
                <img
                    src={imgModule}
                    alt={touchPet.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onClick={handleImageClick}
                />

                {/* 2. map 出所有熱區，繪製紅框、設定 onClick---看熱點除錯區域 */}
                {touchPet.hotspots.map((h, i) => (
                    <div
                        key={`${currentIndex}-${i}`}
                        onMouseEnter={() => setHoveredHotspot(i)}
                        onMouseLeave={() => setHoveredHotspot(null)}

                        onClick={() => {
                            setTooltip({
                                label: h.label,
                                paragraph: h.paragraph,
                                // 讓 tooltip 跑到正確放置位置
                                x: h.x + h.width / 2,
                                y: h.y
                            });
                        }}

                        style={{
                            position: 'absolute',
                            top: h.y,
                            left: h.x,
                            width: h.width,
                            height: h.height,
                            cursor: 'pointer',
                            // nMouseEnter / onMouseLeave 只在滑鼠懸停時把 hoveredHotspot 設成對應的索引，離開時清掉
                            // border & backgroundColor 會根據 hoveredHotspot === i 動態顯示或隱藏
                            // cursor: 'pointer' 讓游標變手指形
                            // transition 加上淡入淡出動畫
                            border: hoveredHotspot === i
                                ? '1px solid rgba(255,0,0,0.6)'
                                : '1px solid transparent',
                            backgroundColor: hoveredHotspot === i
                                ? 'rgba(255,0,0,0.2)'
                                : 'transparent',
                            transition: 'border-color .2s, background .2s'
                        }}
                    />
                ))}

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

            {/* 2. 觸碰後說明區塊 */}
            {
                tooltip && <PartData label={tooltip.label} paragraph={tooltip.paragraph} />
            }
        </div >

    )
}

export default Touch;