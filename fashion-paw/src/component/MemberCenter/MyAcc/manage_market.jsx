// src/component/MemberCenter/MyAcc/manage_market.jsx
import React, { Component } from 'react';
import axios from 'axios';

import Market_modal from './market_manage/Market_Modal';

export default class ManageMarket extends Component {
  state = {
    second_product: [],  // 後端回傳的個人二手商品
    searchTerm: '',      // 搜尋關鍵字
    showModal: false,    // 控制 Modal 顯示
    ModalState: 'Add',   // 'Add' | 'Find' | 'Edit'
    thisIndex: -1,       // 目前操作的商品索引
    loading: false,
    error: null
  };

  componentDidMount() {
    this.loadData();
  }

  // 取得「個人」二手商品
  loadData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const uid = localStorage.getItem('userId');  // 假設登入後把 userId 存在 localStorage
      const res = await axios.get(
        'http://localhost:8000/get/second-products',
        { params: { uid } }                         // 傳給後端過濾「只要這個 uid」
      );
      this.setState({ second_product: res.data, loading: false });
    } catch (err) {
      console.error('取得個人二手商品失敗：', err);
      this.setState({ error: '無法取得商品', loading: false });
    }
  };

  toggleModal = () => {
    this.setState(s => ({ showModal: !s.showModal }));
  };

  OpenAdd = () => { this.setState({ ModalState: 'Add', thisIndex: -1 }); this.toggleModal(); };
  OpenFound = i => { this.setState({ ModalState: 'Find', thisIndex: i }); this.toggleModal(); };
  OpenEdit = i => { this.setState({ ModalState: 'Edit', thisIndex: i }); this.toggleModal(); };

  // 刪除商品
  Delete = async i => {
    const { pid, pd_name } = this.state.second_product[i] || {};
    if (!pid || !window.confirm(`確定刪除 ${pd_name}？`)) return;
    try {
      const uid = localStorage.getItem('userId');
      await axios.delete(
        `http://localhost:8000/get/second-products/${pid}`,
        { params: { uid } }  // 後端用來驗證這筆商品屬於此 uid
      );
      alert('刪除成功！');
      this.loadData();
    } catch (err) {
      console.error('刪除失敗：', err);
      alert('刪除失敗，請稍後再試');
    }
  };

  // 新增商品
  new = async product => {
    try {
      const uid = localStorage.getItem('userId');
      await axios.post(
        'http://localhost:8000/get/second-products',
        { ...product, uid }  // 一併帶上 uid，後端才知道歸屬
      );
      alert('新增成功！');
      this.toggleModal();
      this.loadData();
    } catch (err) {
      console.error('新增失敗：', err);
      alert('新增失敗，請稍後再試');
    }
  };

  // 編輯商品
  edit = async product => {
    try {
      const uid = localStorage.getItem('userId');
      await axios.put(
        `http://localhost:8000/get/second-products/${product.pid}`,
        { ...product, uid }  // 同樣帶 uid，後端才能核對並更新
      );
      alert('更新成功！');
      this.toggleModal();
      this.loadData();
    } catch (err) {
      console.error('更新失敗：', err);
      alert('更新失敗，請稍後再試');
    }
  };

  handleSearchChange = e => {
    this.setState({ searchTerm: e.target.value });
  };

  renderStatus = s =>
    s === 1
      ? <span className="badge bg-success">上架</span>
      : <span className="badge bg-secondary">下架</span>;

  renderNewLevel = lvl => {
    const stars = '★★★★★'.slice(0, parseInt(lvl, 10));
    return <span style={{ color: '#FFD700' }}>{stars.padEnd(5, '☆')}</span>;
  };

  renderCategory = cat =>
  ({
    pet_food: "飼料",
    complementary_food: "副食",
    snacks: "零食",
    Health_Supplements: "保健食品",
    Living_Essentials: "生活家居",
    toys: "玩具"
  }[cat] || cat);

  findProduct = i => this.state.second_product[i] || null;

  render() {
    const {
      second_product,
      loading,
      error,
      showModal,
      ModalState,
      thisIndex,
      searchTerm
    } = this.state;

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
        {error && <div className="text-danger">{error}</div>}

        {!loading && !error && (
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th>主圖</th>
                <th>名稱</th>
                <th>價格</th>
                <th>類型</th>
                <th>新舊程度</th>
                <th>狀態</th>
                <th>操作</th>
                <th>回報錯誤</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.pid}>
                  <td>
                    {p.imageUrl
                      ? <img src={p.imageUrl} alt="" style={{ width: 50, height: 50, objectFit: 'cover' }} />
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
                  <td>
                    <select>
                      <option value="">----選擇----</option>
                      <option value="">無法出貨</option>
                      <option value="">貨物損毀</option>
                      <option value="">重複上架</option>
                    </select>
                    <p></p>
                    <button className='btn btn-danger'>回報</button>
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
