<style src="./GalleryTabs.scss" lang="scss"></style>
<script>
    import vue2Dropzone from 'vue2-dropzone'
    import 'vue2-dropzone/dist/vue2Dropzone.min.css'
    import Cropper from "@/components/shared/Cropper/Cropper.vue";
    import {mapState, mapActions, mapGetters, mapMutations} from "vuex";

    export default {
        name: "GalleryTabs",

        template: require('./GalleryTabs.html'),

        props: ['gallery'],

        components: {
            vueDropzone: vue2Dropzone,
            'cropper': Cropper
        },

        data: () => {
            return {
                tabs: [{title: 'Основная галерея'}],
                images: [],
                newTab: 'Основная галерея',
                selectedTab: 0,
                dropzoneOptions: {
                    url: 'http://api.' + window.location.host + '/v1/desk-company/upload-image',
                    thumbnailWidth: 240,
                    thumbnailHeight: 160,
                    maxFilesize: 2,
                    addRemoveLinks: true,
                    headers: {"Authorization": "Bearer " + localStorage.getItem("token")},
                    dictDefaultMessage: 'Вы можете добавить фото в альбом. Кликните или перетащите фотографии в данную область',
                    dictFallbackMessage: 'Загрузка фотографий вашим браузером не поддерживается. Попробуйте другой браузер',
                    dictFileTooBig: 'Файл слишком большой. Размер вашего файла: {{filesize}}, максимальный допустимый размер: {{maxFilesize}}',
                    dictCancelUpload: 'Отменить',
                    dictUploadCanceled: 'Загрузка отменена',
                    dictCancelUploadConfirmation: 'Вы действительно хотите отменить загрузку?',
                    dictRemoveFile: 'Удалить',
                    dictMaxFilesExceeded: 'Превышено максимальное количество файлов ({{maxFiles}})',
                    maxFiles: 36,
                    parallelUploads: 1,
                    previewTemplate: `\
                <div class="dz-preview dz-file-preview">
                  <div class="dz-image"><img data-dz-thumbnail /></div>
                  <div class="dz-details">
                  </div>
                  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                  <div class="dz-error-message"><span data-dz-errormessage></span></div>
                  <div class="dz-crop">Обрезать</div>
                  <div class="dz-change">Изменить</div>
                  <div class="dz-success-mark">
                    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                      <title>Check</title>
                      <defs></defs>
                      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                        <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF" sketch:type="MSShapeGroup"></path>
                      </g>
                    </svg>
                  </div>
                  <div class="dz-error-mark">
                    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                      <title>Error</title>
                      <defs></defs>
                      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                        <g id="Check-+-Oval-2" sketch:type="MSLayerGroup" stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475">
                          <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" sketch:type="MSShapeGroup"></path>
                        </g>
                      </g>
                    </svg>
                  </div>
                </div>\
                `
                },
                displayTitle: false,
                currentTitle: '',
                currentTitleIndex: null,
                titleX: 0,
                titleY: 0,
                imageToCrop: '',
                dropzoneInitialized: []
            }
        },

        mounted: function () {
            $(document).on('click', '.dz-change', this.changeTitleForImage);
            $(document).on('click', '.dz-crop', this.openCrop);
        },

        computed: {},

        methods: {
            ...mapMutations(['setOpenCropper']),

            initWithExistingImages: function () {
                for (let i in this.gallery) {
                    if (typeof this.tabs[i] !== "undefined") {
                        this.$set(this.tabs[i], 'title', this.gallery[i].gallery.title);
                    } else {
                        this.tabs.push({title: this.gallery[i].gallery.title});
                    }
                    for (let j in this.gallery[i].images) {
                        if (typeof this.images[i] === "undefined") {
                            this.images[i] = [];
                        }
                        this.images[i].push({
                            file_name: this.gallery[i].images[j].file_name,
                            thumb_id: this.gallery[i].images[j].thumb_id,
                            original_id: this.gallery[i].images[j].original_id,
                            title: this.gallery[i].images[j].title,
                            original_url: this.gallery[i].images[j].original_url,
                            thumb_url: this.gallery[i].images[j].thumb_url
                        });
                    }
                }
                this.initDropzoneWithExistingImages(0);
            },

            initDropzoneWithExistingImages(index) {
                if (this.dropzoneInitialized.includes(index)) {
                    return;
                }
                if (typeof this.gallery[index] === "undefined") {
                    return;
                }
                for (let i in this.gallery[index].images) {
                    let file = {
                        size: this.gallery[index].images[i].size,
                        name: this.gallery[index].images[i].file_name,
                        type: this.gallery[index].images[i].type
                    };
                    let url = this.gallery[index].images[i].original_url;
                    this.$refs.myVueDropzone[index].manuallyAddFile(file, url);
                }
                let el = document.getElementsByClassName('vue-dropzone')[index];
                let sortable = this.$sortable.create(el, {onUpdate: this.onDragUpdate});
                this.dropzoneInitialized.push(index);
            },

            openCrop: function (event) {
                let $el = $(event.target);
                let $container = $el.closest('.dz-preview');
                this.currentTitleIndex = $container.index() - 1;
                this.imageToCrop = this.images[this.selectedTab][this.currentTitleIndex].original_url;
                this.setOpenCropper(true);
            },

            changeTitleForImage: function (event) {
                this.displayTitle = true;
                let $el = $(event.target);
                let $container = $el.closest('.dz-preview');
                this.currentTitleIndex = $container.index() - 1;
                this.currentTitle = this.images[this.selectedTab][this.currentTitleIndex].title;
                this.titleY = $container.position().top + $container.height() + 22;
                this.titleX = $container.position().left + ($container.width() / 2) - 135;
                setTimeout(function () {
                    $el.closest('.gallery-part').find('.title-text').focus()
                }, 200);
            },

            closeTitle(event) {
                let $el = $(event.target);
                if ($el[0].className === 'dz-change') {
                    this.saveTitle();
                    event.preventDefault();
                } else {
                    this.displayTitle = false;
                    this.currentTitle = '';
                }
            },

            saveTitle() {
                this.images[this.selectedTab][this.currentTitleIndex].title = this.currentTitle;
                this.displayTitle = false;
                this.sendImagesToParent();
            },

            onDragUpdate: function (event) {
                this.images[this.selectedTab].splice(event.newIndex - 1, 0, this.images[this.selectedTab].splice(event.oldIndex - 1, 1)[0]);
                this.sendImagesToParent();
            },

            sendImagesToParent: function () {
                let result = [];
                for (let i in this.tabs) {
                    let item = {gallery: this.tabs[i]};
                    item.images = this.images[i];
                    result.push(item);
                }
                this.$emit('company-images', result);
            },

            successImageUpload(file, response) {
                if (typeof this.images[this.selectedTab] === "undefined") {
                    this.images[this.selectedTab] = [];
                }
                let el = document.getElementsByClassName('vue-dropzone')[this.selectedTab];
                let sortable = this.$sortable.create(el, {onUpdate: this.onDragUpdate});
                this.images[this.selectedTab].push({
                    file_name: file.name,
                    thumb_id: response.thumb_id,
                    original_id: response.original_id,
                    title: '',
                    original_url: response.original_url,
                    thumb_url: response.thumb_url
                });

                let $dropzone = $('.vue-dropzone').eq(this.selectedTab);
                let $preview = $dropzone.find('img[alt="' + file.name + '"]');
                $preview
                    .attr('width', 240)
                    .attr('height', 160)
                    .attr('src', response.thumb_url);
            },

            applyCroppedImage: function (cropped) {
                let $dropzone = $('.vue-dropzone').eq(this.selectedTab);
                let $preview = $dropzone.find('img').eq(this.currentTitleIndex);
                $preview.attr('src', cropped.url);
                this.images[this.selectedTab][this.currentTitleIndex].thumb_id = cropped.id;
                this.images[this.selectedTab][this.currentTitleIndex].thumb_url = cropped.url;
                this.setOpenCropper(false);
                this.sendImagesToParent();
            },

            uploadCompleted() {
                this.sendImagesToParent();
            },

            removeImage(file, error, xhr) {
                this.closeTitle();
                for (let i in this.images[this.selectedTab]) {
                    if (this.images[this.selectedTab][i].file_name === file.name) {
                        this.images[this.selectedTab].splice(i, 1);
                        break;
                    }
                }
                this.sendImagesToParent();
            },

            removeTab(index) {
                this.tabs.splice(index, 1);
                this.sendImagesToParent();
                this.selectedTab--;
                this.newTab = this.tabs[this.selectedTab].title;
            },

            addTab() {
                if (!this.newTab.trim()) return;
                this.newTab = 'Новая галерея';
                this.tabs.push({title: this.newTab});
                this.selectedTab++
            },

            updateSelected(index, tab) {
                this.selectedTab = index;
                this.newTab = tab.title;
                this.initDropzoneWithExistingImages(index);
            },

            editTab(tab) {
                tab.title = this.newTab
            }
        },

        watch: {
            gallery: function () {
                this.initWithExistingImages();
            }
        }
    }
</script>
