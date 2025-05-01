import React, { Component } from 'react';
import Market_modal from '../market_manage/Market_Modal';
import Pagination from './Page_manage';
class Second_product_manage extends Component {
    state = {
        showModal: false,
        ModalState: "Add",//Add ,Find ,Edit
        thisIndex: 0,
        currentPage: 1,
        second_product: [
            {
                "pid": "1",//db自動編號
                "status": 1,//上架or下架,新增預設0
                "pet_type": "cat",
                "pd_name": "貓咪抓抓樂跳台",
                "price": 1200,
                "description": "堅固耐用，讓貓咪盡情玩耍的跳台。",
                "categories": "pet_food",
                "city": "台中市",
                "district": "北屯區",
                "uid": "1",
                "new_level": "5",
                "stock": 5,
                "sale_count": 12,
                "delivery_method": "宅配",
                "attribute": {
                    "brand": "喵星人樂園",
                    "name": "抓抓樂",
                    "model": "CT-500",
                    "purchase_date": "2024-05-01",
                    "condition_level": "良好",
                    "size": "60x60x120cm",
                    "color": "米白色",
                    "weight": "7kg"
                },
                "images": [
                    {
                        "img_path": "/catfood.jpg",
                        "img_value": "整體外觀"
                    }, {
                        "img_path": "/catfood.jpg",
                        "img_value": "整體外觀"
                    }, {
                        "img_path": "/catfood.jpg",
                        "img_value": "整體外觀"
                    }, {
                        "img_path": "/catfood.jpg",
                        "img_value": "整體外觀"
                    }
                ]
            },
            {
                "pid": "2",
                "condition": "second",
                "status": 0,
                "pet_type": "dog",
                "pd_name": "大型犬專用睡墊",
                "price": 800,
                "description": "適合大型犬使用的厚實睡墊，舒適又耐咬。",
                "categories": "Living_Essentials",
                "city": "新北市",
                "district": "板橋區",
                "uid": "2",
                "new_level": "1",
                "stock": 3,
                "sale_count": 5,
                "delivery_method": "面交",
                "attribute": {
                    "brand": "汪汪屋",
                    "name": "厚睡墊",
                    "model": "BD-200",
                    "purchase_date": "2023-12-20",
                    "condition_level": "近新",
                    "size": "100x70x10cm",
                    "color": "深灰色",
                    "weight": "3kg"
                },
                "images": [
                    {
                        "img_path": "/cat.jpg",
                        "img_value": "主打圖"
                    },
                    {
                        "img_path": "/media/products/P002/img1.jpg",
                        "img_value": "正面照片"
                    },
                    {
                        "img_path": "/media/products/P002/img2.jpg",
                        "img_value": "材質特寫"
                    },
                    {
                        "img_path": "/media/products/P002/img3.jpg",
                        "img_value": "狗狗實拍"
                    }
                ]

            }
        ]


    }
    componentDidMount() {
        //這裡去抓資料庫的二手商品
    }
    handlePageChange = (page) => {
        this.setState({ currentPage: page });
    }
    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal });
    }
    findProduct = (index) => {
        return this.state.second_product[index] || {}
    }
    renderStatus = (status) => {
        return status === 1
            ? <span className="badge bg-success">上架</span>
            : <span className="badge bg-secondary">下架</span>;
    }

    renderNewLevel = (level) => {
        const stars = '★★★★★'.slice(0, parseInt(level));
        return (
            <span style={{ color: '#FFD700' }}>
                {stars.padEnd(5, '☆')}
            </span>
        );
    }
    renderCategory = (category) => {
        const map = {
            pet_food: "寵物食品",
            complementary_food: "寵物副食",
            snacks: "寵物零食",
            Health_Supplements: "寵物保健品",
            Living_Essentials: "生活用品",
            toys: "寵物玩具"
        };
        return map[category] || category;
    }
    OpenFound = (index) => {
        this.setState({ ModalState: "Find", thisIndex: index });
        this.toggleModal()

    }
    OpenEdit = (index) => {
        this.setState({ ModalState: "Edit", thisIndex: index });
        this.toggleModal()

    }
    OpenAdd = () => {

        this.setState({ ModalState: "Add" });
        this.toggleModal()

    }
    render() {
        let { second_product, showModal, ModalState, thisIndex, currentPage } = this.state
        let itemsPerPage = 1
        let startIndex = (currentPage - 1) * itemsPerPage;
        let currentSPD = second_product.slice(startIndex, startIndex + itemsPerPage);
        return (
            <>
                <form action="">
                    <label htmlFor="sort">搜尋:</label>
                    <input type="search" name="sort" id="sort" />
                </form>
                <button className='btn btn-outline-primary' onClick={this.OpenAdd}>
                    上架商品
                </button>
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
                        {currentSPD.map((product, index) => (
                            <tr key={product.pid}>
                                <td><img src={product.images[0].img_path} alt="主圖" width="80" /></td>
                                <td>{product.pd_name}</td>
                                <td>{product.price}</td>
                                <td>{this.renderCategory(product.categories)}</td>
                                <td>{this.renderNewLevel(product.new_level)}</td>
                                <td>{this.renderStatus(product.status)}</td>
                                <td>
                                    <button className="btn btn-primary btn-sm me-1" onClick={() => this.OpenFound(index)}>查看</button>
                                    <button className="btn btn-warning btn-sm me-1" onClick={() => this.OpenEdit(index)}>編輯</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm(`確定要刪除${product.pd_name}`)) { this.Delete(index) } }}>刪除</button>
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
                {showModal && (

                    <Market_modal close={this.toggleModal} new={this.new} edit={this.edit} product={this.findProduct(thisIndex)} modalstate={ModalState} />

                )}




            </>
        );
    }
    Delete = (index) => {
        // 修改資料庫(delete)
        console.log(this.state.second_product[index].pd_name);

    }
    new = (product) => {//這裡是新增商品儲存後的新商品物件
        console.log(product);
        //這裡去資料庫修改資料(INSERT INTO)
    }
    edit = (product) => {//這裡是修改商品後的商品物件
        console.log(product);
        //這裡去資料庫修改資料(UPDATE)

    }



}

export default Second_product_manage;