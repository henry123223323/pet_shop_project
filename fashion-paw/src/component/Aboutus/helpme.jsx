// HelpMe.jsx
import React, { Component } from 'react';
import style from './aboutus.module.css';
import birdwatchyou from './image/birdwatchyou.png';
import dogcatcar from './image/dogcatcar.png';
import kusa from './image/kusa.png';
import cutebird from './image/cutebird.png';
import doginkusa from './image/doginkusa.png';
import catinkusasa from './image/catinkusasa.png';
//  外部CSS檔

class HelpMe extends Component {
    constructor(props) {
        super(props);
        this.movepanRef = React.createRef();
        this.oneboxRef = React.createRef();
        this.twoboxRef = React.createRef();
        this.threeboxRef = React.createRef();
        this.fourboxRef = React.createRef();
        this.kusa1Ref = React.createRef();
        this.kusa2Ref = React.createRef();
        this.kusa3Ref = React.createRef();
        this.kusa4Ref = React.createRef();
        this.state = {
            articles: [
                {
                    id: "123",
                    title: "如何選擇適合的寵物陪伴你生活",
                    content: `
            選擇一隻合適的寵物來陪伴自己，對於很多人來說是一件既開心又需要謹慎思考的事。
            不同的寵物有不同的需求和性格，因此，了解自己生活方式與寵物需求的匹配度是非常重要的。
首先，了解你的居住環境和日常時間安排。如果你住在都市的公寓中，或許養一隻體型較小、對活動需求不高的寵物會比較適合。
像是貓咪、迷你犬等，它們不需要太多的空間，且能夠自我娛樂，較適合較忙碌或居住空間有限的人。
如果你有更多的時間和空間照顧寵物，可以選擇較大型的狗狗，像是黃金獵犬、拉布拉多等，它們需要較多的運動和互動。
接著，考量自己的時間和照顧能力。

某些寵物，如狗狗，尤其是活潑型的狗，需要更多的關注、訓練和每天的運動，而一些小動物則不需要那麼多的時間投入。
若你是忙碌的上班族或學生，貓咪或者兔子等小型寵物，可能會是較好的選擇。它們的需求較少，也能在你不在家的時候自我照顧。
另外，照顧寵物還需要考慮其食物、醫療保健等長期支出。有些品種的寵物對於飲食和醫療保健的需求較高，這也需要提前了解和規劃。
比如某些犬種可能會有特定的食物過敏或健康問題，需要額外的醫療照顧。
最後，選擇寵物時，也要思考自己與寵物之間的互動關係。

有些寵物像貓咪較為獨立，而有些則需要更多的陪伴和關注。了解自己對寵物的期望，以及你希望與它建立的關係，將有助於你做出正確的選擇。

總結來說，選擇一隻適合的寵物不僅是根據外型和可愛程度，而是要考慮到它的性格、需求與你的生活型態是否相符。當你找到那隻最合適的伴侶，它將會是你生活中的一部分，給你帶來無數的快樂與回憶。
          `
                },
                {
                    id: "456",
                    title: "如何正確照顧你的小型寵物",
                    content: `
            小型寵物，像是兔子、倉鼠、鳥類等，因其體型小巧、可愛、且易於照顧，成為許多人選擇的理想伴侶。
            然而，雖然這些小型寵物需要的照顧相對較少，但仍然有一些關鍵細節需要注意，才能確保它們健康快樂地生活。

首先，最基本的是為你的寵物提供一個舒適且安全的生活環境。小型寵物需要一個適合它們體型的籠子或住處。
對於兔子和倉鼠，籠子必須足夠大，讓它們可以自由活動和跳躍。
同時，保持住處的清潔非常重要，定期清理糞便和更換床墊，以防止細菌滋生，保證寵物的健康。

其次，為小型寵物提供均衡的飲食也是非常重要的。兔子和倉鼠需要特定的飼料和新鮮蔬菜來維持其健康。
而鳥類則需提供高品質的鳥食，並補充水果和蔬菜。餵食時間應該定時，並且確保食物不過期，避免對寵物造成消化問題。
此外，定期更換飲水並確保水源乾淨也是必須的。

運動和娛樂也是照顧小型寵物不可忽視的一環。
兔子和倉鼠需要適量的運動來保持健康，尤其是倉鼠需要輪子等設施來幫助它們保持活力。
鳥類則可以透過飛行、玩具或與主人互動來發洩多餘的精力。給予這些小型寵物足夠的運動機會，有助於防止肥胖和減少壓力。

另外，照顧小型寵物的健康狀況也非常關鍵。定期檢查它們的體重、毛發、眼睛和牙齒等，確保沒有疾病的徵兆。
尤其是兔子的牙齒，如果過長可能會引起進食困難或其他健康問題，這時需要尋求獸醫幫助。

最後，與小型寵物建立良好的關係也能提高它們的生活質量。
雖然這些寵物不需要像狗狗一樣進行大量的互動，但與它們進行日常的輕柔接觸、給予它們愛撫和關注，可以讓它們感到安全和受到重視。

總結來說，照顧小型寵物雖然比較簡單，但仍然需要注意環境清潔、飲食均衡、運動和健康檢查等方面的細節。
只要給予它們適當的照顧和關愛，它們將成為你生活中的快樂源泉。
          `
                },
                {
                    id: "789",
                    title: "如何為寵物創造安全的居住環境",
                    content: `
            每個寵物都應該擁有一個安全、舒適的生活空間，這樣才能保持健康並感到快樂。
            無論你養的是狗狗、貓咪、還是其他小型寵物，創建一個適合它們的居住環境都是非常重要的。
            這不僅能提高它們的生活質量，還能預防潛在的健康問題。接下來，讓我們一起來了解如何為寵物創造一個安全的家。

首先，為寵物提供一個適合它們需求的居住空間是至關重要的。
對於狗狗來說，確保它們有足夠的活動空間，可以在家裡自由走動或者舒適地休息。
為了避免受傷或物品損壞，可以設置一些障礙物或圍欄來限制它們活動的區域。
對於貓咪來說，則需要設置一個安靜的角落，讓它們有地方可以休息和隱藏。
而小型寵物如兔子和倉鼠則需要一個清潔的籠子或圍欄，並提供足夠的空間讓它們進行日常活動。

接下來，環境的清潔對於寵物的健康至關重要。
定期清潔它們的住處，尤其是寵物的床墊、食物碗和水瓶，這樣可以有效防止細菌和異味的滋生。
狗狗的床墊應該每週清洗一次，而貓咪的貓砂盆則要保持清潔，每天清理一次是最基本的要求。
倉鼠和兔子的籠子也需要定期更換墊料，保持環境的乾燥和清潔。

此外，保護寵物免受危險物品的影響也是創造安全環境的一部分。
很多家裡的家具或電器可能對寵物構成潛在危險。例如，插座或電線如果放置不當，可能會成為寵物咬到的對象。
為了避免這種情況，可以考慮使用電線保護套或將電線收起來。對於那些容易吞噬的小物件，也應該確保它們不會被寵物拿到。
選擇適合寵物的家居用品，避免有毒植物或危險物品出現在它們的活動範圍內。

對於愛探索的狗狗或貓咪來說，窗戶和陽台也是一個隱患。確保窗戶和陽台都有良好的防護設施，避免它們跳出去或者跌落。
尤其是在高樓層居住的家庭，要特別注意窗戶的防護措施。

還有一點很重要，就是提供一個安靜的地方讓寵物休息。
寵物需要一個屬於它們的空間，這樣它們可以在感到緊張或疲倦時找到一個舒適的地方放鬆。
對於多寵物家庭，尤其是當有新的寵物進入家庭時，要給每個寵物都提供屬於自己的地方，避免發生爭執。

最後，定期帶寵物去做健康檢查，並為它們創造一個安靜、無壓力的環境，這對於它們的身心健康非常重要。
與寵物建立穩定的日常生活規律，不僅能幫助它們適應家庭環境，還能提升它們的生活質量。

總結來說，創建一個安全、舒適的居住環境，對於寵物的健康和幸福非常關鍵。
只要你花心思設計並定期照顧，這個環境將成為它們生活中的庇護所，讓它們在家中感到安心與快樂。
          `
                },
                {
                    id: "101",
                    title: "如何照顧老年寵物的健康",
                    content: `
            隨著年齡的增長，寵物的健康需求會逐漸改變。
            老年寵物的照顧不僅包括日常的飲食和活動，還需要更多關注牠們的身體狀況。
            如何為老年寵物提供適當的照顧，讓牠們安享晚年，是每位主人需要面對的挑戰。
            以下是一些實用的建議，幫助你照顧老年寵物的健康。

首先，老年寵物的飲食需求會有所不同。隨著年齡增長，牠們的代謝速度減慢，可能不再像年輕時一樣需要大量的食物。
因此，調整飲食結構，選擇適合老年寵物的飼料，成為非常重要的一步。
老年寵物的飼料通常會含有更少的熱量，但會加入更多有助於關節和消化的成分，像是葡萄糖胺和軟骨素，這對牠們的關節健康十分有益。
同時，控制食量，避免過度肥胖，也是保障老年寵物健康的關鍵。

其次，老年寵物的活動量通常會比年輕時少很多，但這並不代表它們不需要運動。
定期的輕度運動有助於維持體重、促進血液循環、增強肌肉力量，並保持關節靈活性。
可以選擇短時間的散步，或是與牠們玩簡單的遊戲，這樣不僅能提高牠們的活動量，還能讓牠們保持愉快的心情。
在運動時，注意觀察寵物的反應，避免過度劇烈的運動，尤其是對於有關節炎或心臟病等健康問題的寵物來說。

對於老年寵物，健康檢查變得尤為重要。
隨著年齡的增長，寵物的免疫力下降，容易患上一些常見的老年疾病，如關節病、牙齒問題、心臟病、腎臟病等。
定期的獸醫檢查可以幫助及早發現潛在的健康問題，並對症治療。
尤其是對於狗狗和貓咪，牙齒的保健至關重要，因為口腔問題不僅會引起不適，還可能影響整體健康。
定期給寵物刷牙，並安排獸醫檢查牙齒，這對於老年寵物非常必要。

另外，老年寵物的睡眠質量也需要特別關注。隨著年齡增長，牠們可能會出現睡眠障礙，這可能與疼痛、焦慮或其他健康問題有關。
為寵物提供一個安靜、舒適的睡眠環境，並確保牠們有一個柔軟且支持的床墊，可以幫助牠們改善睡眠質量。
若發現寵物有長期不安、頻繁醒來等現象，建議及時帶牠們去獸醫處檢查。

最後，對於老年寵物，關懷和陪伴是非常重要的。
隨著年齡增長，牠們的視力、聽力可能會逐漸衰退，這時，牠們會需要更多的情感支持。
多陪伴牠們，與牠們進行輕柔的互動，有助於緩解寵物的焦慮情緒，並增進主人和寵物之間的感情。
特別是在牠們的晚年，保持穩定的生活規律，並提供充足的愛與關心，能讓牠們感到更加舒適和安心。

總結來說，老年寵物需要更多的關心與照顧。
提供均衡的飲食、適當的運動、定期的健康檢查和良好的生活環境，可以有效延長寵物的健康壽命，讓牠們在安詳的環境中度過晚年。
每一位愛寵物的主人，都應該盡最大的努力，給予牠們最好的照顧，讓牠們感到被珍惜和愛護。
          `
                }
            ]
        }
    }

    componentDidMount() {
        setTimeout(() => {
            // 使用 setTimeout 保證 DOM 元素完全渲染後再檢查滾動條
            this.scrollInterval = setInterval(() => {
                if (window.scrollY >= 250) {
                    if (this.movepanRef.current) {
                        this.movepanRef.current.classList.add(style["moveing"]);
                        this.startIntervals();
                    }
                }
            }, 200); // 每0.2秒檢查一次滾動條
        }, 0); // 讓它在下一個事件循環執行
    }

    componentWillUnmount() {
        this.clearIntervals();
    }

    startIntervals = () => {
        this.intervalId = setInterval(() => {
            const movepan = this.movepanRef.current;
            const onebox = this.oneboxRef.current;
            const kusa1 = this.kusa1Ref.current;
            if (movepan && onebox && kusa1 && movepan.offsetLeft > onebox.offsetLeft) {
                if (onebox.style.visibility !== "visible") {
                    onebox.style.visibility = "visible";
                    onebox.classList.add(style["dancebox"]);
                    kusa1.classList.add(style["bush-disappear"]);
                } else {
                    clearInterval(this.intervalId);
                }
            }
        }, 200);

        this.intervalId2 = setInterval(() => {
            const movepan = this.movepanRef.current;
            const twobox = this.twoboxRef.current;
            const kusa2 = this.kusa2Ref.current;
            if (movepan && twobox && kusa2 && movepan.offsetLeft > twobox.offsetLeft) {
                if (twobox.style.visibility !== "visible") {
                    twobox.style.visibility = "visible";
                    twobox.classList.add(style["dancebox"]);
                    kusa2.classList.add(style["bush-disappear"]);
                } else {
                    clearInterval(this.intervalId2);
                }
            }
        }, 200);

        this.intervalId3 = setInterval(() => {
            const movepan = this.movepanRef.current;
            const threebox = this.threeboxRef.current;
            const kusa3 = this.kusa3Ref.current;
            if (movepan && threebox && kusa3 && movepan.offsetLeft > threebox.offsetLeft) {
                if (threebox.style.visibility !== "visible") {
                    threebox.style.visibility = "visible";
                    threebox.classList.add(style["dancebox"]);
                    kusa3.classList.add(style["dogruning"]);
                } else {
                    clearInterval(this.intervalId3);
                }
            }
        }, 200);

        this.intervalId4 = setInterval(() => {
            const movepan = this.movepanRef.current;
            const fourbox = this.fourboxRef.current;
            const kusa4 = this.kusa4Ref.current;
            if (movepan && fourbox && kusa4 && movepan.offsetLeft > fourbox.offsetLeft) {
                if (fourbox.style.visibility !== "visible") {
                    fourbox.style.visibility = "visible";
                    fourbox.classList.add(style["dancebox"]);
                    kusa4.classList.add(style["fade-up"]);
                } else {
                    clearInterval(this.intervalId4);
                }
            }
        }, 200);
    };

    clearIntervals = () => {
        clearInterval(this.intervalId);
        clearInterval(this.intervalId2);
        clearInterval(this.intervalId3);
        clearInterval(this.intervalId4);
    };

    render() {
        return (
            <>
                {/* 背景圖 */}
                <img
                    src={birdwatchyou}
                    alt="background"
                    style={{ width: "100%", height: "800px", zIndex: "-1", position: "absolute", top: "calc(40%)" }}
                />

                {/* 車 */}
                <img
                    src={dogcatcar}
                    className={style.moveimg}
                    id="movepan"
                    ref={this.movepanRef}
                    style={{ width: "200px", height: "200px" }}
                    alt="movepan"
                />

                {/* 草叢 */}
                <img
                    src={kusa}
                    className={style.kusa}
                    id={style.kusa1}
                    ref={this.kusa1Ref}
                    style={{ visibility: "visible", border: "none" }}
                    alt="kusa1"
                />
                <img
                    src={cutebird}
                    className={style.kusa}
                    id={style.kusa2}
                    ref={this.kusa2Ref}
                    alt="kusa2"
                />
                <img
                    src={doginkusa}
                    className={style.kusa}
                    id={style.kusa3}
                    ref={this.kusa3Ref}
                    alt="kusa3"
                />
                <img
                    src={catinkusasa}
                    className={style.kusa}
                    id={style.kusa4}
                    ref={this.kusa4Ref}
                    alt="kusa4"
                />

                {/* 四個box */}
                <a href="#123" className={style.aboutusdera}>
                    <div className={style.first_box} id="onebox" ref={this.oneboxRef}>
                        <h4>如何選擇適合的寵物陪伴你生活</h4> <hr />
                        <span>根據生活型態選擇合適的寵物，增添更多歡樂。</span>
                    </div>
                </a>

                <a href="#456" className={style.aboutusdera}>
                    <div className={style.two_box} id="twobox" ref={this.twoboxRef}>
                        <h4>如何正確照顧你的小型寵物</h4> <hr />
                        <span>正確的照顧方式讓小型寵物快樂健康地成長，提升生活品質。</span>
                    </div>
                </a>

                <a href="#789" className={style.aboutusdera}>
                    <div className={style.three_box} id="threebox" ref={this.threeboxRef}>
                        <h4>如何為寵物創造安全的居住環境</h4> <hr />
                        <span>為寵物創建一個安全舒適的家，讓它們生活得更健康快樂。</span>
                    </div>
                </a>

                <a href="#101" className={style.aboutusdera}>
                    <div className={style.four_box} id="fourbox" ref={this.fourboxRef}>
                        <h4>如何照顧老年寵物的健康</h4> <hr />
                        <span>老年寵物需要特別的關懷，照顧它們的健康，讓牠們安享晚年。</span>
                    </div>
                </a>


                {this.state.articles.map((article, index) => (
                    <div
                        key={article.id}
                        style={{
                            textAlign: "center",
                            marginTop: index === 0 ? "900px" : "0px"  // 第一篇文章才加 marginTop
                        }}
                    >
                        <h1 id={article.id}>{article.title}</h1>
                        <p>
                            {article.content.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </p>
                        <hr />
                    </div>
                ))}
            </>
        );
    }
}

export default HelpMe;
