// src/component/MemberCenter/MyAcc/manage_market.jsx
import React, { Component } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Market_modal from './market_manage/Market_Modal'

export default class ManageMarket extends Component {
  state = {
    second_product: [],
    searchTerm: '',
    showModal: false,
    ModalState: 'Add',  // 'Add' | 'Find' | 'Edit'
    thisIndex: -1,
    loading: false,
    error: null,
  }

  componentDidMount() {
    this.loadData()
  }

  loadData = async () => {
    this.setState({ loading: true, error: null })
    try {
      const uid = Cookies.get('user_uid')
      if (!uid) throw new Error('請先登入')
      const res = await axios.get(
        '/get/my-second-products',
        {
          headers: { 'X-UID': uid }
        }
      )
      this.setState({ second_product: res.data, loading: false })
    } catch (err) {
      console.error('讀取失敗：', err)
      this.setState({ error: '無法取得商品', loading: false })
    }
  }

  toggleModal = () =>
    this.setState(s => ({ showModal: !s.showModal }))

  OpenAdd = () => this.setState({ ModalState: 'Add', thisIndex: -1 }, this.toggleModal)
  OpenFound = i => this.setState({ ModalState: 'Find', thisIndex: i }, this.toggleModal)
  OpenEdit = i => this.setState({ ModalState: 'Edit', thisIndex: i }, this.toggleModal)

  Delete = async i => {
    const { pid, pd_name } = this.state.second_product[i] || {}
    if (!pid || !window.confirm(`確定刪除 ${pd_name}？`)) return
    try {
      const uid = Cookies.get('user_uid')
      await axios.delete(
        `/get/my-second-products/${pid}`,
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
      form.append('uid', uid)
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

  renderNewLevel = lvl => {
    const stars = '★★★★★'.slice(0, +lvl).padEnd(5, '☆')
    return <span style={{ color: '#FFD700' }}>{stars}</span>
  }

  renderCategory = cat =>
  ({
    pet_food: "飼料",
    complementary_food: "副食",
    snacks: "零食",
    Health_Supplements: "保健食品",
    Living_Essentials: "生活家居",
    toys: "玩具",
  }[cat] ?? cat)

  findProduct = i =>
    this.state.second_product[i] ?? null

  render() {
    const {
      second_product,
      loading, error,
      showModal, ModalState,
      thisIndex, searchTerm
    } = this.state

    const filtered = second_product.filter(p =>
      p.pd_name.includes(searchTerm)
    )

    return (
      <>
        {/* 搜尋欄 */}
        <div className="mb-3" style={{ maxWidth: 200 }}>
          <input
            type="search"
            className="form-control"
            placeholder="搜尋商品名稱"
            value={searchTerm}
            onChange={this.handleSearchChange}
          />
        </div>

        {/* 上架按鈕 */}
        <div className="mb-3">
          <button
            className="btn btn-outline-primary"
            onClick={this.OpenAdd}
          >
            上架二手商品
          </button>
        </div>

        {loading && <div>載入中…</div>}
        {error && <div className="text-danger">{error}</div>}

        {!loading && !error && (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>主圖</th><th>名稱</th><th>價格</th>
                <th>類型</th><th>新舊程度</th><th>狀態</th><th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.pid}>
                  <td>
                    {p.imageUrl
                      ? <img
                        src={p.imageUrl}
                        alt=""
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                      />
                      : <span className="text-muted">無圖</span>
                    }
                  </td>
                  <td>{p.pd_name}</td>
                  <td>{p.price}</td>
                  <td>{this.renderCategory(p.categories)}</td>
                  <td>{this.renderNewLevel(p.new_level)}</td>
                  <td>{this.renderStatus(p.status)}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-1" onClick={() => this.OpenFound(i)}>查看</button>
                    <button className="btn btn-sm btn-warning me-1" onClick={() => this.OpenEdit(i)}>編輯</button>
                    <button className="btn btn-sm btn-danger" onClick={() => this.Delete(i)}>刪除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

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
      </>
    )
  }
}
