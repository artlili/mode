import Vue from 'vue';

const YandexMapModule = {
    state: {
        geocode: {},
        country: null,
        city: null,
        region: null,
        district: null,
        address: null,
        zip: null
    },

    mutations: {
        setGeocode(state, geocode) {
            state.geocode = geocode;
        },
        setCountry(state, country) {
            state.country = country;
        },
        setCity(state, city) {
            state.city = city;
        },
        setRegion(state, region) {
            state.region = region;
        },
        setDistrict(state, district) {
            state.district = district;
        },
        setAddress(state, address) {
            state.address = address;
        },
        setZip(state, zip) {
            state.zip = zip;
        }
    },

    actions: {
        /**
         * @param commit
         * @param address
         */
        getGeocode({commit}, address) {
            let url = 'https://geocode-maps.yandex.ru/1.x/?format=json&geocode=' + address;
            return Vue.http.jsonp(url, {}).then(function (data) {
                let response = JSON.parse(data.bodyText);
                if (
                    response.response &&
                    response.response.GeoObjectCollection &&
                    response.response.GeoObjectCollection.featureMember &&
                    response.response.GeoObjectCollection.featureMember[0]
                ) {
                    let point = response.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").reverse();
                    commit('setGeocode', point);

                    let zip = response.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.postal_code;
                    commit('setZip', zip);
                }
            }, function (error) {

            });
        },

        getGeocodeByCoords({commit}, coords) {
            let url = 'https://geocode-maps.yandex.ru/1.x/?format=json&geocode=' + coords[1] + "," + coords[0];
            return Vue.http.jsonp(url, {}).then(function (data) {
                let response = JSON.parse(data.bodyText);
                if (
                    response.response &&
                    response.response.GeoObjectCollection &&
                    response.response.GeoObjectCollection.featureMember &&
                    response.response.GeoObjectCollection.featureMember[0]
                ) {
                    let zip = response.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.postal_code;
                    commit('setZip', zip);

                    let components = response.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.Components;
                    let districtDone = false;
                    let district = '';
                    let address = '';
                    commit('setCountry', '');
                    commit('setRegion', '');
                    commit('setDistrict', '');
                    commit('setCity', '');
                    commit('setAddress', '');
                    for (let i in components) {
                        let value = components[i].name;
                        if (components[i].kind === 'country') {
                            commit('setCountry', value);
                        }
                        if (components[i].kind === 'province') {
                            if (districtDone) {
                                commit('setRegion', value);
                            } else {
                                commit('setDistrict', value);
                                districtDone = true;
                                district = value;
                            }
                        }
                        if (components[i].kind === 'district') {
                            if (districtDone) {
                                commit('setRegion', district);
                            }
                            commit('setDistrict', value);
                        }
                        if (components[i].kind === 'locality') {
                            commit('setCity', value);
                        }
                        if (components[i].kind === 'street') {
                            address = value;
                            commit('setAddress', address);
                        }
                        if (components[i].kind === 'house') {
                            if (address.length > 0) {
                                address += ", ";
                            }
                            address += " д. " + value;
                            commit('setAddress', address);
                        }
                    }
                }
            }, function (error) {

            });
        }
    },

    getters: {
        getGeocode(state) {
            return state.geocode;
        },
        getCountry(state) {
            return state.country;
        },
        getCity(state) {
            return state.city;
        },
        getRegion(state) {
            return state.region;
        },
        getDistrict(state) {
            return state.district;
        },
        getAddress(state) {
            return state.address;
        },
        getZip(state) {
            return state.zip;
        }
    }
};

export default YandexMapModule;
