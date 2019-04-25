import Vue from 'vue';
import ConfigService from '@/services/ConfigService';

const CompanyModule = {
    state: {
        companies: null,
        company: {},
        companyFeedbackResponse: {},
        openCompanyContact: false,
        companyWrongNumberResponse: {}
    },

    mutations: {
        setCompanies: (state, companies) => {
            state.companies = companies;
        },

        setCompany: (state, company) => {
            state.company = company;
        },

        setCompanyFeedbackResponse(state, response) {
            state.companyFeedbackResponse = response;
        },

        setCompanyWrongNumberResponse(state, response) {
            state.companyWrongNumberResponse = response;
        },

        setOpenCompanyContact(state, status) {
            state.openCompanyContact = status;
        }
    },

    actions: {
        getTemporaryCompany: ({commit}, path) => {
            let companyAlias = (typeof path[0] !== "undefined") ? ('/' + path[0]) : '';
            let albumAlias = (typeof path[1] !== "undefined") ? ('/album/' + path[1]) : '';
            let page = (typeof path[2] !== "undefined") ? ('/' + path[2]) : '';

            commit('setLoading', true);

            return Vue.http.get(ConfigService.getSetting('api') + '/company/temporary' + companyAlias + albumAlias + page)
                .then(response => response.json())
                .then(company => {
                    commit('setLoading', false);
                    commit('setCompany', company);
                })
                .catch(err => {
                    commit('setLoading', false);
                    commit('setError', err);
                });
        },

        sendCompanyFeedback: ({commit}, form) => {
            return Vue.http.post(ConfigService.getSetting('api') + '/main/contact-company', form)
                .then(response => response.json())
                .then(feedbackResponse => {
                    commit('setCompanyFeedbackResponse', feedbackResponse);
                })
                .catch(err => {
                    commit('setError', err);
                });
        },

        sendCompanyWrongNumber: ({commit}, form) => {
            return Vue.http.post(ConfigService.getSetting('api') + '/desk-company/company-wrong-number', form)
                .then(response => response.json())
                .then(feedbackResponse => {
                    commit('setCompanyWrongNumberResponse', feedbackResponse);
                })
                .catch(err => {
                    commit('setError', err);
                });
        },

        getCompanies: ({commit}, path, currentPage) => {
            commit('setLoading', true);
            let alias = (typeof path[0] !== "undefined") ? ('/' + path[0]) : '';
            let page = (typeof path[1] !== "undefined") ? ('/' + path[1]) : '/1';
            let search = '/search/--/sort/' + path[3];
            if (typeof path[2] !== "undefined") {
                if (path[2].length>0) {
                    search = '/search/' + path[2] + '/sort/' + path[3];
                }
            }

            return Vue.http.get(ConfigService.getSetting('api') + '/companies' + alias + page + search)
                .then(response => response.json())
                .then(companies => {
                    commit('setLoading', false);
                    commit('setCompanies', companies);
                })
                .catch(err => {
                    commit('setLoading', false);
                    commit('setError', err);
                });
        },

        getCompany: ({commit}, path, currentPage) => {
            commit('setLoading', true);
            let alias = (typeof path[0] !== "undefined") ? ('/' + path[0]) : '';
            let page = (typeof path[1] !== "undefined") ? ('/' + path[1]) : '';

            return Vue.http.get(ConfigService.getSetting('api') + '/company' + alias + page)
                .then(response => response.json())
                .then(company => {
                    commit('setLoading', false);
                    commit('setCompany', company);
                })
                .catch(err => {
                    commit('setLoading', false);
                    commit('setError', err);
                });
        },

        getNews: ({commit}, path, currentPage) => {
            let alias = (typeof path[0] !== "undefined") ? ('/' + path[0]) : '';
            let page = (typeof path[1] !== "undefined") ? ('/' + path[1]) : '';

            return Vue.http.get(ConfigService.getSetting('api') + '/company' + alias + page)
                .then(response => response.json())
                .then(company => {
                    commit('setCompany', company);
                })
                .catch(err => {
                    commit('setError', err);
                });
        },

        getAlbums: ({commit}, path, currentPage) => {
            let companyAlias = (typeof path[0] !== "undefined") ? ('/' + path[0]) : '';
            let albumAlias = (typeof path[1] !== "undefined") ? ('/' + path[1]) : '';
            let page = (typeof path[2] !== "undefined") ? ('/' + path[2]) : '';

            return Vue.http.get(ConfigService.getSetting('api') + '/company' + companyAlias + '/album' + albumAlias + page)
                .then(response => response.json())
                .then(company => {
                    commit('setCompany', company);
                })
                .catch(err => {
                    commit('setError', err);
                });
        }
    },

    getters: {
        getCompanies(state) {
            return state.companies;
        },

        getCompany(state) {
            return state.company;
        },

        getNews(state) {
            return state.company;
        },

        getCompanyFeedbackResponse(state) {
            return state.companyFeedbackResponse;
        },

        getCompanyWrongNumberResponse(state) {
            return state.companyWrongNumberResponse;
        },

        getOpenCompanyContact(state) {
            return state.openCompanyContact;
        },
    }
};

export default CompanyModule;
