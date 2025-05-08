import React, { Component } from 'react';
import axios from 'axios';
import Market_modal from '../market_manage/Market_Modal';
import Pagination from './Page_manage';

export default class New_Products_Manage extends Component {
  state = {
    showModal: false,
    ModalState: 'Add', // 'Add' | 'Find' | 'Edit'
    thisIndex: -1,
    currentPage: 1,
    searchTerm: '',
    new_product: [],    // 列表資料
    currentProduct: null // 編輯/查看時使用
  };

  async componentDidMount() {
    this.loadList();
  }

  loadList = async () => {
    try {
      const res = await axios.get('http://localhost:8000/get/new-products');
      this.setState({ new_product: res.data });
    } catch (err) {
      console.error('取得新品清單失敗：', err);
      alert('無法取得新品清單');
    }
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSearchChange = e => {
    this.setState({ searchTerm: e.target.value, currentPage: 1 });
  };

  toggleModal = () => {
    this.setState(s => ({ showModal: !s.showModal }));
  };

  // 查看
  OpenFound = async idx => {
    const pid = this.filteredProducts()[idx].pid;
    try {
      const res = await axios.get(`http://localhost:8000/get/new-products/${pid}`);
      this.setState({ currentProduct: res.data, ModalState: 'Find', showModal: true });
    } catch (err) {
      console.error('讀取商品詳情失敗：', err);
      alert('無法取得商品詳情');
    }
  };

  // 編輯
  OpenEdit = async idx => {
    const pid = this.filteredProducts()[idx].pid;
    try {
      const res = await axios.get(`http://localhost:8000/get/new-products/${pid}`);
      this.setState({ currentProduct: res.data, ModalState: 'Edit', showModal: true });
    } catch (err) {
      console.error('讀取商品詳情失敗：', err);
      alert('無法取得商品詳情');
    }
  };

  // 新增
  OpenAdd = () => {
    this.setState({ currentProduct: null, ModalState: 'Add', showModal: true });
  };


   // 刪除
   Delete = async idx => {
    const pid = this.state.new_product[idx]?.pid;
    if (!pid) return;
    try {
      await axios.delete(`http://localhost:8000/get/new-products/${pid}`);
      alert('刪除成功');
      await this.loadList();
      this.setState({ currentPage: 1 });
    } catch (err) {
      console.error('刪除失敗：', err);
      alert('刪除失敗');
    }
  };
  new = async product => {
    try {
      await axios.post('http://localhost:8000/get/new-products', product);
      alert('新增成功');
      this.loadList();
    } catch (err) {
      console.error('新增失敗：', err);
      alert('新增失敗');
    }
  };

  edit = async product => {
    try {
      await axios.put(`http://localhost:8000/get/new-products/${product.pid}`, product);
      alert('修改成功');
      this.loadList();
    } catch (err) {
      console.error('更新失敗：', err);
      alert('更新失敗');
    }
  };

  filteredProducts = () => {
    const { new_product, searchTerm } = this.state;
    if (!searchTerm) return new_product;
    return new_product.filter(p =>
      p.pd_name.includes(searchTerm) || p.categories.includes(searchTerm)
    );
  };

  renderStatus = status =>
    status === 1
      ? <span className="badge bg-success">上架</span>
      : <span className="badge bg-secondary">下架</span>;

  renderCategory = cat => ({
    pet_food: '寵物食品',
    complementary_food: '副食品',
    snacks: '寵物零食',
    Health_Supplements: '健康保健品',
    Living_Essentials: '生活用品',
    toys: '寵物玩具'
  }[cat] || cat);

  render() {
    const { showModal, ModalState, currentPage, searchTerm, currentProduct } = this.state;
    const filtered = this.filteredProducts();
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

    return (
      <>
        <div className="mb-3">
          <form className="mb-2">
            <label htmlFor="sort" className="me-2">搜尋:</label>
            <input
              type="search"
              id="sort"
              className="form-control d-inline-block w-25"
              value={searchTerm}
              onChange={this.handleSearchChange}
            />
          </form>
          <button className="btn btn-outline-primary" onClick={this.OpenAdd}>
            新品上架
          </button>
        </div>

        <table className="table table-striped table-hover">
          <thead className="table-primary">
            <tr>
              <th>主圖</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th>類型</th>
              <th>狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((p, idx) => (
              <tr key={p.pid}>
                <td>
                  {p.imageUrl
                    ? <img src={p.imageUrl} alt={p.pd_name}
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                    : <span className="text-muted">無圖</span>
                  }
                </td>
                <td>{p.pd_name}</td>
                <td>{p.price}</td>
                <td>{this.renderCategory(p.categories)}</td>
                <td>{this.renderStatus(p.status)}</td>
                <td>
                  <button className="btn btn-primary btn-sm me-1" onClick={() => this.OpenFound(startIndex + idx)}>查看</button>
                  <button className="btn btn-warning btn-sm me-1" onClick={() => this.OpenEdit(startIndex + idx)}>編輯</button>
                  <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm(`確定要刪除 ${p.pd_name}？`)) this.Delete(startIndex + idx); }}>刪除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />

        {showModal && (
          <Market_modal
            key={`${ModalState}-${currentProduct?.pid || 'new'}`}
            close={this.toggleModal}
            new={this.new}
            edit={this.edit}
            product={currentProduct}
            modalState={ModalState}
            condition="new"
          />
        )}
      </>
    );
  }
}
