import React from 'react';

function InfoSection() {
  return (
    <div className="info-sections">
      <div className="info-block">
        <h5>寵物小知識</h5>
        <ul>
          <li>文章 A</li>
          <li>文章 B</li>
        </ul>
      </div>
      <div className="info-block">
        <h5>相關法規</h5>
        <ul>
          <li>法規 A</li>
          <li>法規 B</li>
        </ul>
      </div>
    </div>
  );
}
export default InfoSection;
