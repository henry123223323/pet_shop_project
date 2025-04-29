import React, { useState } from 'react';

export default function PetSelector({ options, onChange }) {
  // options: 一維字串陣列，裡面放所有寵物名稱
  // onChange: 當切換時呼叫，傳回目前選到的 index

  const [current, setCurrent] = useState(0);

  const prev = () => {
    const nextIndex = (current - 1 + options.length) % options.length;
    setCurrent(nextIndex);
    onChange(nextIndex);
  };
  const next = () => {
    const nextIndex = (current + 1) % options.length;
    setCurrent(nextIndex);
    onChange(nextIndex);
  };

  return (
    <div className="p-4 text-center" style={{ width: 300, margin: '0 auto' }}>
      <h5 className="mb-3">請選擇動物</h5>
      <button onClick={prev} className="btn btn-outline-secondary me-2">◀️</button>
      <span style={{ minWidth: 80, display: 'inline-block' }}>{options[current]}</span>
      <button onClick={next} className="btn btn-outline-secondary ms-2">▶️</button>
      {/* <div className="mt-3">
        <button className="btn btn-warning">開始遊戲</button>
      </div> */}
    </div>
  );
}
