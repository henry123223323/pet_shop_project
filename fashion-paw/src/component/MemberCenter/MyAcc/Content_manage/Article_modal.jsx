import React, { Component } from 'react';

export default class Article_modal extends Component {
  constructor(props) {
    super(props);
    this.state = { form: { ...(props.article || {}) } };
  }

  componentDidUpdate(prev) {
    if (this.props.article !== prev.article) {
      this.setState({ form: { ...(this.props.article || {}) } });
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
    if (mode === 'Add') createArticle(this.state.form);
    else if (mode === 'Edit') editArticle(this.state.form);
  };

  render() {
    const { mode, close } = this.props;
    const { form } = this.state;
    const readOnly = mode === 'Find';
    const bannerSrc = form.banner_URL_preview || form.banner_URL;

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
                {bannerSrc && <img src={bannerSrc} alt="banner preview" style={{ width: '100%', marginTop: '8px' }} />}
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
                  <option value="dog">狗</option>
                  <option value="cat">貓</option>
                  <option value="bird">鳥</option>
                  <option value="mouse">鼠</option>
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
                  <option value="pet food">寵物主食</option>
                  <option value="complementary food">副食品</option>
                  <option value="snacks">零食</option>
                  <option value="Health Supplements">健康保健品</option>
                  <option value="Living Essentials">生活用品</option>
                  <option value="toys">玩具</option>
                </select>
              </div>
              <hr />
              <h6>Sections</h6>
              {(form.sections || []).map((sec, i) => {
                const secImgSrc = sec.image_url_preview || sec.image_url;
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
                      {secImgSrc && <img src={secImgSrc} alt="sec preview" style={{ width: '100%', marginTop: '4px' }} />}
                    </div>
                  </div>
                );
              })}
              {!readOnly && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    const secs = [...(form.sections || []), { heading: '', body: '', image_url: '' }];
                    this.setState(s => ({ form: { ...s.form, sections: secs } }));
                  }}
                >
                  新增 Section
                </button>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={close}>取消</button>
              {!readOnly && <button className="btn btn-primary" onClick={this.handleSubmit}>{mode === 'Add' ? '新增' : '儲存'}</button>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}