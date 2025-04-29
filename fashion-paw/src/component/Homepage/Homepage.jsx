import React from 'react';
import NewsBar from './NewsBar'
import Banner from './Banner'
import ProductCarousel from './ProductCarousel'
import CategoryIcons from './CategoryIcons'
import BestsellerTabs from './BestsellerTabs'
import NewsEventsSection from './NewsEventsSection'
import InfoSection from './InfoSection'



function Homepage() {
    return (
        <>
            <NewsBar/>
            <Banner/>
            <ProductCarousel/>
            <CategoryIcons/>
            <BestsellerTabs/>
            <NewsEventsSection/>
            <InfoSection/>
        </>
    )

}

export default Homepage;