// src/component/MemberCenter/MyAcc/manage_market.jsx
import React, { Component } from 'react';
import Market_modal from './market_manage/Market_Modal';
import axios from 'axios';

export default class ManageMarket extends Component {
  state = {
    second_product: [],    // 後端資料
    searchTerm: '',        // 搜尋關鍵字
    showModal: false,
    ModalState: 'Add',     
    thisIndex: -1,         
    loading: false,
    error: null
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const res = await axios.get('http://localhost:8000/get/second-products');
      this.setState({ second_product: res.data, loading: false });
    } catch (err) {
      console.error('取得二手商品失敗：', err);
      this.setState({ error: '無法取得二手商品', loading: false });
    }
  };

  toggleModal = () => {
    this.setState(s => ({ showModal: !s.showModal }));
  };

  OpenAdd = () => {
    this.setState({ ModalState: 'Add', thisIndex: -1 });
    this.toggleModal();
  };
  OpenFound = i => { this.setState({ ModalState: 'Find', thisIndex: i }); this.toggleModal(); };
  OpenEdit  = i => { this.setState({ ModalState: 'Edit', thisIndex: i }); this.toggleModal(); };

  Delete = async i => {
    const { pid, pd_name } = this.state.second_product[i] || {};
    if (!pid || !window.confirm(`確定刪除 ${pd_name}？`)) return;
    try {
      await axios.delete(`http://localhost:8000/get/second-products/${pid}`);
      alert('刪除成功！');
      this.loadData();
    } catch {
      alert('刪除失敗，請稍後再試');
    }
  };

  new = async product => {
    await axios.post('http://localhost:8000/get/second-products', product);
    alert('新增成功！');
    this.toggleModal();
    this.loadData();
  };

  edit = async product => {
    await axios.put(`http://localhost:8000/get/second-products/${product.pid}`, product);
    alert('更新成功！');
    this.toggleModal();
    this.loadData();
  };

  // 搜尋輸入變動
  handleSearchChange = e => {
    this.setState({ searchTerm: e.target.value });
  };

  renderStatus = s => s === 1
    ? <span className="badge bg-success">上架</span>
    : <span className="badge bg-secondary">下架</span>;

  renderNewLevel = lvl => {
    const stars = '★★★★★'.slice(0, parseInt(lvl, 10));
    return <span style={{ color: '#FFD700' }}>{stars.padEnd(5, '☆')}</span>;
  };

  renderCategory = cat => ({
    pet_food: "寵物食品",
    complementary_food: "副食品",
    snacks: "零食",
    Health_Supplements: "保健品",
    Living_Essentials: "用品",
    toys: "玩具"
  }[cat] || cat);

  findProduct = i => this.state.second_product[i] || null;

  render() {
    const { second_product, loading, error, showModal, ModalState, thisIndex, searchTerm } = this.state;
    // 根據搜尋關鍵字過濾
    const filtered = second_product.filter(p =>
      p.pd_name.includes(searchTerm)
    );

    return (
      <>
        <div className="d-flex justify-content-between mb-3">
          <div>
            <input
              type="search"
              className="form-control"
              placeholder="搜尋商品名稱"
              value={searchTerm}
              onChange={this.handleSearchChange}
              style={{ width: 200, display: 'inline-block', marginRight: 8 }}
            />
            <button
              className="btn btn-outline-primary"
              onClick={this.OpenAdd}
            >
              上架二手商品
            </button>
          </div>
        </div>

        {loading && <div>載入中…</div>}
        {error   && <div className="text-danger">{error}</div>}

        {!loading && !error && (
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th>主圖</th><th>名稱</th><th>價格</th><th>類型</th>
                <th>新舊程度</th><th>狀態</th><th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.pid}>
                  <td>
                    {p.imageUrl
                      ? <img src={p.imageUrl} alt="" style={{ width:50, height:50, objectFit:'cover' }}/>
                      : <span className="text-muted">無圖</span>
                    }
                  </td>
                  <td>{p.pd_name}</td>
                  <td>{p.price}</td>
                  <td>{this.renderCategory(p.categories)}</td>
                  <td>{this.renderNewLevel(p.new_level)}</td>
                  <td>{this.renderStatus(p.status)}</td>
                  <td>
                    <button className="btn btn-primary btn-sm me-1" onClick={() => this.OpenFound(i)}>查看</button>
                    <button className="btn btn-warning btn-sm me-1" onClick={() => this.OpenEdit(i)}>編輯</button>
                    <button className="btn btn-danger btn-sm" onClick={() => this.Delete(i)}>刪除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showModal && (
          <Market_modal
            condition="second"
            modalstate={ModalState}
            product={this.findProduct(thisIndex)}
            new={this.new}
            edit={this.edit}
            close={this.toggleModal}
          />
        )}
      </>
    );
  }
}
