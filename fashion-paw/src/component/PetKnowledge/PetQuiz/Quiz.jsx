import React, { useState } from 'react';
import Selector from './Selector';
import QuizGame from './QuizGame';
import SelDogImg from '../images/selectdog.png';
import SelCatImg from '../images/selectcat.png';
import SelHamsterImg from '../images/selecthamster.png';
import SelBirdImg from '../images/selectbird.png';
// 用有意義的名稱 import 各種寵物的題庫
import dogQuestions from './DogQuestions.json'
import catQuestions from './CatQuestions.json'
import hamsterQuestions from './HamsterQuestions.json'
import birdQuestions from './BirdQuestions.json'
import titleIcon from '../images/pawicon.svg';
import styles from './Quiz.module.css';

function Quiz() {
    // 可改成你的 JSON 或資料來源
    const pets = ['貓咪', '狗狗', '倉鼠', '鳥'];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [petIndex, setPetIndex] = useState(null);
    // 新增一個 state 來存「打亂後的題目」
    const [gameQuestions, setGameQuestions] = useState([])
    // name → 圖片檔案 的對應
    // 把所有問題集「集中」到一個物件裡，key 可以用你想要的字串
    const petList = [
        { name: '貓咪', img: SelCatImg, questions: catQuestions },
        { name: '狗狗', img: SelDogImg, questions: dogQuestions },
        { name: '倉鼠', img: SelHamsterImg, questions: hamsterQuestions },
        { name: '鳥', img: SelBirdImg, questions: birdQuestions },
    ]

    // // 當子元件切換寵物時會呼叫這裡
    // const handlePetChange = (newIndex) => {
    //     setSelectedIndex(newIndex);
    //     // 你還可以在這邊做更多事情：比如載入該寵物的題庫、圖片、這裡還可以載入題庫、重置分數等等
    // };

    // 按「開始遊戲」的 handler
    const startGame = () => {
        // 1. 先取出使用者選的那組題目
        const list = petList[selectedIndex].questions
        // 2. 複製一份再隨機打亂（不要直接 mutate 原本的 array）
        const shuffled = [...list].sort(() => Math.random() - 0.5)
        // 3. 把打亂後的結果傳給 QuizGame、並把 petIndex 拿出來渲染 QuizGame
        setPetIndex(selectedIndex)
        setGameQuestions(shuffled);
    };

    return (
        <div className={`${styles.quizContainer} container-xl py-5`}>
            {petIndex === null ? (
                // 尚未開始，顯示選擇器 + 開始按鈕
                // Selector.jsx
                <div className={styles.selectorBox}>
                    <h2 className="border paw-bg-pri-darkbrown text-center rounded d-block mx-auto" style={{ width: 200 }}>寵物知多少</h2>
                    <img src={titleIcon} className={styles.titleIcon} alt="icon" />
                    {/* 這就是「請選擇寵物」的區塊、呼叫你的切換元件、這裡放Selector */}
                    <Selector
                        options={petList.map(p => p.name)}
                        onChange={idx => setSelectedIndex(idx)} />
                    {/* 在右下角放一張小圖 */}
                    <img
                        src={petList[selectedIndex].img}
                        alt={petList[selectedIndex].name}
                        className={styles.footerIcon}
                    />
                    {/* 開始遊戲按鈕 */}
                    <div className="text-center mt-3">
                        <button
                            className={`btn btn-warning ${styles.startBtn}`}
                            onClick={startGame}
                        >
                            開始遊戲
                        </button>
                    </div>
                </div>
            ) : (
                // 已經按了開始，顯示 QuizGame 元件
                <QuizGame
                    pet={petList[petIndex]}
                    questions={gameQuestions}
                    onRestart={() => setPetIndex(null)} />
            )}
        </div >
    );
}

export default Quiz;
