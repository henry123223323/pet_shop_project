import React, { Component } from 'react';
import axios from 'axios';
import Market_modal from '../market_manage/Market_Modal';
import Pagination from './Page_manage';

export default class SecondProductManage extends Component {
  state = {
    second_product: [],
    loading: true,
    error: null,
    showModal: false,
    ModalState: 'Add',  // 'Add' | 'Find' | 'Edit'
    thisIndex: -1,
    currentPage: 1
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
  }

  toggleModal = () => {
    this.setState(s => ({ showModal: !s.showModal }));
  }

  OpenFound = idx => this.setState({ ModalState: 'Find', thisIndex: idx }, this.toggleModal)
  OpenEdit = idx => this.setState({ ModalState: 'Edit', thisIndex: idx }, this.toggleModal)
  OpenAdd = () => this.setState({ ModalState: 'Add', thisIndex: -1 }, this.toggleModal)

  Delete = async index => {
    const { pid } = this.state.second_product[index] || {};
    if (!pid) return;

    try {
      await axios.delete(`http://localhost:8000/get/second-products/${pid}`);
      // 刪除成功提示
      alert('刪除成功！');
      // 刷新一次頁面
      window.location.reload();
    } catch (err) {
      console.error('刪除失敗：', err);
      alert('刪除失敗，請稍後再試');
    }
  }



  new = async pd => {
    try {
      await axios.post('http://localhost:8000/get/second-products', pd);
      await this.loadData();
      this.setState({ showModal: false, currentPage: 1 });
    } catch (err) {
      console.error('新增失敗：', err);
    }
  }

  edit = async pd => {
    try {
      const res = await axios.put(
        `http://localhost:8000/get/second-products/${pd.pid}`,
        pd
      );
      this.setState(s => {
        const list = [...s.second_product];
        const i = list.findIndex(x => x.pid === pd.pid);
        if (i >= 0) list[i] = res.data;
        return { second_product: list, showModal: false };
      });
    } catch (err) {
      console.error('更新失敗：', err);
    }
  }

  handlePageChange = page => {
    this.setState({ currentPage: page });
  }

  renderStatus = st =>
    st === 1
      ? <span className="badge bg-success">上架</span>
      : <span className="badge bg-secondary">下架</span>;

  renderNewLevel = lvl => {
    const stars = '★★★★★'.slice(0, parseInt(lvl, 10));
    return <span style={{ color: '#FFD700' }}>{stars.padEnd(5, '☆')}</span>;
  }

  renderCategory = cat => ({
    pet_food: '寵物食品',
    complementary_food: '寵物副食',
    snacks: '寵物零食',
    Health_Supplements: '寵物保健品',
    Living_Essentials: '生活用品',
    toys: '寵物玩具'
  }[cat] || cat);

  findProduct = idx => this.state.second_product[idx] || {}

  render() {
    const { second_product, loading, error, showModal, ModalState, thisIndex, currentPage } = this.state;
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageItems = second_product.slice(startIndex, startIndex + itemsPerPage);

    return (
      <>
        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-outline-primary" onClick={this.OpenAdd}>
            上架二手商品
          </button>
        </div>

        {loading && <div>載入中…</div>}
        {error && <div className="text-danger">{error}</div>}

        {!loading && !error && (
          <>
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
                </tr>
              </thead>
              <tbody>
                {pageItems.map((p, i) => (
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
                      <button className="btn btn-primary btn-sm me-1" onClick={() => this.OpenFound(startIndex + i)}>查看</button>
                      <button className="btn btn-warning btn-sm me-1" onClick={() => this.OpenEdit(startIndex + i)}>編輯</button>
                      <button className="btn btn-danger btn-sm" onClick={() => {
                        if (window.confirm('確定刪除？')) this.Delete(startIndex + i);
                      }}>刪除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              totalItems={second_product.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </>
        )}

        {showModal && (
          <Market_modal
            mode="second"
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
