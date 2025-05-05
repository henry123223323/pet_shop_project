// src/component/PetKnowledge/ArticleDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import mockData from './data/mockArticles.json';
import DetailStyles from './ArticleDetail.module.css';
import recommendProducts from './RecommendProducts.js';
import { Link } from 'react-router-dom';

export default function ArticleDetail({ topic }) {
    const { pet, id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        // 模擬從後端拿單篇
        setTimeout(() => {
            // 這裡你原本 fetch 單篇的邏輯
            // 現在直接用 mockData
            import('./data/mockArticles.json').then(mod => {
                const list = mod.default[topic]?.[pet] || [];
                const found = list.find(a => String(a.id) === id);
                setArticle(found || null);
                setLoading(false);
            });
        }, 300);
    }, [topic, pet, id]);

    if (loading) return <p className="text-center my-5">載入中…</p>;
    if (error) return <p className="text-danger text-center my-5">錯誤：{error}</p>;
    if (!article) return <p className="text-center my-5">找不到這篇文章</p>;

    return (
        <div className="container-lg mt-5">
            {/* --- 文章區 --- */}
            <div className="row">
                <div className="col-12">
                    <h1>{article.title}</h1>
                    <p className="text-muted">
                        {new Date(article.date).toLocaleDateString()}
                    </p>
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="img-fluid rounded mb-4"
                    />
                    <div className={DetailStyles.content}>
                        {/* 假如你要顯示更長的 content 可以是 article.content */}
                        <p>{article.summary}</p>
                    </div>
                </div>
            </div>

            {/* --- 推薦商品區 --- */}
            <div className="row mt-5">
                <div className="col-12">
                    <h3>為您推薦</h3>
                </div>
                {recommendProducts.map(prod => (
                    <div key={prod.id} className="col-6 col-md-4 col-lg-3 mb-4">
                        <div className="card h-100">
                            <img
                                src={prod.image}
                                className="card-img-top"
                                alt={prod.name}
                            />
                            <div className="card-body text-center">
                                <h5 className="card-title">{prod.name}</h5>
                                <p className="card-text">{prod.price}</p>
                                <Link to={`/ProductPage/${prod.id}`} className="btn btn-sm btn-success">
                                    查看商品
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}