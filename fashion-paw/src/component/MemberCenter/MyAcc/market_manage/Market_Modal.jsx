import React, { Component } from 'react';

class Market_modal extends Component {
    state = {
        modalstate: this.props.modalstate,
        product: this.props.product,
        add_pd: {
            pid: "",
            condition: "",
            status: 0,
            pet_type: "",
            pd_name: "",
            price: 0,
            description: "",
            categories: "",
            city: "",
            district: "",
            uid: "",
            new_level: "",
            stock: 0,
            sale_count: 0,

            attribute: {
                brand: "",
                pattern: "",
                buydate: "",
                new_level: "",
                size: "",
                color: "",
                weight: ""
            },
            images: [
                { img_path: null, img_value: "" },
                { img_path: null, img_value: "" },
                { img_path: null, img_value: "" },
                { img_path: null, img_value: "" }
            ]
        }
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');

        this.setState(prevState => {
            const key = prevState.modalstate === "Add" ? "add_pd" : "product";
            const updated = { ...prevState[key] };
            if (keys.length === 1) {
                updated[keys[0]] = value;
            } else if (keys.length === 2) {
                if (!updated[keys[0]]) updated[keys[0]] = {};
                updated[keys[0]][keys[1]] = value;
            }
            return { [key]: updated };
        });
    };

    handleArrayChange = (index, field, value) => {
        const key = this.state.modalstate === "Add" ? "add_pd" : "product";
        this.setState(prevState => {
            const updated = { ...prevState[key] };
            if (Array.isArray(updated.images) && updated.images[index]) {
                updated.images[index][field] = value;
            }
            return { [key]: updated };
        });
    };

    uploadImages = (e) => {
        const file = e.target.files[0];
        const index = parseInt(e.target.getAttribute("data-index"), 10);

        const key = this.state.modalstate === "Add" ? "add_pd" : "product";
        this.setState(prevState => {
            const updated = { ...prevState[key] };
            if (!Array.isArray(updated.images)) updated.images = [];
            while (updated.images.length < 4) {
                updated.images.push({ img_path: null, img_value: "" });
            }
            updated.images[index].img_path = file;
            return { [key]: updated };
        });
    };

    renderImageFields = (images = [], disabled = false) => {
        const imgs = Array.isArray(images) ? images.slice() : [];
        while (imgs.length < 4) imgs.push({ img_path: null, img_value: "" });
        return imgs.map((img, index) => (
            <div key={index} className="border rounded p-2 mb-2">
                <div className="form-group mb-2">
                    <label>圖片路徑 {index + 1}</label>
                    <input
                        type="file"
                        data-index={index}
                        className="form-control"
                        onChange={this.uploadImages}
                        disabled={disabled}
                    />
                </div>
                <div className="form-group mb-2">
                    <label>圖片描述 {index + 1}</label>
                    <input
                        type="text"
                        className="form-control"
                        value={img.img_value || ''}
                        onChange={e => this.handleArrayChange(index, 'img_value', e.target.value)}
                        disabled={disabled}
                    />
                </div>
            </div>
        ));
    };

    renderForm = (product = {}, disabled = false) => {
        const defaultAttrs = Object.keys(this.state.add_pd.attribute);
        const attrs = product.attribute && Object.keys(product.attribute).length > 0
            ? Object.keys(product.attribute)
            : defaultAttrs;
        const images = product.images || [];

        return (
            <>
                <h4>基本資料</h4>
                <div className="form-group mb-2">
                    <label>商品名稱</label>
                    <input
                        type="text"
                        className="form-control"
                        name="pd_name"
                        value={product.pd_name}
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
                        value={product.price}
                        onChange={this.handleChange}
                        disabled={disabled}
                    />
                </div>
                <div className="form-group mb-2">
                    <label>描述</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={product.description}
                        onChange={this.handleChange}
                        disabled={disabled}
                    />
                </div>
                <div className="form-group mb-2">
                    <label>寵物類型</label>
                    <select
                        className="form-control"
                        name="pet_type"
                        value={product.pet_type}
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
                        value={product.categories}
                        onChange={this.handleChange}
                        disabled={disabled}
                    >
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
                    <label>城市</label>
                    <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={product.city}
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
                        value={product.district}
                        onChange={this.handleChange}
                        disabled={disabled}
                    />
                </div>
                <div className="form-group mb-2">
                    <label>新舊程度 (1-5)</label>
                    <select
                        className="form-control"
                        name="new_level"
                        value={product.new_level}
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
                <div className="form-group mb-2">
                    <label>庫存數量</label>
                    <input
                        type="number"
                        className="form-control"
                        name="stock"
                        value={product.stock}
                        onChange={this.handleChange}
                        disabled={disabled}
                    />
                </div>
                <hr />
                <h4>商品屬性</h4>
                {attrs.map(attr => (
                    <div className="form-group mb-2" key={attr}>
                        <label>{attr}</label>
                        <input
                            type="text"
                            className="form-control"
                            name={`attribute.${attr}`}
                            value={(product.attribute||{})[attr]}
                            onChange={this.handleChange}
                            disabled={disabled}
                        />
                    </div>
                ))}
                <hr />
                <h4>商品圖片</h4>
                {this.renderImageFields(images, disabled)}
            </>
        );
    };

    render() {
        const { modalstate, product, add_pd } = this.state;
        const { close } = this.props;
        const currentProduct = modalstate === "Add" ? add_pd : product;
        const isReadOnly = modalstate === "Find";

        return (
            <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-scrollable" style={{ maxHeight: '70vh' }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {modalstate === "Add" ? "上架商品" : modalstate === "Edit" ? "編輯商品" : "查看商品"}
                            </h5>
                            <button type="button" className="btn-close" onClick={close}></button>
                        </div>
                        <div className="modal-body" style={{ overflowY: 'auto' }}>
                            <form>{this.renderForm(currentProduct, isReadOnly)}</form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={close}>取消</button>
                            {modalstate !== "Find" && (
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        modalstate === "Add"
                                            ? this.props.new(add_pd)
                                            : this.props.edit(product);
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

export default Market_modal;
