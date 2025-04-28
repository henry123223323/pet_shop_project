import React, { Component } from 'react';
import styles from './PdAttr.module.css'

class PdAttr extends Component {
    state = {}
    render() {
        return (<>
            {/* <h1>Attr說明頁</h1> */}
                <div className={`mx-2 paw-bg-lightenbrown ${styles.attrBg}`}>
                    <table className={`p-2 ${styles.table}`}>
                        <thead>
                            <tr>
                                <th>類別</th>
                                <th>說明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>品牌</td>
                                <td>不清楚</td>
                            </tr>
                            <tr>
                                <td>名稱</td>
                                <td>灰色毛氈立方貓窩（可折疊）</td>
                            </tr>
                            <tr>
                                <td>購入時間</td>
                                <td>2024-03</td>
                            </tr>
                            <tr>
                                <td>保存狀況</td>
                                <td>良好</td>
                            </tr>

                            <tr>
                                <td>型號</td>
                                <td>XA-123</td>
                            </tr>
                            <tr>
                                <td>尺寸</td>
                                <td>長90 寬60 高140 公分</td>
                            </tr>
                            <tr>
                                <td>顏色</td>
                                <td>灰白</td>
                            </tr>
                            <tr>
                                <td>重量</td>
                                <td>800g</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

        </>);
    }
}

export default PdAttr;