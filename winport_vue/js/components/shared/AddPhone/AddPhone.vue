<style src="./AddPhone.scss" lang="scss" scoped></style>

<script>
    export default {
        name: "AddPhone",

        template: require('./AddPhone.html'),

        data() {
            return {
                showDropdown: false,
                internationalMultimaskUrl: '/data/international-phones.json',
                russianMultimaskUrl: '/data/russian-phones.json',
                maskOpts: {
                    inputmask: {
                        definitions: {
                            '#': {
                                validator: "[0-9]",
                                cardinality: 1
                            }
                        },
                        showMaskOnHover: false,
                        autoUnmask: true,
                        clearMaskOnLostFocus: false
                    },
                    match: /[0-9]/,
                    replace: '#',
                    listKey: "mask"
                },
                localPhone: this.currentPhone,
                localType: this.activePhone,
                $hint: null,
                countryBefore: null
            }
        },

        props: ['index', 'currentPhone', 'activePhone', 'country'],

        mounted: function () {
            this.prepareInputMask();
            this.$nextTick(function () {
                let $phone = $(this.$el).find('.phone');
                this.$hint = $(this.$el).find('.hint');
                $phone.on('input', this.onInput);
                $phone.on('focus', this.onFocus);
                $('.add-phone .hint').hide();
                this.applyInputMask($phone);
            });
        },

        methods: {
            applyInputMask: function ($phone) {
                if (this.country && this.country.label === 'Россия') {
                    $phone.inputmasks($.extend(true, {}, this.maskOpts, {
                        list: window.inputMaskListRussia,
                        onMaskChange: this.maskChangeRU
                    }));
                } else {
                    $phone.inputmasks($.extend(true, {}, this.maskOpts, {
                        list: window.inputMaskListCountries,
                        onMaskChange: this.maskChangeWorld
                    }));
                }
                this.countryBefore = this.country;
            },
            onFocus: function () {
                let $phone = $(this.$el).find('.phone');
                if (this.countryBefore !== this.country) {
                    this.applyInputMask($phone);
                }
                $('.add-phone .hint').hide();
                let $currentHint = $phone.closest('.add-phone').find('.hint');
                let text = $currentHint.text();
                if (text.length > 0) {
                    $currentHint.show();
                }
            },
            onInput: function (el) {
                this.localPhone = $(el.target)[0].inputmask._valueGet();
                this.sendPhoneToParent();
            },
            maskChangeWorld: function (maskObj, determined) {
                if (determined) {
                    let hint = maskObj.name_ru;
                    if (maskObj.desc_ru && maskObj.desc_ru != "") {
                        if (maskObj.name_ru.length > 0) {
                            hint += " (";
                        }
                        hint += maskObj.desc_ru;
                        if (maskObj.name_ru.length > 0) {
                            hint += ")";
                        }
                    }
                    this.$hint.html(hint).show();
                } else {
                    this.$hint.html('').hide();
                }
            },
            maskChangeRU: function (maskObj, determined) {
                if (determined) {
                    if (maskObj.type != "mobile") {
                        let hint = maskObj.city.toString();
                        if (maskObj.city.toString().length > 0) {
                            hint += " (";
                        }
                        hint += maskObj.region.toString();
                        if (maskObj.city.toString().length > 0) {
                            hint += ")";
                        }
                        this.$hint.html(hint).show();
                    } else {
                        this.$hint.html('Мобильный').show();
                    }
                } else {
                    this.$hint.html('').hide();
                }
            },
            prepareInputMask() {
                if (typeof window.inputMaskListCountries === "undefined") {
                    window.inputMaskListCountries = $.masksSort($.masksLoad(this.internationalMultimaskUrl), ['#'], /[0-9]|#/, "mask");
                }
                if (typeof window.inputMaskListRussia === "undefined") {
                    window.inputMaskListRussia = $.masksSort($.masksLoad(this.russianMultimaskUrl), ['#'], /[0-9]|#/, "mask");
                }
            },
            toggleDropdown() {
                this.showDropdown = true;
            },
            changePhone(phoneType) {
                this.localType = phoneType;
                this.showDropdown = false;
            },
            deletePhone() {
                this.$emit('deleteFields')
            },
            sendPhoneToParent() {
                let phone = {
                    index: this.index,
                    value: this.localPhone,
                    type: this.localType
                };
                this.$emit('company-phone', phone);
            }
        },

        computed: {
        },

        watch: {
            localPhone: function () {
                this.sendPhoneToParent();
            },
            localType: function () {
                this.sendPhoneToParent();
            }
        }
    }
</script>
