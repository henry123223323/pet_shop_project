import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import mockData from './data/mockArticles.json';
import DetailStyles from './ArticleDetail.module.css';
import recommendProducts from './RecommendProducts.js';
import { Link } from 'react-router-dom';
import AddToCartBtn from '../share/AddToCartBtn';
import AddToMyFavorite from '../share/AddToMyFavorite';

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
        <div className={`container-lg mt-2 ${DetailStyles.articlewrapper}`}>
            {/* 文章區 */}
            <div className="row">
                <div className="col-12">
                    <h1 className={DetailStyles.title}>{article.title}</h1>
                    <p className="text-muted">
                        {new Date(article.date).toLocaleDateString()}
                    </p>
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className={`img-fluid rounded mb-4 ${DetailStyles.imgFluid}`}
                    />
                    <div className={DetailStyles.content}>
                        <p>{article.summary}</p>
                    </div>
                </div>
            </div>

            {/* 推薦商品區 */}
            <div className={DetailStyles.recommendWrapper}>
                <h3 className={DetailStyles.recommendTitle}>為您推薦</h3>
                <div className="row mt-3">
                    {recommendProducts.map(prod => (
                        <div key={prod.id} className="col-6 col-md-4 col-lg-4 mb-5">
                            <div className="card h-100 p-5">
                                <img
                                    src={prod.image}
                                    className="card-img-top"
                                    alt={prod.name}
                                />
                                <div className="card-body text-center">
                                    <Link to={`/ProductPage/${prod.id}`}>
                                        <h5 className="card-title">{prod.name}</h5>
                                        <p className="card-text">{prod.price}</p>
                                    </Link>
                                    <div className='d-flex justify-content-center'>
                                        <AddToMyFavorite />
                                        <AddToCartBtn />
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}