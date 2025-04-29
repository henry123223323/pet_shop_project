import React, { Component } from 'react';
class NewPD_modal extends Component {
    state = {
        modalstate: this.props.modalstate,
        product: this.props.product,
        add_pd: {
            "pid": "",
            "condition": "",
            "status": 0,
            "pet_type": "",
            "pd_name": "",
            "price": 0,
            "description": "",
            "categories": "",
            "stock": 0,
            "sale_count": 0,
            "attribute": {
                "brand": "",
                "name": "",
                "model": "",
                "purchase_date": "",
                "condition_level": "",
                "size": "",
                "color": "",
                "weight": ""
            },
            "images": {
                "point_area": {
                    "img_path": "",
                    "img_value": ""
                },
                "content_area": [
                    {
                        "img_path": "",
                        "img_value": ""
                    },
                    {
                        "img_path": "",
                        "img_value": ""
                    },
                    {
                        "img_path": "",
                        "img_value": ""
                    }
                ]
            }
        }

    }
    handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.'); // 支援多層名稱（例如 attribute.brand）

        this.setState(prevState => {
            if (this.state.modalstate === "Add") {
                let add_product = { ...prevState.add_pd }; // 複製一份 add_product
                if (keys.length === 1) {
                    add_product[keys[0]] = value; // 只有一層 (比如 pd_name)
                } else if (keys.length === 2) {
                    add_product[keys[0]][keys[1]] = value; // 兩層 (比如 attribute.brand)
                } else if (keys.length === 3) {
                    add_product[keys[0]][keys[1]][keys[2]] = value; // 三層 (比如 images.point_area.img_path)
                }

                return { add_pd: add_product }


            } else {

                let product = { ...prevState.product }; // 複製一份 product
                if (keys.length === 1) {
                    product[keys[0]] = value; // 只有一層 (比如 pd_name)
                } else if (keys.length === 2) {
                    product[keys[0]][keys[1]] = value; // 兩層 (比如 attribute.brand)
                } else if (keys.length === 3) {
                    product[keys[0]][keys[1]][keys[2]] = value; // 三層 (比如 images.point_area.img_path)
                }

                return { product };
            }


        });
    }
    componentDidUpdate() {
        console.log(this.state.add_pd);

    }
    handleArrayChange = (index, field, value) => {
        this.setState(prevState => {
            let product = { ...prevState.product };
            product.images.content_area[index][field] = value;
            return { product };
        });
    }

    render() {
        let { modalstate, product, add_pd } = this.state
        let { close } = this.props
        if (modalstate === "Edit") {
            return (
                <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-scrollable" style={{ maxHeight: '70vh' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">編輯商品</h5>
                            </div>

                            <div className="modal-body" style={{ overflowY: 'auto' }}>
                                <form>

                                    <h4>基本資料</h4>
                                    <div className="form-group mb-2">
                                        <label>商品名稱</label>
                                        <input type="text" className="form-control" name="pd_name" value={product.pd_name} onChange={this.handleChange} />
                                    </div>

                                    <div className="form-group mb-2">
                                        <label>價格</label>
                                        <input type="number" className="form-control" name="price" value={product.price} onChange={this.handleChange} />
                                    </div>

                                    <div className="form-group mb-2">
                                        <label>描述</label>
                                        <textarea className="form-control" name="description" value={product.description} onChange={this.handleChange} />
                                    </div>

                                    <div className="form-group mb-2">
                                        <label>寵物類型</label>
                                        <select className="form-control" name="pet_type" value={product.pet_type} onChange={this.handleChange}>
                                            <option value="">請選擇</option>
                                            <option value="dog">狗狗</option>
                                            <option value="cat">貓咪</option>
                                            <option value="bird">鳥類</option>
                                            <option value="mouse">鼠類</option>
                                        </select>
                                    </div>

                                    <div className="form-group mb-2">
                                        <label>分類</label>
                                        <select className="form-control" name="categories" value={product.categories} onChange={this.handleChange}>
                                            <option value="">請選擇</option>
                                            <option value="pet_food">寵物食品</option>
                                            <option value="complementary_food">寵物副食</option>
                                            <option value="snacks">寵物零食</option>
                                            <option value="Health_Supplements">寵物保健品</option>
                                            <option value="Living_Essentials">生活用品</option>
                                            <option value="toys">寵物玩具</option>
                                        </select>
                                    </div>


                                    <div className="form-group mb-2">
                                        <label>庫存數量</label>
                                        <input type="number" className="form-control" name="stock" value={product.stock} onChange={this.handleChange} />
                                    </div>


                                    <hr />
                                    <h4>商品屬性</h4>
                                    {Object.keys(product.attribute).map(attr => (
                                        <div className="form-group mb-2" key={attr}>
                                            <label>{attr}</label>
                                            <input type="text" className="form-control" name={`attribute.${attr}`} value={product.attribute[attr]} onChange={this.handleChange} />
                                        </div>
                                    ))}

                                    <hr />
                                    <h4>商品圖片</h4>
                                    <div className="form-group mb-2">
                                        <label>主打圖 img_path</label>
                                        <input type="text" className="form-control" name="images.point_area.img_path" value={product.images.point_area.img_path} onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group mb-2">
                                        <label>主打圖 img_value</label>
                                        <input type="text" className="form-control" name="images.point_area.img_value" value={product.images.point_area.img_value} onChange={this.handleChange} />
                                    </div>

                                    <h5 className="mt-3">內容區圖片</h5>
                                    {product.images.content_area.map((img, index) => (
                                        <div key={index} className="border rounded p-2 mb-2">
                                            <div className="form-group mb-2">
                                                <label>圖片路徑 {index + 1}</label>
                                                <input type="text" className="form-control" value={img.img_path} onChange={(e) => this.handleArrayChange(index, 'img_value', e.target.value)} />
                                            </div>
                                            <div className="form-group mb-2">
                                                <label>圖片描述 {index + 1}</label>
                                                <input type="text" className="form-control" value={img.img_value} onChange={(e) => this.handleArrayChange(index, 'img_value', e.target.value)} />
                                            </div>
                                        </div>
                                    ))}

                                </form>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={close}>取消</button>
                                <button type="submit" className="btn btn-primary" onClick={() => { this.props.edit(product); close(); }}>儲存</button>
                            </div>
                        </div>
                    </div>
                </div>

            );
        }
        else if (modalstate === "Add") {
            return (
                <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-scrollable" style={{ maxHeight: '70vh' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">上架商品</h5>
                                <button type="button" className="btn-close" onClick={this.toggleModal}></button>
                            </div>

                            <div className="modal-body" style={{ overflowY: 'auto' }}>
                                <form>

                                    <h4>基本資料</h4>
                                    <div className="form-group mb-2">
                                        <label>商品名稱</label>
                                        <input type="text" className="form-control" name="pd_name" onChange={this.handleChange} />
                                    </div>

                                    <div className="form-group mb-2">
                                        <label>價格</label>
                                        <input type="number" className="form-control" name="price" onChange={this.handleChange} />
                                    </div>

                                    <div className="form-group mb-2">
                                        <label>描述</label>
                                        <textarea className="form-control" name="description" onChange={this.handleChange} />
                                    </div>

                                    <div className="form-group mb-2">
                                        <label>寵物類型</label>
                                        <select className="form-control" name="pet_type" onChange={this.handleChange}>
                                            <option value="">請選擇</option>
                                            <option value="dog">狗狗</option>
                                            <option value="cat">貓咪</option>
                                            <option value="bird">鳥類</option>
                                            <option value="mouse">鼠類</option>
                                        </select>
                                    </div>

                                    <div className="form-group mb-2">
                                        <label>分類</label>
                                        <select className="form-control" name="categories" onChange={this.handleChange}>
                                            <option value="">請選擇</option>
                                            <option value="pet_food">寵物食品</option>
                                            <option value="complementary_food">寵物副食</option>
                                            <option value="snacks">寵物零食</option>
                                            <option value="Health_Supplements">寵物保健品</option>
                                            <option value="Living_Essentials">生活用品</option>
                                            <option value="toys">寵物玩具</option>
                                        </select>
                                    </div>


                                    <div className="form-group mb-2">
                                        <label>庫存數量</label>
                                        <input type="number" className="form-control" name="stock" onChange={this.handleChange} />
                                    </div>


                                    <hr />
                                    <h4>商品屬性</h4>
                                    {Object.keys(product.attribute).map(attr => (
                                        <div className="form-group mb-2" key={attr}>
                                            <label>{attr}</label>
                                            <input type="text" className="form-control" name={`attribute.${attr}`} onChange={this.handleChange} />
                                        </div>
                                    ))}

                                    <hr />
                                    <h4>商品圖片</h4>
                                    <div className="form-group mb-2">
                                        <label>主打圖 img_path</label>
                                        <input type="text" className="form-control" name="images.point_area.img_path" onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group mb-2">
                                        <label>主打圖 img_value</label>
                                        <input type="text" className="form-control" name="images.point_area.img_value" onChange={this.handleChange} />
                                    </div>

                                    <h5 className="mt-3">內容區圖片</h5>
                                    {product.images.content_area.map((img, index) => (
                                        <div key={index} className="border rounded p-2 mb-2">
                                            <div className="form-group mb-2">
                                                <label>圖片路徑 {index + 1}</label>
                                                <input type="text" className="form-control" />
                                            </div>
                                            <div className="form-group mb-2">
                                                <label>圖片描述 {index + 1}</label>
                                                <input type="text" className="form-control" onChange={(e) => this.handleArrayChange(index, 'img_value', e.target.value)} />
                                            </div>
                                        </div>
                                    ))}

                                </form>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={close}>取消</button>
                                <button type="submit" className="btn btn-primary" onClick={() => { this.props.new(add_pd); close() }}>儲存</button>
                            </div>
                        </div>
                    </div>
                </div>

            );

        }
        else if (modalstate === "Find") {
            return (
                <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-scrollable" style={{ maxHeight: '70vh' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">查看商品</h5>
                                <button type="button" className="btn-close" onClick={this.toggleModal}></button>
                            </div>

                            <div className="modal-body" style={{ overflowY: 'auto' }}>
                                <form>

                                    <h4>基本資料</h4>
                                    <div className="form-group mb-2">
                                        <label>商品名稱</label>
                                        <input type="text" className="form-control" name="pd_name" value={product.pd_name} disabled />
                                    </div>

                                    <div className="form-group mb-2">
                                        <label>價格</label>
                                        <input type="number" className="form-control" name="price" value={product.price} disabled />
                                    </div>

                                    <div className="form-group mb-2">
                                        <label>描述</label>
                                        <textarea className="form-control" name="description" value={product.description} disabled />
                                    </div>

                                    <div className="form-group mb-2">
                                        <label>寵物類型</label>
                                        <select className="form-control" name="pet_type" value={product.pet_type} disabled >
                                            <option value="">請選擇</option>
                                            <option value="dog">狗狗</option>
                                            <option value="cat">貓咪</option>
                                            <option value="bird">鳥類</option>
                                            <option value="mouse">鼠類</option>
                                        </select>
                                    </div>

                                    <div className="form-group mb-2">
                                        <label>分類</label>
                                        <select className="form-control" name="categories" value={product.categories} disabled>
                                            <option value="">請選擇</option>
                                            <option value="pet_food">寵物食品</option>
                                            <option value="complementary_food">寵物副食</option>
                                            <option value="snacks">寵物零食</option>
                                            <option value="Health_Supplements">寵物保健品</option>
                                            <option value="Living_Essentials">生活用品</option>
                                            <option value="toys">寵物玩具</option>
                                        </select>
                                    </div>



                                    <div className="form-group mb-2">
                                        <label>庫存數量</label>
                                        <input type="number" className="form-control" name="stock" value={product.stock} disabled />
                                    </div>

                                    <hr />
                                    <h4>商品屬性</h4>
                                    {Object.keys(product.attribute).map(attr => (
                                        <div className="form-group mb-2" key={attr}>
                                            <label>{attr}</label>
                                            <input type="text" className="form-control" name={`attribute.${attr}`} value={product.attribute[attr]} disabled />
                                        </div>
                                    ))}

                                    <hr />
                                    <h4>商品圖片</h4>
                                    <div className="form-group mb-2">
                                        <label>主打圖 img_path</label>
                                        <input type="text" className="form-control" name="images.point_area.img_path" value={product.images.point_area.img_path} disabled />
                                    </div>
                                    <div className="form-group mb-2">
                                        <label>主打圖 img_value</label>
                                        <input type="text" className="form-control" name="images.point_area.img_value" value={product.images.point_area.img_value} disabled />
                                    </div>

                                    <h5 className="mt-3">內容區圖片</h5>
                                    {product.images.content_area.map((img, index) => (
                                        <div key={index} className="border rounded p-2 mb-2">
                                            <div className="form-group mb-2">
                                                <label>圖片路徑 {index + 1}</label>
                                                <input type="text" className="form-control" value={img.img_path} disabled />
                                            </div>
                                            <div className="form-group mb-2">
                                                <label>圖片描述 {index + 1}</label>
                                                <input type="text" className="form-control" value={img.img_value} disabled />
                                            </div>
                                        </div>
                                    ))}

                                </form>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={close}>關閉</button>
                            </div>
                        </div>
                    </div>
                </div>

            );

        }
    }

}

export default NewPD_modal;