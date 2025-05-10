import React, { Component } from 'react';

export default class Article_modal extends Component {
  constructor(props) {
    super(props);
    // 初始化時把 props.article 展開並補預設
    const initial = {
      ...(props.article || {}),
      article_type: props.article?.article_type || '',
      product_category: props.article?.product_category || ''
    };
    // 若已有字串形式的 banner_URL，就作為預覽
    if (typeof initial.banner_URL === 'string' && initial.banner_URL) {
      initial.banner_URL_preview = initial.banner_URL;
    }
    this.state = { form: initial };
  }

  componentDidUpdate(prevProps) {
    if (this.props.article !== prevProps.article) {
      // 更新時同樣處理 props.article
      const updated = {
        ...(this.props.article || {}),
        article_type: this.props.article?.article_type || '',
        product_category: this.props.article?.product_category || ''
      };
      if (typeof updated.banner_URL === 'string' && updated.banner_URL) {
        updated.banner_URL_preview = updated.banner_URL;
      }
      this.setState({ form: updated });
    }
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState(s => ({ form: { ...s.form, [name]: value } }));
  };

  handleFileChange = e => {
    const { name, files } = e.target;
    if (!files.length) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    this.setState(s => ({
      form: { ...s.form, [name]: file, [`${name}_preview`]: url }
    }));
  };

  handleSectionChange = (idx, field, value) => {
    this.setState(s => {
      const sections = [...(s.form.sections || [])];
      sections[idx] = { ...sections[idx], [field]: value };
      return { form: { ...s.form, sections } };
    });
  };

  handleSubmit = () => {
    const { mode, createArticle, editArticle } = this.props;
    const { form } = this.state;
    const action = mode === 'Add' ? createArticle : editArticle;
    action(form);
  };

  render() {
    console.log('【Article_modal】form:', this.state.form);

    const { mode, close } = this.props;
    const { form } = this.state;
    const readOnly = mode === 'Find';
    console.log('banner_URL_preview:', form.banner_URL_preview);
    console.log('banner_URL:', form.banner_URL);
    // 後端靜態資源根網址
    const API_BASE = 'http://localhost:8000';
    // 預覽路徑
        // 預覽路徑
    const previewPath = form.banner_URL_preview;
    // 如果使用者剛選的 File 會存在 previewPath (blob URL)
    // 否則用後端靜態路徑
    const bannerSrc = previewPath
      ? (previewPath.startsWith('blob:')
          ? previewPath
          : `${API_BASE}${previewPath}`)
      : '';


    return (
      <div className="modal show fade d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">
                {mode === 'Add' ? '新增文章' : mode === 'Edit' ? '編輯文章' : '查看文章'}
              </h5>
              <button type="button" className="btn-close" onClick={close}></button>
            </div>

            <div className="modal-body">
              {/* Banner 圖片上傳 */}
              <div className="mb-3">
                <label>Banner 圖片</label>
                <input
                  type="file"
                  className="form-control"
                  name="banner_URL"
                  onChange={this.handleFileChange}
                  disabled={readOnly}
                />
                {bannerSrc && (
                  <img src={bannerSrc} alt="banner preview" style={{ width: '100%', marginTop: 8 }} />
                )}
              </div>

              {/* 標題 */}
              <div className="mb-3">
                <label>標題</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={form.title || ''}
                  onChange={this.handleChange}
                  readOnly={readOnly}
                />
              </div>

              {/* 摘要 */}
              <div className="mb-3">
                <label>摘要</label>
                <textarea
                  className="form-control"
                  name="intro"
                  value={form.intro || ''}
                  onChange={this.handleChange}
                  readOnly={readOnly}
                />
              </div>

              {/* 寵物類型 */}
              <div className="mb-3">
                <label>寵物類型</label>
                <select
                  className="form-select"
                  name="pet_type"
                  value={form.pet_type || ''}
                  onChange={this.handleChange}
                  disabled={readOnly}
                >
                  <option value="">-- 請選擇 --</option>
                  <option value="dog">狗狗</option>
                  <option value="cat">貓咪</option>
                  <option value="bird">鳥類</option>
                  <option value="mouse">鼠類</option>
                </select>
              </div>

              {/* 文章分類 */}
              <div className="mb-3">
                <label>文章分類</label>
                <select
                  className="form-select"
                  name="product_category"
                  value={form.product_category || ''}
                  onChange={this.handleChange}
                  disabled={readOnly}
                >
                  <option value="">-- 請選擇 --</option>
                  <option value="pet food">飼料</option>
                  <option value="complementary food">副食</option>
                  <option value="snacks">零食</option>
                  <option value="Health Supplements">保健食品</option>
                  <option value="Living Essentials">生活家居</option>
                  <option value="toys">玩具</option>
                </select>
              </div>

              {/* 文章類型 */}
              <div className="mb-3">
                <label>文章類型</label>
                <select
                  className="form-select"
                  name="article_type"
                  value={form.article_type || ''}
                  onChange={this.handleChange}
                  disabled={readOnly}
                  required
                >
                  <option value="">-- 請選擇 --</option>
                  <option value="health_check">健康檢查</option>
                  <option value="pet_feeding">飼養知識</option>
                </select>
              </div>

              <hr />

              <h6>Sections</h6>
              {(form.sections || []).map((sec, i) => {
                const secImgSrc = sec.image_url_preview || sec.image_url;
                const secSrc = secImgSrc
                  ? (secImgSrc instanceof File
                      ? secImgSrc
                      : `${API_BASE}${secImgSrc}`)
                  : '';
                return (
                  <div key={i} className="mb-3 border p-2">
                    <div className="mb-2">
                      <label>Section Heading</label>
                      <input
                        type="text"
                        className="form-control"
                        value={sec.heading}
                        onChange={e => this.handleSectionChange(i, 'heading', e.target.value)}
                        readOnly={readOnly}
                      />
                    </div>
                    <div className="mb-2">
                      <label>Section Body</label>
                      <textarea
                        className="form-control"
                        value={sec.body}
                        onChange={e => this.handleSectionChange(i, 'body', e.target.value)}
                        readOnly={readOnly}
                      />
                    </div>
                    <div className="mb-2">
                      <label>Section 圖片</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={e => {
                          const file = e.target.files[0];
                          const url = URL.createObjectURL(file);
                          this.handleSectionChange(i, 'image_url', file);
                          this.handleSectionChange(i, 'image_url_preview', url);
                        }}
                        disabled={readOnly}
                      />
                      {secSrc && (
                        <img src={secSrc} alt="sec preview" style={{ width: '100%', marginTop: 4 }} />
                      )}
                    </div>
                  </div>
                );
              })}

              {!readOnly && (
                <button className="btn btn-sm btn-outline-secondary" onClick={() => {
                  const secs = [...(form.sections || []), { heading: '', body: '', image_url: '' }];
                  this.setState(s => ({ form: { ...s.form, sections: secs } }));
                }}>
                  新增 Section
                </button>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={close}>取消</button>
              {!readOnly && (
                <button className="btn btn-primary" onClick={this.handleSubmit}>
                  {mode === 'Add' ? '新增' : '儲存'}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }
}
