import React, { Component } from 'react';
import './Map.css'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const countyViewSettings = {
    "臺北市": { center: [25.0375, 121.5637], zoom: 11 },
    "新北市": { center: [25.0169, 121.4628], zoom: 10 },
    "桃園市": { center: [24.9937, 121.3009], zoom: 10 },
    "臺中市": { center: [24.1477, 120.6736], zoom: 10 },
    "臺南市": { center: [23.0000, 120.2000], zoom: 10 },
    "高雄市": { center: [22.6273, 120.3014], zoom: 9 },
    "基隆市": { center: [25.1276, 121.7392], zoom: 11 },
    "新竹市": { center: [24.8039, 120.9647], zoom: 11 },
    "嘉義市": { center: [23.4801, 120.4491], zoom: 11 },
    "新竹縣": { center: [24.8383, 121.0086], zoom: 10 },
    "苗栗縣": { center: [24.5602, 120.8214], zoom: 10 },
    "彰化縣": { center: [24.0685, 120.5578], zoom: 10 },
    "南投縣": { center: [23.9609, 120.9719], zoom: 10 },
    "雲林縣": { center: [23.7074, 120.4313], zoom: 10 },
    "嘉義縣": { center: [23.4523, 120.2555], zoom: 10 },
    "屏東縣": { center: [22.5510, 120.5485], zoom: 9 },
    "宜蘭縣": { center: [24.7021, 121.7378], zoom: 10 },
    "花蓮縣": { center: [23.9872, 121.6015], zoom: 9 },
    "臺東縣": { center: [22.7583, 121.1444], zoom: 9 },
    "澎湖縣": { center: [23.5655, 119.6151], zoom: 10 },
    "金門縣": { center: [24.4344, 118.3171], zoom: 11 },
    "連江縣": { center: [26.1608, 119.9488], zoom: 11 }
};

class TaiwanMap extends Component {
    originalCityData = null;
    activeLayer = null;
    lockedCountyName = null;
    map = null;
    countyLayer = null;
    townshipLayer = null;
    count = 0;


    state = {
        selectedCounty: '無',
        cityData: null,
        townData: null,
        countyLoaded: false,
        townshipLoaded: false,
        highlighCity: this.props.city,
        highlighTown: this.props.town
    };
    componentDidUpdate(prevProps, prevState) {
        if (!prevState.cityData && this.state.cityData) {
            this.highlightByName(this.state.highlighCity);
        }
    }

    async componentDidMount() {
        await axios.get('./taiwan_counties.geojson')
            // await axios.get('https://coruscating-donut-de23f3.netlify.app/taiwan_counties.geojson')
            .then(cityObj => {
                console.log(cityObj.data);
                this.originalCityData = cityObj.data
                this.setState({
                    countyLoaded: true,
                    cityData: cityObj.data
                })

                this.map = L.map('map', {
                    center: [23.7, 121],
                    zoom: 7,
                    dragging: false,
                    scrollWheelZoom: false,
                    doubleClickZoom: false,
                    boxZoom: false,
                    keyboard: false,
                    zoomControl: false,
                    touchZoom: false
                });

                L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg', {
                    attribution: '© OpenStreetMap 貢獻者'
                }).addTo(this.map);
                //正常
                this.townshipLayer = L.geoJSON(null, {
                    onEachFeature: (feature, layer) => {
                        const town = feature.properties.town || "未知鄉鎮";
                        layer.on('mouseover', () => {
                            layer.bindTooltip(`鄉鎮：${town}`)
                        })
                        layer.on('click', () => {
                            // this.townshipLayer.resetStyle();
                            this.props.SortProductbyTown(town)
                            // layer.setStyle({ fillColor: "orange", fillOpacity: 0.8 });
                            // layer.bringToFront();
                            this.props.close()
                        });
                    },
                    style: {
                        color: "#888",
                        weight: 1,
                        fillColor: "#b2e2f2",
                        fillOpacity: 0.4
                    }
                }).addTo(this.map);

                this.countyLayer = L.geoJSON(null, {
                    onEachFeature: (feature, layer) => {
                        const name = feature.properties.county || "未知縣市";
                        this.count = 0;
                        this.state.highlighTown.forEach((city, idx) => {
                            if (city.startsWith(name)) {
                                this.count++
                            }
                        })
                        if (this.count) {
                            if (name === '高雄市') {
                                layer.bindTooltip(`${name}（${this.count} 件商品）`, {
                                    offset: [570, -1200], // X 偏移 570px，Y 向上偏移 1200px
                                    permanent: false,
                                    direction: 'top',
                                    className: 'county-label'
                                })
                            }
                            else {
                                layer.bindTooltip(`${name}（${this.count} 件商品）`, {

                                    permanent: false,
                                    direction: 'top',
                                    className: 'county-label'
                                })
                            }



                        }

                        layer.on('click', () => {
                            const selectedCounty = feature.properties.county;
                            if (this.lockedCountyName && selectedCounty !== this.lockedCountyName) return;

                            this.updateSelectedArea(selectedCounty);
                            this.resetActiveLayer();

                            layer.setStyle({ fillColor: "#ffcc00", fillOpacity: 0.9 });
                            layer.bringToFront();
                            this.activeLayer = layer;

                            const setting = countyViewSettings[selectedCounty];
                            if (setting) {
                                this.map.setView(setting.center, setting.zoom);
                            } else {
                                this.map.fitBounds(layer.getBounds(), { maxZoom: 10 });
                            }

                            this.showTownshipsByCounty(selectedCounty);
                            this.highlightByName(this.state.highlighTown);
                            this.lockedCountyName = selectedCounty;
                        });
                    },
                    style: {
                        color: "#555",
                        weight: 1,
                        fillColor: "#99ccff",
                        fillOpacity: 0.3
                    }
                }).addTo(this.map);

                const topCities = ['臺北市', '嘉義市'];
                const sorted = [
                    ...cityObj.data.features.filter(f => !topCities.includes(f.properties.county)),
                    ...cityObj.data.features.filter(f => topCities.includes(f.properties.county))
                ];
                const sortedData = { ...cityObj.data, features: sorted };
                this.setState({ cityData: sortedData });
                this.countyLayer.addData(sortedData);

            })
            .catch(err => {
                console.log(err);

            })
        await axios.get("./taiwan_townships.geojson")
            // await axios.get('https://coruscating-donut-de23f3.netlify.app/taiwan_townships.geojson')
            .then(townObj => {
                console.log(townObj.data);
                this.setState({
                    townshipLoaded: true,
                    townData: townObj.data
                })


            })

    }
    resetActiveLayer() {
        if (this.activeLayer) {
            this.countyLayer.resetStyle(this.activeLayer);
            this.activeLayer = null;
        }
    }
    highlightByName(input) {
        let { cityData } = this.state
        const names = Array.isArray(input) ? input : [input];
        const isCounty = names.every(name =>
            cityData && cityData.features.some(f => f.properties.county === name)
        );

        if (isCounty) {
            this.countyLayer.eachLayer(layer => {
                const name = layer.feature.properties.county;
                if (names.includes(name)) {
                    this.countyLayer.resetStyle(layer);
                    layer.setStyle({
                        fillColor: "red",
                        fillOpacity: 0.8,
                        color: "#000",
                        weight: 2
                    });
                    // layer.bringToFront();
                    layer.openPopup();
                } else {
                    this.countyLayer.resetStyle(layer);
                }
            });
        }
        else {
            this.townshipLayer.eachLayer(layer => {
                const name = layer.feature.properties.town;
                if (names.includes(name)) {
                    this.townshipLayer.resetStyle(layer);
                    layer.setStyle({
                        fillColor: "blue",
                        fillOpacity: 0.8,
                        color: "#000",
                        weight: 2
                    });
                    layer.bringToFront();
                    layer.openPopup();
                } else {
                    this.townshipLayer.resetStyle(layer);
                }
            });
        }
    }
    resetMap = () => {
        this.resetActiveLayer();

        if (this.townshipLayer) {
            this.townshipLayer.clearLayers();
        }

        this.map.setView([23.7, 121], 7);
        this.lockedCountyName = null;

        if (this.originalCityData && this.countyLayer) {
            this.countyLayer.clearLayers();
            const topCities = ['臺北市', '嘉義市'];
            const sorted = [
                ...this.originalCityData.features.filter(f => !topCities.includes(f.properties.county)),
                ...this.originalCityData.features.filter(f => topCities.includes(f.properties.county))
            ];
            this.setState({ cityData: { ...this.originalCityData, features: sorted } });
            this.countyLayer.addData(sorted);
            this.highlightByName(this.state.highlighCity);
        }
    }

    updateSelectedArea(name) {
        document.getElementById("selectedArea").textContent = `目前選擇：${name}`;
    }
    showTownshipsByCounty(countyName) {
        let { townData } = this.state
        if (!townData) return;
        const filtered = townData.features.filter(f => f.properties.town.startsWith(countyName));
        this.townshipLayer.clearLayers();
        this.townshipLayer.addData(filtered);
    }
    getLoadingText = () => {

        let { countyLoaded, townshipLoaded } = this.state
        if (countyLoaded === false && townshipLoaded === false) {
            return "縣市資料加載中...."
        }
        else if (countyLoaded === true) {
            if (townshipLoaded === false) {
                return "鄉鎮市區資料加載中..."
            }

        }
        return null
    }
    render() {
        let { countyLoaded, townshipLoaded } = this.state
        let loading = !countyLoaded || !townshipLoaded

        return (<>
            <p id="selectedArea">目前選擇：無</p>
            <button className='map-button btn btn-primary' onClick={this.resetMap}>🔄 回到全台視角</button>
            <div id="map">
                {loading && <div id="mapLoadingOverlay">
                    <div className="spinner" id="load">{this.getLoadingText()}</div>
                </div>}
            </div>
        </>
        );
    }
}

export default TaiwanMap;