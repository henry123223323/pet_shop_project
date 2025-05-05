import React, { Component } from 'react';

export default class Market_modal extends Component {
  constructor(props) {
    super(props);
    const mode = props.mode || 'new';
    // Base fields common to both 新品(new) and 二手(second)
    const basePd = {
      pid: "",
      pd_name: "",
      price: 0,
      description: "",
      pet_type: "",
      categories: "",
      stock: 0,              // 庫存數量
      sale_count: 0,
      delivery_method: "",
      attribute: {
        brand: "",
        name: "",
        model: "",
        purchase_date: "",
        condition_level: "",
        size: "",
        color: "",
        weight: ""
      },
      images: Array(4).fill({ img_path: "", img_value: "" })
    };
    // 二手(second)專屬欄位
    const secondFields = {
      city: "",
      district: "",
      new_level: ""
    };
    this.state = {
      modalstate: props.modalstate,
      product: props.product || {},
      add_pd: mode === 'second'
        ? { ...basePd, ...secondFields }
        : basePd
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    this.setState(prev => {
      const key = prev.modalstate === 'Add' ? 'add_pd' : 'product';
      const updated = { ...prev[key] };
      if (keys.length === 1) {
        updated[keys[0]] = value;
      } else if (keys.length === 2) {
        updated[keys[0]] = { ...updated[keys[0]], [keys[1]]: value };
      }
      return { [key]: updated };
    });
  }

  handleArrayChange = (index, field, value) => {
    this.setState(prev => {
      const key = prev.modalstate === 'Add' ? 'add_pd' : 'product';
      const updated = { ...prev[key] };
      if (Array.isArray(updated.images)) {
        const imgs = [...updated.images];
        imgs[index] = { ...imgs[index], [field]: value };
        updated.images = imgs;
      }
      return { [key]: updated };
    });
  }

  renderImageFields(images, disabled = false) {
    if (!Array.isArray(images)) return null;
    return images.map((img, idx) => (
      <div key={idx} className="border rounded p-2 mb-2">
        <div className="form-group mb-2">
          <label>圖片路徑 {idx + 1}</label>
          <input
            type="text"
            className="form-control"
            value={img.img_path}
            onChange={e => this.handleArrayChange(idx, 'img_path', e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="form-group mb-2">
          <label>圖片描述 {idx + 1}</label>
          <input
            type="text"
            className="form-control"
            value={img.img_value}
            onChange={e => this.handleArrayChange(idx, 'img_value', e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
    ));
  }

  renderForm(product, disabled = false) {
    const { mode } = this.props;
    const attrs = product.attribute || {};
    return (
      <>
        <h4>基本資料</h4>
        <div className="form-group mb-2">
          <label>商品名稱</label>
          <input
            type="text"
            className="form-control"
            name="pd_name"
            value={product.pd_name || ''}
            onChange={this.handleChange}
            disabled={disabled}
          />
        </div>
        <div className="form-group mb-2">
          <label>價格</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={product.price || 0}
            onChange={this.handleChange}
            disabled={disabled}
          />
        </div>
        {/* 新增：庫存數量 */}
        <div className="form-group mb-2">
          <label>進貨量</label>
          <input
            type="number"
            className="form-control"
            name="stock"
            value={product.stock || 0}
            onChange={this.handleChange}
            disabled={disabled}
          />
        </div>
        <div className="form-group mb-2">
          <label>描述</label>
          <textarea
            className="form-control"
            name="description"
            value={product.description || ''}
            onChange={this.handleChange}
            disabled={disabled}
          />
        </div>
        <div className="form-group mb-2">
          <label>寵物類型</label>
          <select
            className="form-control"
            name="pet_type"
            value={product.pet_type || ''}
            onChange={this.handleChange}
            disabled={disabled}
          >
            <option value="">請選擇</option>
            <option value="dog">狗狗</option>
            <option value="cat">貓咪</option>
            <option value="bird">鳥類</option>
            <option value="mouse">鼠類</option>
          </select>
        </div>
        <div className="form-group mb-2">
          <label>分類</label>
          <select
            className="form-control"
            name="categories"
            value={product.categories || ''}
            onChange={this.handleChange}
            disabled={disabled}
          >
            <option value="">請選擇</option>
            <option value="pet_food">寵物食品</option>
            <option value="complementary_food">副食品</option>
            <option value="snacks">寵物零食</option>
            <option value="Health_Supplements">健康保健品</option>
            <option value="Living_Essentials">生活用品</option>
            <option value="toys">寵物玩具</option>
          </select>
        </div>
        {mode === 'second' && (
          <>
            <div className="form-group mb-2">
              <label>配送方式</label>
              <select
                className="form-control"
                name="delivery_method"
                value={product.delivery_method || ''}
                onChange={this.handleChange}
                disabled={disabled}
              >
                <option value="">請選擇</option>
                <option value="宅配">宅配</option>
                <option value="面交">面交</option>
              </select>
            </div>
            <hr />
            <h4>地理 & 折舊</h4>
            <div className="form-group mb-2">
              <label>城市</label>
              <input
                type="text"
                className="form-control"
                name="city"
                value={product.city || ''}
                onChange={this.handleChange}
                disabled={disabled}
              />
            </div>
            <div className="form-group mb-2">
              <label>區域</label>
              <input
                type="text"
                className="form-control"
                name="district"
                value={product.district || ''}
                onChange={this.handleChange}
                disabled={disabled}
              />
            </div>
            <div className="form-group mb-2">
              <label>折舊程度</label>
              <select
                className="form-control"
                name="new_level"
                value={product.new_level || ''}
                onChange={this.handleChange}
                disabled={disabled}
              >
                <option value="">請選擇</option>
                <option value="5">全新</option>
                <option value="4">近新</option>
                <option value="3">普通</option>
                <option value="2">使用痕跡</option>
                <option value="1">明顯磨損</option>
              </select>
            </div>
          </>
        )}
        <hr />
        <h4>商品屬性</h4>
        {Object.keys(attrs).map(attr => (
          <div key={attr} className="form-group mb-2">
            <label>{attr}</label>
            <input
              type="text"
              className="form-control"
              name={`attribute.${attr}`}
              value={attrs[attr]}
              onChange={this.handleChange}
              disabled={disabled}
            />
          </div>
        ))}
        <hr />
        <h4>商品圖片</h4>
        {this.renderImageFields(product.images, disabled)}
      </>
    );
  }

  render() {
    const { modalstate } = this.state;
    const { close, mode, new: onCreate, edit: onEdit } = this.props;
    const current = modalstate === 'Add' ? this.state.add_pd : this.state.product;
    const isReadOnly = modalstate === 'Find';

    return (
      <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-scrollable" style={{ maxHeight: '70vh' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {modalstate === 'Add'
                  ? (mode === 'second' ? '二手上架' : '新品上架')
                  : modalstate === 'Edit'
                  ? '編輯商品'
                  : '查看商品'}
              </h5>
              <button type="button" className="btn-close" onClick={close}></button>
            </div>
            <div className="modal-body" style={{ overflowY: 'auto' }}>
              <form>{this.renderForm(current, isReadOnly)}</form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={close}>取消</button>
              {modalstate !== 'Find' && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    modalstate === 'Add'
                      ? onCreate(current)
                      : onEdit(current);
                    close();
                  }}
                >儲存</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}