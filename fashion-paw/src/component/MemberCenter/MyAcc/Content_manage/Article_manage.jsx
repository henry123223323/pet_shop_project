import React, { Component } from 'react';
import Pagination from './Page_manage';
import axios from 'axios';
class Article_manage extends Component {
    state = {
        show: false,
        thisIndex: 0,
        currentPage: 1,
        emptyAOBJ: {
            ArticleID: 1,
            title: "",
            banner_URL: "",
            intro: "",
            pet_type: "",
            product_category: "",
            sections: [],
            create_at: ""
        },
        article: [
            {
                ArticleID: 1,
                title: "標題一",
                banner_URL: "/cat.jpg",
                intro: "介紹一",
                pet_type: "dog",
                product_category: "toys",
                sections: [
                    { "heading": "1. 食慾與飲水行為", "image_url": "", "body": "食慾與飲水量是觀察貓咪健康的重要參考依據。若出現食量減少、突然挑食，或喝水頻率明顯異常，都可能是身體出現不適的早期跡象。尤其對年長貓來說，飲水過少恐增加泌尿道與腎臟問題的風險。建議平日可透過定時餵食、使用飲水器，搭配簡單記錄，以便及早發現異狀。" },
                    { "heading": "2. 排泄習慣的觀察", "image_url": "", "body": "貓咪的排便與排尿狀況，能清楚反映牠們的消化與泌尿健康。正常的排泄應該規律、形狀穩定且無異味。若發現腹瀉、便秘、血尿或頻繁上廁所卻排不出來，便可能與泌尿道感染、腸胃異常或其他疾病有關。清理貓砂盆的同時，不妨也留意這些細節，對預防急症尤其重要。" },
                    { "heading": "3. 口腔與牙齒健康", "image_url": "", "body": "口腔問題常見於中高齡貓，且初期不易察覺。牙齦紅腫、口臭、進食時顯得猶豫或咀嚼異常，都是牙周病或牙結石的可能徵兆。長期忽視口腔保健不僅影響進食，還可能引發其他系統性健康問題。平時可嘗試潔牙零食、潔牙水，並視情況安排專業洗牙，維護口腔環境。" },
                    { "heading": "4. 毛髮與皮膚的整潔狀態", "image_url": "", "body": "健康的毛髮應柔順、富光澤，皮膚則不應出現紅腫、搔癢或異味。若出現掉毛明顯、持續抓咬、局部脫毛等情況，可能與寄生蟲、皮膚炎或過敏反應有關。建議每週定期梳毛，除了維持整潔，也有助於及早察覺異常。對長毛貓而言，這樣的照護更是不可或缺。" },
                    { "heading": "5. 行為與活力變化", "image_url": "", "body": "貓咪的行為是反映健康狀況的重要線索。若牠突然變得過於安靜、嗜睡、對周遭事物提不起勁，或性情變得焦躁，皆可能是身體不適的表現。飼主應留意日常作息的改變，並建立對主子平時習性的了解。當異常行為持續出現時，建議諮詢專業獸醫以釐清原因。" }
                ],
                create_at: "2025-04-29"
            },
            {
                ArticleId: 2,
                title: "標題二",
                banner_URL: "/catfood.jpg",
                intro: "介紹2",
                pet_type: "cat",
                product_category: "Health Supplements",
                sections: [
                    { "heading": "1. 食慾與飲水行為", "image_url": "", "body": "食慾與飲水量是觀察貓咪健康的重要參考依據。若出現食量減少、突然挑食，或喝水頻率明顯異常，都可能是身體出現不適的早期跡象。尤其對年長貓來說，飲水過少恐增加泌尿道與腎臟問題的風險。建議平日可透過定時餵食、使用飲水器，搭配簡單記錄，以便及早發現異狀。" },
                    { "heading": "2. 排泄習慣的觀察", "image_url": "", "body": "貓咪的排便與排尿狀況，能清楚反映牠們的消化與泌尿健康。正常的排泄應該規律、形狀穩定且無異味。若發現腹瀉、便秘、血尿或頻繁上廁所卻排不出來，便可能與泌尿道感染、腸胃異常或其他疾病有關。清理貓砂盆的同時，不妨也留意這些細節，對預防急症尤其重要。" },
                    { "heading": "3. 口腔與牙齒健康", "image_url": "", "body": "口腔問題常見於中高齡貓，且初期不易察覺。牙齦紅腫、口臭、進食時顯得猶豫或咀嚼異常，都是牙周病或牙結石的可能徵兆。長期忽視口腔保健不僅影響進食，還可能引發其他系統性健康問題。平時可嘗試潔牙零食、潔牙水，並視情況安排專業洗牙，維護口腔環境。" },
                ],
                create_at: "2025-04-29"
            }
        ]
    }
    async componentDidMount() {
        let result = await axios.get('http://localhost:8000/get/article')
        result.data.forEach((article) => {
            article.create_at = new Date(article.create_at).toLocaleString()
            article.sections = JSON.parse(article.sections)
            if (article.product_category === "Health Supplements") {
                article.banner_URL = '/media/pet_know/health_check' + article.banner_URL
                article.sections.forEach((sec, idx) => {
                    sec.image_url = '/media/pet_know/health_check' + sec.image_url
                })
            }
            else {
                article.banner_URL = '/media/pet_know/pet_feeding' + article.banner_URL
                article.sections.forEach((sec, idx) => {
                    sec.image_url = '/media/pet_know/pet_feeding' + sec.image_url
                })
            }
        })
        let newState = { ...this.state }
        newState.article = result.data
        this.setState(newState)
    }
    handlePageChange = (page) => {
        this.setState({ currentPage: page });
    };
    render() {
        let { article, show, emptyAOBJ, currentPage } = this.state;
        let itemsPerPage = 10;
        let startIndex = (currentPage - 1) * itemsPerPage;
        let currentArticles = article.slice(startIndex, startIndex + itemsPerPage);

        return (
            <>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ArticleID</th>
                            <th>title</th>
                            <th>intro</th>
                            <th>create_at</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentArticles.map((arti, index) => {
                                return (
                                    <tr key={arti.ArticleID}>
                                        <td>{arti.ArticleID}</td>
                                        <td>{arti.title}</td>
                                        <td>{arti.intro}</td>
                                        <td>{arti.create_at}</td>
                                        <td>
                                            <button className='btn btn-outline-primary' onClick={() => this.LookArticle(startIndex + index)}>查看文章</button>
                                            <button className='btn btn-outline-warning' onClick={() => this.EditArticle(startIndex + index)}>編輯文章</button>
                                            <button className='btn btn-outline-danger' onClick={() => this.DeleteArticle(startIndex + index)}>刪除文章</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>

                </table>
                <Pagination
                    totalItems={article.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={this.handlePageChange}
                />
                {show && (
                    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-scrollable" style={{ maxHeight: '80vh' }}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">編輯文章</h5>
                                </div>

                                <div className="modal-body" style={{ overflowY: 'auto' }}>
                                    <form>
                                        <label htmlFor="ArticleID">ArticleID:</label>
                                        <input type="text" id='ArticleID' name='ArticleID' disabled value={emptyAOBJ.ArticleID} onChange={this.Handlechange} />
                                        <p></p>
                                        <label htmlFor="title">title:</label>
                                        <input type="text" id='title' name='title' value={emptyAOBJ.title} onChange={this.Handlechange} />
                                        <p></p>
                                        <label htmlFor="banner_URL">banner_URL:</label>
                                        <input type="file" name='banner_URL' onChange={this.PhotoChange} />
                                        <img width={50} src={emptyAOBJ.banner_URL} alt="" />
                                        <img src={this.state.photo} width={100} alt="" />
                                        <p></p>
                                        <label htmlFor="intro">intro:</label>
                                        <textarea name="intro" id="intro" value={emptyAOBJ.intro} onChange={this.Handlechange}></textarea>
                                        <p></p>
                                        <label htmlFor="pet_type">pet_type:</label>
                                        <select name="pet_type" id="pet_type" value={emptyAOBJ.pet_type} onChange={this.Handlechange}>
                                            <option value="dog">狗</option>
                                            <option value="cat">貓</option>
                                            <option value="mouse">鼠</option>
                                            <option value="bird">鳥</option>
                                        </select>
                                        <p></p>
                                        <label htmlFor="product_category">product_category:</label>
                                        <select
                                            name="product_category"
                                            id="product_category"
                                            className="form-select"
                                            value={emptyAOBJ.product_category}
                                            onChange={this.Handlechange}
                                        >
                                            <option value="">-- 請選擇分類 --</option>
                                            <option value="pet food">寵物主食</option>
                                            <option value="complementary food">副食品</option>
                                            <option value="snacks">零食</option>
                                            <option value="Health Supplements">健康保健品</option>
                                            <option value="Living Essentials">生活用品</option>
                                            <option value="toys">玩具</option>
                                        </select>
                                        <p></p>
                                        {
                                            emptyAOBJ.sections.map((sec, index) => {
                                                return (<>
                                                    <legend htmlFor="">{`section${index + 1}`}</legend>
                                                    <p></p>
                                                    <label htmlFor="">{`heading${index + 1}`}</label>
                                                    <input type="text" name={`heading.${index}`} value={sec.heading} onChange={this.Handlechange} />
                                                    <p></p>
                                                    <label htmlFor="">{`image_url${index + 1}`}</label>
                                                    <input type="file" name={`image_url.${index}`} onChange={this.PhotoChange} />
                                                    <img width={50} src={sec.image_url} alt='' />
                                                    <p></p>
                                                    <label htmlFor="">{`body${index + 1}`}</label>
                                                    <input type="text" name={`body.${index}`} value={sec.body} onChange={this.Handlechange} />
                                                    <p></p>

                                                </>
                                                )
                                            })
                                        }

                                    </form>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => {
                                        this.toggleModal(); this.setState({
                                            emptyAOBJ: {
                                                ArticleID: 1,
                                                title: "",
                                                banner_URL: "",
                                                intro: "",
                                                pet_type: "",
                                                product_category: "",
                                                sections: [],
                                                create_at: ""
                                            }
                                        })
                                    }}>取消</button>
                                    <button type="submit" className="btn btn-primary" onClick={() => { this.toggleModal(); }}>儲存</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </>
        );
    }
    PhotoChange = (event) => {
        let { name } = event.target;
        let { emptyAOBJ } = this.state;
        let key = name.split('.')
        let index = parseInt(key[1])
        if (name.startsWith('image_url.')) {
            const file = event.target.files[0];
            if (file) {
                let photoURL = URL.createObjectURL(file);
                let newAOBJ = { ...emptyAOBJ }
                console.log(typeof (newAOBJ.sections[index]));

                newAOBJ.sections[index].image_url = photoURL
                this.setState({ emptyAOBJ: newAOBJ }, () => {
                    console.log(newAOBJ);
                })
            }
        }
        else if (name === 'banner_URL') {
            const file = event.target.files[0];
            if (file) {
                let photoURL = URL.createObjectURL(file);
                let newAOBJ = { ...emptyAOBJ }

                newAOBJ.banner_URL = photoURL
                this.setState({ emptyAOBJ: newAOBJ }, () => {
                    console.log(newAOBJ);
                })
            }
        }
    }
    Handlechange = (event) => {
        const { name, value } = event.target;
        let { emptyAOBJ } = this.state;
        let newAOBJ = { ...emptyAOBJ }
        let key = name.split('.')
        let index = parseInt(key[1])
        if (name.startsWith('heading.')) {
            newAOBJ.sections[index].heading = value
        }
        else if (name.startsWith('body.')) {
            newAOBJ.sections[index].body = value

        }
        else {
            newAOBJ[`${name}`] = value

        }
        this.setState({ emptyAOBJ: newAOBJ }, () => {
            console.log(newAOBJ);
        })


    }
    toggleModal = () => {
        this.setState({ show: !this.state.show })
    }
    LookArticle = (index) => {
        //超連結去文章葉面
    }
    EditArticle = (index) => {
        let { article } = this.state;
        let copyAOBJ = { ...article[index] };
        this.setState({
            thisIndex: index,
            emptyAOBJ: copyAOBJ,
            show: true
        });
    }

    DeleteArticle = (index) => {

    }
}

export default Article_manage;