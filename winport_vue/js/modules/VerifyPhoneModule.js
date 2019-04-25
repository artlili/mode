import Vue from 'vue';
import ConfigService from '@/services/ConfigService';

const VerifyPhoneModule = {
    state: {
        openVerifyPhone: false,
        verifyPhoneResponse: {},
        verifyCodeResponse: {},
        ifVerifiedResponse: {}
    },

    mutations: {
        setOpenVerifyPhone(state, status) {
            state.openVerifyPhone = status;
            state.verifyPhoneResponse = {};
            state.verifyCodeResponse = {};
        },

        setVerifyPhoneResponse(state, response) {
            state.verifyPhoneResponse = response;
        },

        setVerifyCodeResponse(state, response) {
            state.verifyCodeResponse = response;
        },

        setIfVerifiedResponse(state, response) {
            state.ifVerifiedResponse = response;
        }
    },

    actions: {
        sendVerifyPhone: ({commit}, form) => {
            return Vue.http.post(ConfigService.getSetting('api') + '/user/verify-phone', form)
                .then(response => response.json())
                .then(verifyPhoneResponse => {
                    commit('setVerifyPhoneResponse', verifyPhoneResponse);
                })
                .catch(err => {
                    commit('setError', err);
                });
        },
        sendVerifyPhoneCode: ({commit}, form) => {
            return Vue.http.post(ConfigService.getSetting('api') + '/user/verify-code', form)
                .then(response => response.json())
                .then(verifyCodeResponse => {
                    commit('setVerifyCodeResponse', verifyCodeResponse);
                })
                .catch(err => {
                    commit('setError', err);
                });
        },
        checkIfPhoneVerified: ({commit}, form) => {
            return Vue.http.post(ConfigService.getSetting('api') + '/user/check-phone', form)
                .then(response => response.json())
                .then(ifVerifiedResponse => {
                    commit('setIfVerifiedResponse', ifVerifiedResponse);
                })
                .catch(err => {
                    commit('setError', err);
                });
        },
    },

    getters: {
        getOpenVerifyPhone(state) {
            return state.openVerifyPhone;
        },

        getVerifyPhoneResponse(state) {
            return state.verifyPhoneResponse;
        },

        getVerifyCodeResponse(state, response) {
            return state.verifyCodeResponse;
        },

        getIfVerifiedResponse(state, response) {
            return state.ifVerifiedResponse;
        }
    }
};

export default VerifyPhoneModule;
