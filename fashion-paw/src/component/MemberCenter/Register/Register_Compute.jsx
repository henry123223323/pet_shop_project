import React, { Component } from 'react';
import Step from './Step';
import StepEmail from './StepEmail';
import StepPassword from './StepPassword';
import StepBasicInfo from './StepBasicInfo';
class Register_Compute extends Component {
    state = {
        currentStep: 1,
        steps: [
            { number: "1", content: "驗證email" },
            { number: "2", content: "輸入密碼" },
            { number: "3", content: "基本資料" }
        ]
    };

    handleNext = () => {
        //按下一步 currentStep+1
        this.setState((prevState) => ({
            currentStep: Math.min(prevState.currentStep + 1, prevState.steps.length)
        }));
    };
    renderStepContent = () => {
        //根據進行到的步驟切換表單 next=傳送handleNext function供表單元件使用
        if (this.state.currentStep == 1) {
            return <StepEmail next={this.handleNext}/>
        }
        else if (this.state.currentStep == 2) {
            console.log("step2");
            
            return <StepPassword next={this.handleNext}/>
        }
        else {
            return <StepBasicInfo next={this.handleNext}/>
        }
    }
    render() {
        
        const { currentStep, steps } = this.state;
        console.log(currentStep);

        return (
            <div className='col-md-6 text-center'>
                <div className="container mx-auto my-2 col-6">
                    <div className="row">
                        {//建立註冊表單商方的步驟圈圈 statement判斷是否完成該步驟true為完成
                            steps.map((step, index) => (
                            <Step
                                key={index}
                                number={step.number}
                                content={step.content}
                                statement={currentStep >= index + 1}
                            />
                        ))}
                    </div>
                </div>
                <form>
                    {this.renderStepContent()}
                </form>
            </div>
        );
    }
}

export default Register_Compute;
