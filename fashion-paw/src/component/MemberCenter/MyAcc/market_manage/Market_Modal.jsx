import React, { Component } from 'react';
import axios from 'axios';

export default class MarketModal extends Component {
  constructor(props) {
    super(props);
    const { modalState, condition } = props;
    this.state = {
      modalState, // 'Add' | 'Edit' | 'Find'
      productData: {
        pid: '',
        condition: condition || '',
        status: 0,
        pet_type: '',
        categories: '',
        pd_name: '',
        price: 0,
        description: '',
        city: '',
        district: '',
        uid: '',
        new_level: '',
        stock: 0,
        sale_count: 0,
        attribute: { brand: '', pattern: '', buydate: '', new_level: '', size: '', color: '', weight: '' },
        images: Array(4).fill().map(() => ({ file: null, img_value: '', img_path: '' }))
      }
    };
  }

  componentDidMount() {
    const { modalState, product } = this.props;
    let pd = { ...this.state.productData };
    if ((modalState === 'Edit' || modalState === 'Find') && product) {
      pd = {
        ...pd,
        ...product,
        attribute: { ...product.attribute },
        images: pd.images.map((_, i) => ({
          file: null,
          img_value: product.images?.[i]?.img_value || '',
          img_path: product.images?.[i]?.img_path || ''
        }))
      };
    }
    this.setState({ modalState, productData: pd });
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState(({ productData }) => ({
      productData: { ...productData, [name]: value }
    }));
  };

  handleAttrChange = e => {
    const key = e.target.name.split('.')[1];
    const value = e.target.value;
    this.setState(({ productData }) => ({
      productData: {
        ...productData,
        attribute: { ...productData.attribute, [key]: value }
      }
    }));
  };

  uploadImageAtIndex = (idx, e) => {
    const file = e.target.files[0] || null;
    this.setState(({ productData }) => {
      const images = [...productData.images];
      images[idx] = { ...images[idx], file };
      return { productData: { ...productData, images } };
    });
  };

  handleValueChange = (idx, e) => {
    const img_value = e.target.value;
    this.setState(({ productData }) => {
      const images = [...productData.images];
      images[idx] = { ...images[idx], img_value };
      return { productData: { ...productData, images } };
    });
  };

  handleSubmit = async () => {
    const { modalState, productData } = this.state;
    const { condition, new: onNew, edit: onEdit, close } = this.props;
    // 可以依需求檢查狀態或其他欄位
    const fd = new FormData();
    [
      'pd_name','price','description',
      'pet_type','categories',
      'city','district','new_level',
      'stock','condition','status'
    ].forEach(key => fd.append(key, productData[key]));
    Object.entries(productData.attribute)
      .forEach(([k, v]) => fd.append(`attribute.${k}`, v));
    productData.images.forEach(img => {
      if (img.file) {
        fd.append('images', img.file);
        fd.append('img_value', img.img_value);
      }
    });

    try {
      const base = 'http://localhost:8000';
      const url = modalState === 'Edit'
        ? `${base}/get/${condition}-products/${productData.pid}`
        : `${base}/get/${condition}-products`;
      const method = modalState === 'Edit' ? 'put' : 'post';
      await axios[method](url, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert(modalState === 'Add' ? '新增成功' : '修改成功');
      if (modalState === 'Edit') onEdit && onEdit(productData);
      else window.location.reload();
      close();
    } catch (err) {
      console.error('上傳失敗:', err.response || err);
      alert('上傳失敗，請稍後再試');
    }
  };

  render() {
    const { modalState, productData } = this.state;
    const { close } = this.props;
    const readOnly = modalState === 'Find';

    // 所有欄位設定（包含狀態）
    const allFields = [
      { key: 'status', label: '商品狀態', type: 'select', options: [
          { value: '1', label: '上架' },
          { value: '0', label: '下架' }
        ]
      },
      { key: 'pd_name',     label: '商品名稱', type: 'text' },
      { key: 'price',       label: '價格',     type: 'number' },
      { key: 'description', label: '描述',     type: 'textarea' },
      { key: 'pet_type',    label: '寵物類型', type: 'select', options: ['dog','cat','bird','mouse'] },
      { key: 'categories',  label: '分類',     type: 'select', options: ['pet_food','complementary_food','snacks','Health_Supplements','Living_Essentials','toys'] },
      { key: 'city',        label: '城市',     type: 'text' },
      { key: 'district',    label: '區域',     type: 'text' },
      { key: 'new_level',   label: '新舊程度', type: 'select', options: [
          { value: '5', label: '全新' },
          { value: '4', label: '近新' },
          { value: '3', label: '普通' },
          { value: '2', label: '使用痕跡' },
          { value: '1', label: '明顯磨損' },
        ]
      },
      { key: 'stock',       label: '庫存數量', type: 'number' },
    ];
    // 新品不顯示 city/district/new_level
    const fieldsToShow = allFields.filter(f => {
      if (productData.condition === 'new') {
        return !['city','district','new_level'].includes(f.key);
      }
      return true;
    });
    // 值轉中文
    const optionLabels = {
      dog: '狗狗', cat: '貓咪', bird: '鳥類', mouse: '鼠類',
      pet_food: '寵物食品', complementary_food: '副食品', snacks: '寵物零食',
      Health_Supplements: '寵物保健品', Living_Essentials: '生活用品', toys: '玩具'
    };

    return (
      <div className="modal show d-block" style={{ backgroundColor:'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-scrollable" style={{ maxHeight:'70vh' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {modalState==='Add'?'上架商品':modalState==='Edit'?'編輯商品':'查看商品'}
              </h5>
              <button type="button" className="btn-close" onClick={close}/>
            </div>
            <div className="modal-body">
              {fieldsToShow.map(cfg => {
                const val = productData[cfg.key];
                return (
                  <div className="form-group mb-2" key={cfg.key}>
                    <label>{cfg.label}</label>
                    {cfg.type === 'textarea' ? (
                      <textarea name={cfg.key} className="form-control" value={val} onChange={this.handleChange} disabled={readOnly}/>            
                    ) : cfg.type === 'select' ? (
                      <select name={cfg.key} className="form-control" value={val} onChange={this.handleChange} disabled={readOnly}>
                        <option value="">請選擇</option>
                        {cfg.options.map(opt => {
                          const value = typeof opt==='string'?opt:opt.value;
                          const label = typeof opt==='string'?optionLabels[opt]||opt:opt.label;
                          return <option key={value} value={value}>{label}</option>;
                        })}
                      </select>
                    ) : (
                      <input type={cfg.type} name={cfg.key} className="form-control" value={val} onChange={this.handleChange} disabled={readOnly}/>
                    )}
                  </div>
                );
              })}
              {/* 屬性 Section */}
              <hr />
              <h5>商品屬性</h5>
              {Object.keys(productData.attribute).map(attr => (
                <div className="form-group mb-2" key={attr}>
                  <label>{attr}</label>
                  <input type="text" name={`attribute.${attr}`} className="form-control" value={productData.attribute[attr]} onChange={this.handleAttrChange} disabled={readOnly}/>
                </div>
              ))}
              {/* 圖片 Section */}
              <hr />
              <h5>商品圖片與描述</h5>
              {productData.images.map((img, idx) => {
                const src = img.file ? URL.createObjectURL(img.file) : img.img_path;
                return (
                  <div className="d-flex mb-3" key={idx}>
                    <div style={{ width:80, height:80, marginRight:8 }}>
                      {src && <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>}       
                    </div>
                    <div className="flex-grow-1">
                      <input type="file" accept="image/*" className="form-control form-control-sm mb-1" onChange={e => this.uploadImageAtIndex(idx, e)} disabled={readOnly}/>
                      <input type="text" placeholder="輸入圖片描述" className="form-control form-control-sm" value={img.img_value} onChange={e => this.handleValueChange(idx, e)} disabled={readOnly}/>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={close}>取消</button>
              {!readOnly && <button className="btn btn-primary" onClick={this.handleSubmit}>儲存</button>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
