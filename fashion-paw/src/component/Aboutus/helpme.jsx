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
                    title: "第一篇文章連結",
                    content: `
            在快節奏的都市生活中，每天早出晚歸似乎成了常態，
            街頭巷尾擠滿了趕路的人群，
            連天空都被高樓大廈切割成小小的方格。
            但如果你放慢腳步，仔細觀察，會發現藏在城市角落的小確幸。
            早晨陽光灑在咖啡館外的小桌上，路邊販賣早餐的阿姨笑容可掬，
            一隻小狗在公園草地上翻滾，或是一片意外飄落在肩上的樹葉。
            這些微小卻真實的溫暖，提醒我們，即使身處水泥叢林，
            生活仍然有著被輕輕撫慰的力量。下次走在街上，不妨收起手機，
            抬頭看看天空，或許你也能遇見屬於自己的小奇蹟。
            在快節奏的都市生活中，每天早出晚歸似乎成了常態，
            街頭巷尾擠滿了趕路的人群，
            連天空都被高樓大廈切割成小小的方格。
            但如果你放慢腳步，仔細觀察，會發現藏在城市角落的小確幸。
            早晨陽光灑在咖啡館外的小桌上，路邊販賣早餐的阿姨笑容可掬，
            一隻小狗在公園草地上翻滾，或是一片意外飄落在肩上的樹葉。
            這些微小卻真實的溫暖，提醒我們，即使身處水泥叢林，
            生活仍然有著被輕輕撫慰的力量。下次走在街上，不妨收起手機，
            抬頭看看天空，或許你也能遇見屬於自己的小奇蹟。
          `
                },
                {
                    id: "456",
                    title: "第二篇標題",
                    content: `
            有人說，只有年輕人才適合做夢。
            但事實上，夢想沒有年齡限制。
            無論是二十歲還是五十歲，只要心中還有渴望，就有追尋的理由。
            小鎮的麵包師傅決定在退休後開設屬於自己的咖啡館，
            從零開始學習拉花技藝；家庭主婦在孩子離巢後重新拿起畫筆，
            舉辦了自己的第一次畫展。或許現實讓我們不得不放慢腳步，
            或暫時將夢想擱置，但夢想從不會真正離開，它只是靜靜等待，
            在某個適合的時刻，重新被點燃。所以啊，不論你現在是誰，
            都不要害怕對未來懷抱希望。
            有人說，只有年輕人才適合做夢。
            但事實上，夢想沒有年齡限制。
            無論是二十歲還是五十歲，只要心中還有渴望，就有追尋的理由。
            小鎮的麵包師傅決定在退休後開設屬於自己的咖啡館，
            從零開始學習拉花技藝；家庭主婦在孩子離巢後重新拿起畫筆，
            舉辦了自己的第一次畫展。或許現實讓我們不得不放慢腳步，
            或暫時將夢想擱置，但夢想從不會真正離開，它只是靜靜等待，
            在某個適合的時刻，重新被點燃。所以啊，不論你現在是誰，
            都不要害怕對未來懷抱希望。
          `
                },
                {
                    id: "789",
                    title: "第三篇標題",
                    content: `
            很多人不喜歡雨天，總覺得濕答答的街道讓心情也變得低落。
            但對我來說，雨天反而是另一種溫柔的展現。雨滴敲打著窗戶的聲音，
            像是老朋友在耳邊輕聲說話；打著傘走在小巷中，看著地面映照著朦朧的燈光，
            彷彿走進了夢境一般。雨天讓人有藉口放慢節奏，
            窩在家裡泡杯熱可可，讀一本久違的書。偶爾望向窗外，
            看著水珠順著玻璃流下，心情也跟著慢慢沉澱。也許生活中，
            需要的不是晴空萬里，而是這種靜靜陪伴你的雨水時光。
            很多人不喜歡雨天，總覺得濕答答的街道讓心情也變得低落。
            但對我來說，雨天反而是另一種溫柔的展現。雨滴敲打著窗戶的聲音，
            像是老朋友在耳邊輕聲說話；打著傘走在小巷中，看著地面映照著朦朧的燈光，
            彷彿走進了夢境一般。雨天讓人有藉口放慢節奏，
            窩在家裡泡杯熱可可，讀一本久違的書。偶爾望向窗外，
            看著水珠順著玻璃流下，心情也跟著慢慢沉澱。也許生活中，
            需要的不是晴空萬里，而是這種靜靜陪伴你的雨水時光。
          `
                },
                {
                    id: "101",
                    title: "第四篇標題",
                    content: `
            家裡有一隻橘貓，名字叫做布丁。
            每天回到家，打開門看到牠慢悠悠地走來蹭蹭腿，那種溫暖的感覺，
            比任何言語都更有力量。布丁沒有高超的技巧，不會翻滾也不會握手，
            但牠用最簡單的方式陪伴著我。早晨是牠叫醒我的，夜晚是牠蜷縮在床邊陪我入睡。
            即使只是靜靜地坐在沙發上，各自做著自己的事情，也會覺得無比安心。養寵物，
            不只是照顧一個生命，更是互相療癒的過程。平凡的一天一天堆疊起來，
            最後成為了生命中最柔軟、最珍貴的回憶。
            \n
            家裡有一隻橘貓，名字叫做布丁。
            每天回到家，打開門看到牠慢悠悠地走來蹭蹭腿，那種溫暖的感覺，
            比任何言語都更有力量。布丁沒有高超的技巧，不會翻滾也不會握手，
            但牠用最簡單的方式陪伴著我。早晨是牠叫醒我的，夜晚是牠蜷縮在床邊陪我入睡。
            即使只是靜靜地坐在沙發上，各自做著自己的事情，也會覺得無比安心。養寵物，
            不只是照顧一個生命，更是互相療癒的過程。平凡的一天一天堆疊起來，
            最後成為了生命中最柔軟、最珍貴的回憶。
          `
                }
            ]
        }
    }

    componentDidMount() {
        this.startIntervals();
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
                    style={{ width: "100%", height: "800px", zIndex: "-1", position: "relative" }}
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
                <a href="#123">
                    <div className={style.first_box} id="onebox" ref={this.oneboxRef}>
                        <p>假字標題</p>
                        <span>你知道狗不能吃巧克力嗎</span>
                    </div>
                </a>

                <a href="#456">
                    <div className={style.two_box} id="twobox" ref={this.twoboxRef}>
                        <p>假字標題</p>
                        <span>你知道狗不能吃巧克力嗎</span>
                    </div>
                </a>

                <a href="#789">
                    <div className={style.three_box} id="threebox" ref={this.threeboxRef}>
                        <p>假字標題</p>
                        <span>你知道狗不能吃巧克力嗎</span>
                    </div>
                </a>

                <a href="#101">
                    <div className={style.four_box} id="fourbox" ref={this.fourboxRef}>
                        <p>假字標題</p>
                        <span>你知道狗不能吃巧克力嗎</span>
                    </div>
                </a>


                {this.state.articles.map(article => (
                    <div key={article.id} style={{ textAlign: "center" }}>
                        <h1 id={article.id}>{article.title}</h1>
                        <p>
                            {article.content.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
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
