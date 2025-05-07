// Homepage.jsx
import React, { useState, useEffect } from 'react';
import NewsBar from './NewsBar';
import Banner from './Banner';
import SectionLinks from './SectionLinks.jsx';
import CategoryIcons from './CategoryIcons';
import BestsellerTabs from './BestsellerTabs';
import NewsEventsSection from './NewsEventsSection';
import InfoSection from './InfoSection';

function Homepage() {

  return (
    <>
      <NewsBar />
      <Banner />
      <SectionLinks />
      <CategoryIcons />
      <BestsellerTabs />
      <NewsEventsSection />
      <InfoSection />
    </>
  );
}

export default Homepage;
