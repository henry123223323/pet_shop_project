import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './SideBar';
import ArticleList from './ArticleList';
import KnowStyles from './Knowledge.module.css';




export default function KnowledgeLayout({ topic }) {
    // topic = 'petfeeding' or 'healthcheck'
    const { pet } = useParams();
    console.log("路由參數 pet =", pet);

    return (
        <div className={`${KnowStyles.wrapper} container-lg`}>
            <h2 className={KnowStyles.header}>
                {topic === 'Novicefeeding' ? '新手飼養指南' : '健康檢查篇'}
            </h2>
            <div className={KnowStyles.content}>
                <Sidebar topic={topic} selected={pet} />
                <div className={KnowStyles.articles}>
                    {/* 直接渲染分頁列表 */}
                    <ArticleList topic={topic} pet={pet} />
                </div>
            </div>
        </div>
    );
}
