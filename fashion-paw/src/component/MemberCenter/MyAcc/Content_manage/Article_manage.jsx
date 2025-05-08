import React, { Component } from 'react';
import Pagination from './Page_manage';
import Article_modal from './Article_modal';
import axios from 'axios';

class Article_manage extends Component {
  state = {
    articles: [],
    currentPage: 1,
    itemsPerPage: 10,
    showModal: false,
    modalMode: 'Add', // 'Add' 或 'Edit'
    modalArticle: { sections: [] },
  };

  async componentDidMount() {
    try {
      const result = await axios.get('http://localhost:8000/get/article');
      const articles = result.data.map(a => ({
        ...a,
        create_at: new Date(a.create_at).toLocaleString(),
        sections: JSON.parse(a.sections),
        banner_URL: a.product_category === 'Health Supplements'
          ? '/media/pet_know/health_check' + a.banner_URL
          : '/media/pet_know/pet_feeding' + a.banner_URL,
      }));
      this.setState({ articles });
    } catch (err) {
      console.error('讀取文章失敗：', err);
      alert('讀取文章失敗，請稍後再試');
    }
  }

  openAdd = () => {
    this.setState({ showModal: true, modalMode: 'Add', modalArticle: { sections: [] } });
  };

  openEdit = index => {
    const article = { ...this.state.articles[index] };
    this.setState({ showModal: true, modalMode: 'Edit', modalArticle: article });
  };

  createArticle = async form => {
    try {
      const payload = { ...form, sections: JSON.stringify(form.sections) };
      const res = await axios.post('http://localhost:8000/api/create/article', payload);
      const newArticle = { ...form, ArticleID: res.data.insertId, create_at: new Date().toLocaleString() };
      this.setState(s => ({ articles: [newArticle, ...s.articles], showModal: false }));
    } catch (err) {
      console.error('新增文章失敗：', err);
      alert('新增文章失敗：' + (err.response?.data?.error || err.message));
    }
  };

  editArticle = async form => {
    try {
      const payload = { ...form, sections: JSON.stringify(form.sections) };
      await axios.put(`http://localhost:8000/api/update/article/${form.ArticleID}`, payload);
      this.setState(s => ({
        articles: s.articles.map(a => (a.ArticleID === form.ArticleID ? form : a)),
        showModal: false,
      }));
    } catch (err) {
      console.error('編輯文章失敗：', err);
      alert('編輯文章失敗：' + (err.response?.data?.error || err.message));
    }
  };

  deleteArticle = async index => {
    const article = this.state.articles[index];
    if (!window.confirm(`確定要刪除《${article.title}》？`)) return;
    try {
      // 呼叫後端刪除 API，路由對應 /get/article/:id
      await axios.delete(`http://localhost:8000/get/article/${article.ArticleID}`);
      alert('刪除成功！');
      // 重新載入列表
      this.componentDidMount();
    } catch (err) {
      console.error('刪除文章失敗：', err);
      alert('刪除文章失敗：' + (err.response?.data?.error || err.message));
    }
  };

  handlePageChange = page => this.setState({ currentPage: page });

  render() {
    const { articles, currentPage, itemsPerPage, showModal, modalMode, modalArticle } = this.state;
    const start = (currentPage - 1) * itemsPerPage;
    const current = articles.slice(start, start + itemsPerPage);

    return (
      <>
        {/* 操作按鈕區 */}
        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-outline-primary" onClick={this.openAdd}>
            新增文章
          </button>
        </div>

        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ArticleID</th>
              <th>標題</th>
              <th>摘要</th>
              <th>建立時間</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {current.map((a, i) => (
              <tr key={a.ArticleID}>
                <td>{a.ArticleID}</td>
                <td>{a.title}</td>
                <td>{a.intro}</td>
                <td>{a.create_at}</td>
                <td>
                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => this.openEdit(start + i)}>
                    編輯
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => this.deleteArticle(start + i)}>
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

export default Article_manage;
