import React, { Component } from 'react';
import axios from 'axios';

export default class MarketModal extends Component {
  constructor(props) {
    super(props);
    const { modalState, condition, product } = props;
    this.state = {
      modalState, // 'Add' | 'Edit' | 'Find'
      productData: {
        pid: product?.pid || '',
        condition: condition || product?.condition || '',
        status: product?.status || 0,
        pet_type: product?.pet_type || '',
        categories: product?.categories || '',
        pd_name: product?.pd_name || '',
        price: product?.price || 0,
        description: product?.description || '',
        city: product?.city || '',
        district: product?.district || '',
        uid: product?.uid || '',
        new_level: product?.new_level || '',
        stock: product?.stock || 0,
        sale_count: product?.sale_count || 0,
        attribute: { brand: '', pattern: '', name: '', model: '', buydate: '', size: '', color: '', weight: '' , ...product?.attribute},
        images: Array(4).fill().map((_, i) => ({
          file: null,
          img_value: product?.images?.[i]?.img_value || '',
          img_path: product?.images?.[i]?.img_path || ''
        }))
      }
    };
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState(({ productData }) => ({
      productData: { ...productData, [name]: value }
    }));
  };

  handleAttrChange = e => {
    const [, key] = e.target.name.split('.');
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

  handleDelete = async () => {
    const { productData } = this.state;
    const { deleteUrl, getHeaders, onDeleted } = this.props;
    if (!window.confirm(`確定刪除 ${productData.pd_name}？`)) return;
    try {
      const headers = getHeaders?.() || {};
      await axios.delete(`${deleteUrl}/${productData.pid}`, { headers });
      alert('刪除成功');
      onDeleted && onDeleted(productData.pid);
      this.props.close();
    } catch (err) {
      console.error('刪除失敗：', err);
      alert('刪除失敗，請稍後再試');
    }
  };

  handleSubmit = async () => {
    const { modalState, productData } = this.state;
    const { submitUrl, updateUrl, getHeaders, onSaved } = this.props;
    const fd = new FormData();
    // 基本欄位
    ['pd_name','price','description','pet_type','categories','city','district','new_level','status','condition','stock','uid','pid']
      .forEach(key => productData[key] !== undefined && fd.append(key, productData[key]));
    // 屬性
    Object.entries(productData.attribute).forEach(([k,v]) => fd.append(`attribute.${k}`, v));
    // 圖片
    productData.images.forEach(img => {
      if (img.file) {
        fd.append('images', img.file);
        fd.append('img_value', img.img_value);
      }
    });

    try {
      const headers = getHeaders?.() || {};
      const url = modalState === 'Edit'
        ? `${updateUrl}/${productData.pid}`
        : submitUrl;
      const method = modalState === 'Edit' ? 'put' : 'post';
      await axios[method](url, fd, { headers });
      alert(modalState === 'Edit' ? '更新成功' : '新增成功');
      onSaved && onSaved();
      this.props.close();
    } catch (err) {
      console.error('上傳失敗：', err);
      alert(`上傳失敗：${err.response?.data?.error || err.message}`);
    }
  };

  render() {
    const { modalState, productData } = this.state;
    const { close } = this.props;
    const readOnly = modalState === 'Find';

    const allFields = [
      { key: 'status', label: '商品狀態', type: 'select', options: [{ value:'1', label:'上架' },{ value:'0',label:'下架'}] },
      { key: 'pd_name', label: '商品名稱', type: 'text' },
      { key: 'price', label: '價格', type: 'number' },
      { key: 'description', label: '描述', type: 'textarea' },
      { key: 'pet_type', label: '寵物類型', type: 'select', options:['dog','cat','bird','mouse'] },
      { key: 'categories', label: '分類', type: 'select', options:['pet_food','complementary_food','snacks','Health_Supplements','Living_Essentials','toys'] },
      { key: 'city', label: '城市', type: 'text' },
      { key: 'district', label: '區域', type: 'text' },
      { key: 'new_level', label: '新舊程度', type: 'select', options:['5','4','3','2','1'] },
      { key: 'stock', label: '庫存數量', type: 'number' }
    ];

    const optionLabels = {
      dog:'狗狗',cat:'貓咪',bird:'鳥類',mouse:'鼠類',
      pet_food:'飼料',complementary_food:'副食',snacks:'零食',
      Health_Supplements:'保健食品',Living_Essentials:'生活家居',toys:'玩具'
    };

    const fieldsToShow = allFields.filter(f => {
      if (productData.condition === 'new') return !['city','district','new_level'].includes(f.key);
      return true;
    });

    const attrKeys = Object.keys(productData.attribute);

    return (
      <div className="modal show d-block" style={{ backgroundColor:'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{modalState==='Add'?'上架商品':modalState==='Edit'?'編輯商品':'查看商品'}</h5>
              <button className="btn-close" onClick={close} />
            </div>
            <div className="modal-body">
              {fieldsToShow.map(cfg => {
                const val = productData[cfg.key];
                return (
                  <div className="mb-2" key={cfg.key}>
                    <label>{cfg.label}</label>
                    {cfg.type==='textarea'? (
                      <textarea name={cfg.key} className="form-control" value={val} onChange={this.handleChange} disabled={readOnly} />
                    ) : cfg.type==='select'? (
                      <select name={cfg.key} className="form-control" value={val} onChange={this.handleChange} disabled={readOnly}>
                        <option value="">請選擇</option>
                        {cfg.options.map(opt=>{
                          const v=opt.value||opt; const l=opt.label||optionLabels[opt]||opt;
                          return <option key={v} value={v}>{l}</option>;
                        })}
                      </select>
                    ) : (
                      <input type={cfg.type} name={cfg.key} className="form-control" value={val} onChange={this.handleChange} disabled={readOnly} />
                    )}
                  </div>
                );
              })}
              <hr />
              <h5>商品屬性</h5>
              {attrKeys.map(attr=>(
                <div className="mb-2" key={attr}>
                  <label>{attr}</label>
                  <input type="text" name={`attribute.${attr}`} className="form-control" value={productData.attribute[attr]} onChange={this.handleAttrChange} disabled={readOnly} />
                </div>
              ))}
              <hr />
              <h5>商品圖片與描述</h5>
              {productData.images.map((img, idx)=>(
                <div className="d-flex mb-3" key={idx}>
                  <div style={{width:80,height:80,marginRight:8}}>
                    {img.img_path||img.file? <img src={img.file?URL.createObjectURL(img.file):img.img_path} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:null}
                  </div>
                  <div className="flex-grow-1">
                    <input type="file" accept="image/*" className="form-control form-control-sm mb-1" onChange={e=>this.uploadImageAtIndex(idx,e)} disabled={readOnly} />
                    <input type="text" placeholder="輸入圖片描述" className="form-control form-control-sm" value={img.img_value} onChange={e=>this.handleValueChange(idx,e)} disabled={readOnly} />
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              {!readOnly && <button className="btn btn-primary" onClick={this.handleSubmit}>儲存</button>}
              <button className="btn btn-secondary" onClick={close}>取消</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
