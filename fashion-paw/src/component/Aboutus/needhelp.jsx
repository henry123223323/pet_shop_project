import React, { Component } from 'react';
import style from './needhelp.module.css';

class Needhelp extends Component {
    constructor(props) {
        super(props);
        this.koufu = React.createRef();
        this.g1 = React.createRef();
        this.g2 = React.createRef();
        this.g3 = React.createRef();

        this.state = {
            showAppleBlock: false,
            showBananaBlock: false,
            showCatBlock: false,
            answer1: '',
            answer2: '',
            answer3: '',
            answer4: '',
            answer5: '',
            answer6: '',
            answer7: '',
            answer8: '',
            answer9: '',
            quest1: '你喜歡吃蘋果嗎？',
            quest2: '還是香蕉？',
            quest3: '還是鳳梨？',
            quest4: '你口袋有錢嗎?',
            quest5: '一千?',
            quest6: '一百?',
            quest7: '你體重是不是很重',
            quest8: '五十公斤?',
            quest9: '一百公斤?',
        }
    }

    apple = () => {
        this.setState({
            answer1: '我是蘋果',
            answer2: '',
            answer3: '',
        });
    };
    
    banana = () => {
        this.setState({
            answer1: '',
            answer2: '我是香蕉',
            answer3: '',
        });
    };


    pieapple = () => {
        this.setState({
            answer1: '',
            answer2: '',
            answer3: '我是鳳梨',
        });
    };
    
    cat = () => {
        this.setState({
            answer4: '別問了沒錢',
            answer5: '',
            answer6: '',
        });
    };
    
    dog = () => {
        this.setState({
            answer4: '',
            answer5: '都說沒錢了怎麼有一千',
            answer6: '',
        });
    };
    
    fish = () => {
        this.setState({
            answer4: '',
            answer5: '',
            answer6: '一百也沒有啦你到底想怎樣',
        });
    };
    
    eleven = () => {
        this.setState({
            answer7: '你在公三小',
            answer8: '',
            answer9: '',
        });
    };
    
    killer13 = () => {
        this.setState({
            answer7: '',
            answer8: '欸不是不要自顧自往上加',
            answer9: '',
        });
    };

    orange = () => {
        this.setState({
            answer7: '',
            answer8: '',
            answer9: '我要殺了妳',
        });
    };

    newapple = () => {
        this.setState({ showAppleBlock: true,
            showBananaBlock: false,
            showCatBlock: false, });
    }
    
    newbanana = () => {
        this.setState({ showAppleBlock: false,
            showBananaBlock: true,
            showCatBlock: false, });
    }

    newcat = () => {
        this.setState({ showAppleBlock: false,
            showBananaBlock: false,
            showCatBlock: true, });
    }



    render() {
        return (
            <div className={style.bigerdiv}>
                <div className={style.nivdiv}>
                    <span className={style.nivspan} ref={this.g1} onClick={this.newapple}>123</span>
                    <span className={style.nivspan} ref={this.g2} onClick={this.newbanana}>456</span>
                    <span className={style.nivspan} ref={this.g3} onClick={this.newcat}>789</span>
                </div>
                <div ref={this.koufu}>
                    {this.state.showAppleBlock && (
                        <div>
                            <div onClick={this.apple}className={style.quest} >
                                {this.state.quest1}
                            </div>
                            <span>{this.state.answer1}</span>
                            <div onClick={this.banana} className={style.quest}>{this.state.quest2}</div>
                            <span>{this.state.answer2}</span>
                            <div onClick={this.pieapple} className={style.quest}>{this.state.quest3}</div>
                            <span>{this.state.answer3}</span>

                        </div>
                    )}
                    {this.state.showBananaBlock && (
                        <div>
                            <div className={style.quest} onClick={this.cat}>{this.state.quest4}</div>
                            <span>{this.state.answer4}</span>
                            <div className={style.quest} onClick={this.dog}>{this.state.quest5}</div>
                            <span>{this.state.answer5}</span>
                            <div className={style.quest} onClick={this.fish}>{this.state.quest6}</div>
                            <span>{this.state.answer6}</span>
                        </div>
                    )}
                    {this.state.showCatBlock &&(
                        <div>
                            <div className={style.quest} onClick={this.eleven}>{this.state.quest7}</div>
                            <span>{this.state.answer7}</span>
                            <div className={style.quest} onClick={this.killer13}>{this.state.quest8}</div>
                            <span>{this.state.answer8}</span>
                            <div className={style.quest} onClick={this.orange}>{this.state.quest9}</div>
                            <span>{this.state.answer9}</span>

                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Needhelp;