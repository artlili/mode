import Swiper from 'swiper/dist/js/swiper.min.js';

export const CarouselMixin = {
    methods: {
        /**
         * Add carousel in article content
         */
        runCarousel() {
            if (typeof window.galleryInitialized !== "undefined") {
                return;
            }
            this.initialize('carousel', 'carousel', 1);
            this.initialize('carousel2', 'carousel23', 2);
            this.initialize('carousel3', 'carousel23', 3);

            window.galleryInitialized = true;
        },

        initialize(initClass, prefix, slidesPerView) {
            let options, carousels, wrapper, initClassDot, prefixDot, html, i, j;
            initClassDot = '.' + initClass;
            prefixDot = '.' + prefix;
            // Find carousel elements
            carousels = document.getElementsByClassName(initClass);
            for (i = 0; i < carousels.length; i++) {
                carousels[i].classList.add(prefix + '-container');

                // Create wrapper
                wrapper = document.createElement('div');
                wrapper.classList.add(prefix + '-wrapper');

                // Go through children and add them to wrapper
                for (j = 0; j < carousels[i].children.length; j++) {
                    let slide = carousels[i].children[j].cloneNode(true);
                    slide.classList.add(prefix + '-slide');
                    wrapper.appendChild(slide);
                }

                // Add navigation and pagination
                html = '<div class="' + prefix + '-pagination">&nbsp;</div>';
                html += '<div class="' + prefix + '-button-next">&nbsp;</div>';
                html += '<div class="' + prefix + '-button-prev">&nbsp;</div>';
                carousels[i].innerHTML = html;

                carousels[i].prepend(wrapper); // Append wrapped slides to container
            }

            options = {
                navigation: {
                    nextEl: prefixDot + '-button-next',
                    prevEl: prefixDot + '-button-prev',
                },
                slideClass: prefix + '-slide',
                slideActiveClass: prefix + '-slide-active',
                slideDuplicatedActiveClass: prefix + '-slide-duplicate-active',
                slideVisibleClass: prefix + '-slide-visible',
                slideDuplicateClass: prefix + '-slide-duplicate',
                slideNextClass: prefix + '-slide-next',
                slideDuplicatedNextClass: prefix + '-slide-duplicate-next',
                slidePrevClass: prefix + '-slide-prev',
                slideDuplicatedPrevClass: prefix + '-slide-duplicate-prev',
                wrapperClass: prefix + '-wrapper',
                pagination: {
                    el: prefixDot + '-pagination',
                },
                loop: true
            };

            if (slidesPerView === 2) {
                options.slidesPerView = 2;
                options.spaceBetween = 20;
                options.breakpoints = {
                    // when window width is <= 767px
                    767: {
                        slidesPerView: 1
                    }
                }
            } else if (slidesPerView === 3) {
                options.slidesPerView = 3;
                options.spaceBetween = 15;
                options.breakpoints = {
                    // when window width is <= 767px
                    767: {
                        slidesPerView: 1
                    },
                    // when window width is <= 991px
                    991: {
                        slidesPerView: 2,
                        spaceBetween: 15
                    }
                }
            }

            // Run swiper carousel
            return new Swiper(initClassDot, options);
        }
    }
};
