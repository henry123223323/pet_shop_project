import React, { Component } from 'react';
import axios from 'axios';
import Market_modal from '../market_manage/Market_Modal';
import Pagination from './Page_manage';

// 二手商品管理元件，從後端抓取資料，同時常駐「上架二手商品」按鈕
export default class SecondProductManage extends Component {
  state = {
    showModal: false,
    ModalState: 'Add', // 'Add' | 'Find' | 'Edit'
    thisIndex: -1,
    currentPage: 1,
    second_product: [],  // 從後端載入的二手商品
    loading: true,
    error: null
  };

  async componentDidMount() {
    try {
      const res = await axios.get('http://localhost:8000/get/second-products');
      this.setState({ second_product: res.data, loading: false });
    } catch (err) {
      console.error('取得二手商品清單失敗：', err);
      this.setState({ error: '無法取得二手商品', loading: false });
    }
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  toggleModal = () => {
    this.setState(s => ({ showModal: !s.showModal }));
  };

  findProduct = (idx) => this.state.second_product[idx] || {};

  renderStatus = (status) =>
    status === 1
      ? <span className="badge bg-success">上架</span>
      : <span className="badge bg-secondary">下架</span>;

  renderNewLevel = (level) => {
    const stars = '★★★★★'.slice(0, parseInt(level, 10));
    return <span style={{ color: '#FFD700' }}>{stars.padEnd(5, '☆')}</span>;
  };

  renderCategory = (category) => {
    const map = {
      pet_food: '寵物食品',
      complementary_food: '寵物副食',
      snacks: '寵物零食',
      Health_Supplements: '寵物保健品',
      Living_Essentials: '生活用品',
      toys: '寵物玩具'
    };
    return map[category] || category;
  };

  OpenFound = (index) => {
    this.setState({ ModalState: 'Find', thisIndex: index }, this.toggleModal);
  };

  OpenEdit = (index) => {
    this.setState({ ModalState: 'Edit', thisIndex: index }, this.toggleModal);
  };

  OpenAdd = () => {
    this.setState({ ModalState: 'Add', thisIndex: -1 }, this.toggleModal);
  };

  // 刪除商品
  Delete = (index) => {
    const { pid } = this.state.second_product[index] || {};
    // TODO: 呼叫刪除 API
    console.log('刪除 pid=', pid);
  };

  // 新增商品
  new = (product) => {
    // TODO: 呼叫新增 API
    console.log('新增商品：', product);
  };

  // 編輯商品
  edit = (product) => {
    // TODO: 呼叫更新 API
    console.log('更新商品：', product);
  };

  render() {
    const { second_product, showModal, ModalState, thisIndex, currentPage, loading, error } = this.state;
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageItems = second_product.slice(startIndex, startIndex + itemsPerPage);

    return (
      <>
        {/* 永遠顯示的上架按鈕 */}
        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-outline-primary" onClick={this.OpenAdd}>
            上架二手商品
          </button>
        </div>

        {/* Loading/Error 狀態顯示 */}
        {loading && <div>載入中...</div>}
        {error && <div className="text-danger">{error}</div>}

        {/* 成功讀取後顯示表格與分頁 */}
        {!loading && !error && (
          <>
            <table className="table table-striped table-hover">
              <thead className="table-primary">
                <tr>
                  <th>主圖</th>
                  <th>商品名稱</th>
                  <th>價格</th>
                  <th>類型</th>
                  <th>新舊程度</th>
                  <th>狀態</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((product, idx) => (
                  <tr key={product.pid}>
                    <td>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.pd_name}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                      ) : (
                        <span className="text-muted">無圖</span>
                      )}
                    </td>
                    <td>{product.pd_name}</td>
                    <td>{product.price}</td>
                    <td>{this.renderCategory(product.categories)}</td>
                    <td>{this.renderNewLevel(product.new_level)}</td>
                    <td>{this.renderStatus(product.status)}</td>
                    <td>
                      <button className="btn btn-primary btn-sm me-1" onClick={() => this.OpenFound(startIndex + idx)}>
                        查看
                      </button>
                      <button className="btn btn-warning btn-sm me-1" onClick={() => this.OpenEdit(startIndex + idx)}>
                        編輯
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          if (window.confirm(`確定要刪除 ${product.pd_name}？`)) {
                            this.Delete(startIndex + idx);
                          }
                        }}
                      >刪除</button>
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

        {/* 模態框 */}
        {showModal && (
          <Market_modal
            key={`second-${ModalState}-${thisIndex}`}
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
