import React, { useState } from 'react';

function BestsellerTabs() {
  const tabs = ['飼料','副食','保健食品','生活家居','玩具'];
  const [active, setActive] = useState(tabs[0]);
  return (
    <section className="bestseller">
      <h4>熱銷排行</h4>
      <div className="tabs">
        {tabs.map(t => (
          <button
            key={t}
            className={t===active?'active':''}
            onClick={()=>setActive(t)}
          >{t}</button>
        ))}
      </div>
      <div className="tab-content">
        {/* TODO: 根據 active 顯示對應商品列表 */}
        <p>顯示「{active}」類別的熱銷商品</p>
      </div>
    </section>
  );
}
export default BestsellerTabs;
