import Vue from 'vue';
import ConfigService from '@/services/ConfigService';

const CropperModule = {
    state: {
        openCropper: false,
        cropperResponse: {}
    },

    mutations: {
        setOpenCropper(state, status) {
            state.openCropper = status;
            state.cropperResponse = {};
        },

        setCropperResponse(state, response) {
            state.cropperResponse = response;
        }
    },

    actions: {
        sendCrop: ({commit}, form) => {
            return Vue.http.post(ConfigService.getSetting('api') + '/desk-company/upload-cropped', form.data)
                .then(response => response.json())
                .then(cropperResponse => {
                    commit('setCropperResponse', cropperResponse);
                })
                .catch(err => {
                    commit('setError', err);
                });
        }
    },

    getters: {
        getOpenCropper(state) {
            return state.openCropper;
        },

        getCropperResponse(state) {
            return state.cropperResponse;
        }
    }
};

export default CropperModule;
