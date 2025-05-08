// src/component/MemberCenter/MyAcc/Article_manage.jsx

import React, { Component } from 'react';
import Pagination from './Page_manage';
import Article_modal from './Article_modal';
import axios from 'axios';

export default class Article_manage extends Component {
  state = {
    articles: [],
    currentPage: 1,
    itemsPerPage: 10,
    showModal: false,
    modalMode: 'Add',      // 'Add' or 'Edit'
    modalArticle: { sections: [] },
  };

  componentDidMount() {
    this.loadArticles();
  }

  loadArticles = async () => {
    try {
      // 1. 讀取文章列表（對應後端 app.get('/get/article')）
      const res = await axios.get('http://localhost:8000/get/article');
      const articles = res.data.map(a => ({
        ...a,
        create_at: new Date(a.create_at).toLocaleString(),
        sections: JSON.parse(a.sections || '[]'),
        // 組 banner 圖片完整 URL
        banner_URL:
          a.article_type === 'health_check'
            ? `/media/pet_know/health_check/${a.banner_URL}`
            : `/media/pet_know/pet_feeding/${a.banner_URL}`,
      }));
      this.setState({ articles });
    } catch (err) {
      console.error('讀取文章失敗：', err);
      alert('讀取文章失敗，請稍後再試');
    }
  };

  openAdd = () => {
    this.setState({
      showModal: true,
      modalMode: 'Add',
      modalArticle: { sections: [] },
    });
  };

  openEdit = index => {
    const article = this.state.articles[index];
    this.setState({
      showModal: true,
      modalMode: 'Edit',
      modalArticle: { ...article },
    });
  };

  createArticle = async form => {
    try {
      const payload = {
        ...form,
        sections: JSON.stringify(form.sections),
      };
      // 2. 新增文章（對應後端 app.post('/api/create/article')）
      const res = await axios.post(
        'http://localhost:8000/api/create/article',
        payload
      );
      const newId = res.data.insertId;
      const newArticle = {
        ...form,
        ArticleID: newId,
        create_at: new Date().toLocaleString(),
      };
      this.setState(s => ({
        articles: [newArticle, ...s.articles],
        showModal: false,
      }));
    } catch (err) {
      console.error('新增文章失敗：', err);
      alert(
        '新增文章失敗：' + (err.response?.data?.error || err.message)
      );
    }
  };

  editArticle = async form => {
    try {
      const payload = {
        ...form,
        sections: JSON.stringify(form.sections),
      };
      // 3. 更新文章（假設後端是 app.put('/api/update/article/:id')）
      await axios.put(
        `http://localhost:8000/api/update/article/${form.ArticleID}`,
        payload
      );
      this.setState(s => ({
        articles: s.articles.map(a =>
          a.ArticleID === form.ArticleID ? form : a
        ),
        showModal: false,
      }));
    } catch (err) {
      console.error('編輯文章失敗：', err);
      alert(
        '編輯文章失敗：' + (err.response?.data?.error || err.message)
      );
    }
  };

  deleteArticle = async index => {
    const { ArticleID, title } = this.state.articles[index];
    if (!window.confirm(`確定要刪除《${title}》？`)) return;
    try {
      // 4. 刪除文章（對應後端 app.delete('/get/article/:id')）
      await axios.delete(
        `http://localhost:8000/get/article/${ArticleID}`
      );
      alert('刪除成功！');
      this.loadArticles();
    } catch (err) {
      console.error('刪除文章失敗：', err);
      alert(
        '刪除文章失敗：' + (err.response?.data?.error || err.message)
      );
    }
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  render() {
    const {
      articles,
      currentPage,
      itemsPerPage,
      showModal,
      modalMode,
      modalArticle,
    } = this.state;

    const start = (currentPage - 1) * itemsPerPage;
    const pageItems = articles.slice(start, start + itemsPerPage);

    return (
      <>
        <div className="d-flex justify-content-between mb-3">
          <button
            className="btn btn-outline-primary"
            onClick={this.openAdd}
          >
            新增文章
          </button>
        </div>

        <table className="table table-striped table-hover">
          <thead className="table-primary">
            <tr>
              <th>ArticleID</th>
              <th>標題</th>
              <th>摘要</th>
              <th>建立時間</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((a, i) => (
              <tr key={a.ArticleID}>
                <td>{a.ArticleID}</td>
                <td>{a.title}</td>
                <td>{a.intro}</td>
                <td>{a.create_at}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => this.openEdit(start + i)}
                  >
                    編輯
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => this.deleteArticle(start + i)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          totalItems={articles.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />

        {showModal && (
          <Article_modal
            key={`${modalMode}-${modalArticle.ArticleID || 'new'}`}
            mode={modalMode}
            article={modalArticle}
            createArticle={this.createArticle}
            editArticle={this.editArticle}
            close={() => this.setState({ showModal: false })}
          />
        )}
      </>
    );
  }
}
