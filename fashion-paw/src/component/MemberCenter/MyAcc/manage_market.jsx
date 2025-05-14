// src/component/MemberCenter/MyAcc/manage_market.jsx
import React, { Component } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Market_modal from './market_manage/Market_Modal'
import PawDisplay from '../../ProductDetailPage/PawDisplay';

// 全域設定
const BASE_URL = 'http://localhost:8000'

export default class ManageMarket extends Component {
  state = {
    second_product: [],
    searchTerm: '',
    page: 1,
    pageSize: 5,
    loading: false,
    error: null,
    showModal: false,
    ModalState: 'Add', // 'Add' | 'Find' | 'Edit'
    thisIndex: -1
  }

  componentDidMount() {
    this.loadData()
  }

  loadData = async () => {
    this.setState({ loading: true, error: null })
    try {
      const uid = Cookies.get('user_uid')
      console.log('▶ uid:', uid);
      if (!uid) throw new Error('請先登入')
      // 帶入 X-UID header 並自動帶 cookie
      const res = await axios.get(
        `${BASE_URL}/get/my-second-products`,
        { headers: { 'X-UID': uid } }
      )
      this.setState({ second_product: res.data, loading: false })
    } catch (err) {
      console.error('讀取失敗：', err)
      let errorMsg = ''
      if (err.response) {
        errorMsg = `伺服器錯誤 (${err.response.status})`
      } else if (err.request) {
        errorMsg = '無法連線伺服器，請確認後端是否啟動'
      } else {
        errorMsg = err.message
      }
      this.setState({ error: errorMsg, loading: false })
    }
  }

  toggleModal = () =>
    this.setState(s => ({ showModal: !s.showModal }))

  OpenAdd = () => { this.setState({ ModalState: 'Add', thisIndex: -1 }); this.toggleModal(); };
  OpenFound = i => { this.setState({ ModalState: 'Find', thisIndex: i }); this.toggleModal(); };
  OpenEdit = i => { this.setState({ ModalState: 'Edit', thisIndex: i }); this.toggleModal(); };

  // 刪除商品
  Delete = async i => {
    const { pid, pd_name } = this.state.second_product[i] || {}
    if (!pid || !window.confirm(`確定刪除 ${pd_name}？`)) return
    try {
      const uid = Cookies.get('user_uid')
      // 刪除時也帶入 X-UID
      await axios.delete(
        `${BASE_URL}/get/my-second-products/${pid}`,
        { headers: { 'X-UID': uid } }
      )
      alert('刪除成功！')
      this.loadData()
    } catch (err) {
      console.error('刪除失敗：', err)
      alert('刪除失敗，請稍後再試')
    }
  }

  new = async product => {
    try {
      const uid = Cookies.get('user_uid')
      const form = new FormData()
      form.append('pd_name', product.pd_name)
      form.append('price', product.price)
      form.append('categories', product.categories)
      form.append('new_level', product.new_level)
      form.append('status', product.status)
      product.images?.forEach(img => img.file && form.append('images', img.file))

      await axios.post(
        '/get/my-second-products',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-UID': uid
          }
        }
      )
      alert('新增成功！')
      this.toggleModal()
      this.loadData()
    } catch (err) {
      console.error('新增失敗：', err)
      alert('新增失敗，請稍後再試')
    }
  }

  edit = async product => {
    try {
      const uid = Cookies.get('user_uid')
      const form = new FormData()
      form.append('pd_name', product.pd_name)
      form.append('price', product.price)
      form.append('categories', product.categories)
      form.append('new_level', product.new_level)
      form.append('status', product.status)
      product.images?.forEach(img => img.file && form.append('images', img.file))

      await axios.put(
        `/get/my-second-products/${product.pid}`,
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-UID': uid
          }
        }
      )
      alert('更新成功！')
      this.toggleModal()
      this.loadData()
    } catch (err) {
      console.error('更新失敗：', err)
      alert('更新失敗，請稍後再試')
    }
  }

  handleSearchChange = e =>
    this.setState({ searchTerm: e.target.value })

  renderStatus = s =>
    s === 1
      ? <span className="badge bg-success">上架</span>
      : <span className="badge bg-secondary">下架</span>


  renderCategory = cat =>
  ({
    pet_food: "飼料",
    complementary_food: "副食",
    snacks: "零食",
    Health_Supplements: "保健食品",
    Living_Essentials: "生活家居",
    toys: "玩具"
  }[cat] || cat);

  findProduct = i => this.state.second_product[i] ?? null

  setPage = page => this.setState({ page })

  render() {
    const { second_product, searchTerm, page, pageSize, loading, error, showModal, ModalState, thisIndex } = this.state
    const filtered = second_product.filter(p => p.pd_name.includes(searchTerm))
    const total = filtered.length
    const totalPages = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize
    const paged = filtered.slice(start, start + pageSize)

    return (
      <div className="container-fluid mt-4">
        <h3 className="mb-3">二手商品管理</h3>
        <div className="row mb-3">
          <div className="col-md-3">
            <input
              type="search"
              className="form-control"
              placeholder="搜尋商品名稱"
              value={searchTerm}
              onChange={this.handleSearchChange}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">
            <button className="btn btn-outline-primary" onClick={this.OpenAdd}>上架二手商品</button>
          </div>
        </div>

        {loading && <div>載入中…</div>}
        {error && <div className="text-danger">{error}</div>}

        {!loading && !error && (
          <table className="table table-striped table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th>主圖</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th>類型</th>
                <th>新舊程度</th>
                <th>狀態</th>
                <th>操作</th>
                <th>回報錯誤</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p, idx) => (
                <tr key={p.pid}>
                  <td style={{ width: 80 }}>
                    {p.imageUrl
                      ? <img src={p.imageUrl} alt="主圖" className="img-thumbnail" style={{ width: 60, height: 60 }} />
                      : <span className="text-muted">無圖</span>}
                  </td>
                  <td>{p.pd_name}</td>
                  <td>NT${p.price}</td>
                  <td>{this.renderCategory(p.categories)}</td>
                  <td><PawDisplay rating={Number(p.new_level)} /></td>
                  <td>{this.renderStatus(p.status)}</td>
                  <td>
                    <button className="btn btn-primary btn-sm me-1" onClick={() => this.OpenFound(start+idx)}>查看</button>
                    <button className="btn btn-warning btn-sm me-1" onClick={() => this.OpenEdit(start+idx)}>編輯</button>
                    <button className="btn btn-danger btn-sm" onClick={() => this.Delete(start+idx)}>刪除</button>
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

        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => this.setPage(page - 1)}>上一頁</button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => this.setPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => this.setPage(page + 1)}>下一頁</button>
            </li>
          </ul>
        </nav>

        {showModal && (
          <Market_modal
            condition="second"
            modalState={ModalState}
            product={this.findProduct(thisIndex)}
            new={this.new}
            edit={this.edit}
            close={this.toggleModal}
          />
        )}
      </div>
    )
  }
}
