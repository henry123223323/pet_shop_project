import React, { Component } from 'react';
import axios from 'axios';

class StepEmail extends Component {
    state = {
        email: '',
        code: '',
        status: '',
        sending: false,
        verifying: false,
        cooldown: 0, // 發送間隔秒數
        codeExpiresAt: null, // 驗證碼過期時間
        timeNow: Date.now() // 用於觸發重新渲染
    };
    

    // 每秒更新狀態
    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({ timeNow: Date.now() });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    // 發送驗證碼
    sendVerifyCode = async (event) => {
        event.preventDefault();
        const { email } = this.state;

        if (!email) {
            this.setState({ status: '請輸入 email' });
            return;
        }

        try {
            this.setState({ sending: true, status: '發送中...' });
            const response = await axios.post('http://localhost:8000/verify/send-verification-code', { email });

            if (response.data.success) {
                const expires = Date.now() + 10 * 60 * 1000; // 10 分鐘
                this.setState({
                    status: '✅ 驗證碼已寄出，請至信箱查看',
                    codeExpiresAt: expires,
                    cooldown: 60 // 禁用再次發送 60 秒
                });

                // 啟動 cooldown 計時器
                this.startCooldownTimer();
            } else {
                this.setState({ status: '❌ 發送失敗：' + response.data.message });
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                this.setState({ status: '❌' + error.response.data.message });
            } else {
                this.setState({ status: '❌ 發送失敗（伺服器錯誤）' });
            }
        } finally {
            this.setState({ sending: false });
        }
    };

       // 開始倒數計時
       startCooldownTimer = () => {
        const interval = setInterval(() => {
            this.setState(prev => {
                if (prev.cooldown <= 1) {
                    clearInterval(interval);
                    return { cooldown: 0 };
                }
                return { cooldown: prev.cooldown - 1 };
            });
        }, 1000);
    };

    // 驗證驗證碼
    checkVerifyCode = async (event) => {
        event.preventDefault();
        const { email, code } = this.state;

        if (!email || !code) {
            this.setState({ status: '請輸入 email 與驗證碼' });
            return;
        }

        try {
            this.setState({ verifying: true, status: '驗證中...' });
            const response = await axios.post('http://localhost:8000/verify/verify-code', { email, code });

            if (response.data.success) {
                this.setState({ status: '✅ 驗證成功！' });
                this.props.next(); //  驗證通過才進下一步
            } else {
                this.setState({ status: '❌ 驗證失敗：' + response.data.message });
            }
        } catch (error) {
            this.setState({ status: '❌ 驗證失敗（伺服器錯誤）' });
        } finally {
            this.setState({ verifying: false });
        }
    };

    render() {
        const { email, code, status, sending, verifying, cooldown, codeExpiresAt, timeNow } = this.state;

        const remainingExpireSec = codeExpiresAt
            ? Math.max(0, Math.floor((codeExpiresAt - timeNow) / 1000))
            : 0;

        // const expireDisplay = codeExpiresAt
        //     ? remainingExpireSec > 0
        //         ? `驗證碼剩餘 ${Math.floor(remainingExpireSec / 60)}分${remainingExpireSec % 60}秒`
        //         : `❌ 驗證碼已過期`
        //     : null;
            return (
                <fieldset className="border mt-3">
                    <legend>Email</legend>
    
                    {/* Email 輸入 */}
                    <div className='d-flex justify-content-center align-items-center m-2'>
                        <label>電子郵件(email)</label>
                        <input
                            name="email"
                            type="email"
                            className="form-control w-50 m-2"
                            value={email}
                            onChange={(e) => this.setState({ email: e.target.value })}
                        />
                    </div>
    
                    {/* 驗證碼輸入 + 按鈕 */}
                    <div className='d-flex justify-content-center align-items-center m-2'>
                        <label htmlFor="verify" className='mx-3'>驗證碼</label>
                        <input
                            type="text"
                            name="verify"
                            className="form-control w-25 mx-4"
                            value={code}
                            onChange={(e) => this.setState({ code: e.target.value })}
                        />
                        <button
                            className="btn btn-outline-primary me-2"
                            onClick={this.sendVerifyCode}
                            disabled={sending || cooldown > 0}
                        >
                            {cooldown > 0 ? `請稍候 (${cooldown}s)` : '發送驗證碼'}
                        </button>
                    </div>
    
                    {/* 驗證按鈕 */}
                    <div className="mt-3">
                        <button
                            className="btn btn-primary"
                            onClick={this.checkVerifyCode}
                            disabled={verifying}
                        >
                            {verifying ? '驗證中...' : '下一步'}
                        </button>
                    </div>
    
                    {/* 狀態顯示 */}
                    {status && <p className="text-secondary mt-2">{status}</p>}
                    {/* {expireDisplay && <p className="text-danger">{expireDisplay}</p>} */}
                </fieldset>
            );
        }
    }
export default StepEmail;