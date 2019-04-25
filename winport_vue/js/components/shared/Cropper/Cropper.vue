<style src="./Cropper.scss" lang="scss"></style>

<script>
    import {mapGetters, mapState, mapMutations} from 'vuex';

    export default {
        name: "Cropper",

        template: require('./Cropper.html'),

        components: {
        },

        props: ['currentImage'],

        data() {
            return {
                cropperResponse: {},
                cropped: null
            }
        },

        methods: {
            ...mapMutations(['setOpenCropper']),

            dataURItoBlob(dataURI) {
                let byteString = atob(dataURI.split(',')[1]);
                let ab = new ArrayBuffer(byteString.length);
                let ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                return new Blob([ab], {type: 'image/jpeg'});
            },

            cropImage() {
                let cropImg = this.$refs.galleryCropper.getCroppedCanvas().toDataURL();

                let data = new FormData();
                data.append('file', this.dataURItoBlob(cropImg));

                this.$store.dispatch('sendCrop', {data: data}).then(() => {
                    this.cropperResponse = this.$store.getters.getCropperResponse;

                    if (this.cropperResponse.success === true) {
                        this.$emit('cropped-image', {url: this.cropperResponse.url, id: this.cropperResponse.id});
                    } else {
                        alert(this.cropperResponse.error);
                    }
                });
            },

            rotateImage() {
                this.$refs.galleryCropper.rotate(90);
            },
        },

        computed: {
            openCropper() {
                return this.$store.getters.getOpenCropper;
            }
        }
    };
</script>
