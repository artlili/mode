<script>
    import VueGallery from 'vue-gallery';
    import {CarouselMixin} from '@/mixins/CarouselMixin';

    export default {
        name: "gallery",

        template: require('./Gallery.html'),

        mixins: [CarouselMixin],

        components: {
            'big-gallery': VueGallery
        },

        props: ['id'],

        data() {
            return {
                gallery: {
                    'columns': '',
                    'width': '',
                    'height': '',
                    'max_width': '',
                    'is_carousel': '',
                    'is_full_screen': '',
                    'images': []
                },
                carouselClass: "",
                carouselStyle: {},
                imageIndex: null,
                bigImagesUrls: [],
                descriptions: [],
                initialized_gallery: 0
            }
        },

        methods: {
            click(e) {
                if (this.gallery.is_full_screen === 0) {
                    return;
                }
                const currentUrl = $(e.target).data('main_url');
                for (let i in this.bigImagesUrls) {
                    if (this.bigImagesUrls[i] === currentUrl) {
                        this.imageIndex = parseInt(i);
                        return;
                    }
                }
            },
            fetchData() {
                this.gallery = {};
                this.bigImagesUrls = [];
                this.descriptions = [];

                this.$store.dispatch('getGallery', [this.galleryId]).then(() => {
                    this.gallery = this.$store.getters.getGallery;
                    this.setCarouselStyle();
                    this.setCarouselClass();

                    for (let i in this.gallery.images) {
                        this.bigImagesUrls.push(this.gallery.images[i].main_url);
                        this.descriptions.push(this.gallery.images[i].title);
                    }

                    $(document).on('click', '.image_gallery', this.click);

                    setTimeout(this.runCarousel, 100);
                });
            },

            setCarouselClass() {
                this.carouselClass = '';
                if (this.gallery.is_carousel === 0) {
                    this.carouselClass = '';
                } else {
                    if (this.gallery.columns === 1) {
                        this.carouselClass = 'carousel';
                    }
                    if (this.gallery.columns === 2) {
                        this.carouselClass = 'carousel2';
                    }
                    if (this.gallery.columns === 3) {
                        this.carouselClass = 'carousel3';
                    }
                }
            },

            setCarouselStyle() {
                let cursor = 'default';
                if (this.gallery.is_full_screen === 1) {
                    cursor = 'pointer';
                }
                this.carouselStyle = {maxWidth: this.gallery.max_width + 'px', cursor: cursor};
            },

            onSlideCustom(index, slide) {
                this.$emit('onslide', {index, slide});

                const description = this.descriptions[index];
                const node = $('#' + this.bigGalleryId).find('.description span');
                if ((typeof description !== "undefined") && (description !== null)) {
                    node.css({opacity: 0.7});
                    node.empty();
                    node[0].appendChild(document.createTextNode(description));
                } else {
                    node.css({opacity: 0});
                }
            }
        },

        computed: {
            galleryId() {
                const regex = /##gallery-(\d+)##/i;
                let matches = this.id.match(regex);
                if (matches !== null && typeof matches[1] !== "undefined") {
                    return matches[1];
                }
            },

            bigGalleryId() {
                return 'big' + this.galleryId + Math.floor(Math.random() * 10000) + 1
            },

            bigGalleryOptions() {
                return {
                    onslide: this.onSlideCustom
                }
            }
        },

        created() {
            this.fetchData();
        },

        watch: {
            'galleryId': function () {
                this.fetchData();
            }
        }
    }
</script>