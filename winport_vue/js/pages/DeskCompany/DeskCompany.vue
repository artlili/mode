<script>
    import {VueSelectMixin} from '@/mixins/VueSelectMixin';
    import TinyMCE from '@/components/shared/TinyMCE/TinyMCE.vue';
    import TinyMCEAdvanced from '@/components/shared/TinyMCEAdvanced/TinyMCEAdvanced.vue';
    import CompanyAdressTabs from '@/components/shared/CompanyAdressTabs/CompanyAdressTabs.vue';
    import GalleryTabs from '@/components/shared/GalleryTabs/GalleryTabs.vue';
    import select2 from '@/components/shared/vue2-select/select2.vue';
    import VueCropper from 'vue-cropperjs';
    import FormElementError from '@/components/shared/FormElementError/FormElementError.vue';
    import SmoothScrollService from '@/services/SmoothScrollService';
    import vueSlider from 'vue-slider-component';
    import Fns from "@/components/shared/Fns/Fns.vue";
    import VerifyPhone from "@/components/shared/VerifyPhone/VerifyPhone.vue";
    import Reason from "@/components/shared/Reason/Reason.vue";
    import {mapState, mapActions, mapGetters, mapMutations} from "vuex";
    import {TheMask} from 'vue-the-mask';
    import DeskPageMenu from '@/components/shared/DeskPageMenu/DeskPageMenu.vue';
    import DeskSidebarMenu from '@/components/shared/DeskSidebarMenu/DeskSidebarMenu.vue';
    import StepperVertical from '@/components/shared/StepperVertical/StepperVertical.vue';
    import sanitizeOptions from '@/components/shared/TinyMCE/sanitizeOptions'

    export default {
        name: 'DeskCompany',

        template: require('./DeskCompany.html'),

        mixins: [VueSelectMixin],

        components: {
            'tiny-mce': TinyMCE,
            'tiny-mce-advanced' : TinyMCEAdvanced,
            'company-adress-tabs': CompanyAdressTabs,
            'gallery-tabs': GalleryTabs,
            VueCropper,
            'form-element-error': FormElementError,
            vueSlider,
            select2,
            'fns': Fns,
            TheMask,
            'verify-phone': VerifyPhone,
            'reason': Reason,
            'desk-page-menu': DeskPageMenu,
            'desk-sidebar-menu': DeskSidebarMenu,
            'stepper-vertical': StepperVertical
        },

        data: () => {
            return {
                mode: 'new',
                is_admin: false,

                fileName: '',
                verificationFile: null,

                imgSrc: '',
                cropImg: '',
                hideUploadBtn: 1,
                logo_original_url: '',

                company: {
                    id: '',
                    name: '',
                    alias: '',
                    introtext: '',
                    text: '',
                    logo_original: '',
                    logo: '',
                    addresses: [],
                    contacts: [],
                    workingTime: [],
                    images: [],
                    selectedSections: [],
                    registrationCountry: '',
                    unp_inn: '',
                    contact_person: '',
                    registration_phone: '',
                    registrationPhoneVerified: false,
                    name_suffix: '',
                    legal_entity_title: '',
                    additional_info: '',
                    title: '',
                    keywords: '',
                    description: '',
                    branches: [],
                    gallery: [],
                    verification_file_url: '',
                    verified: false,
                    verification_status: '',
                    additional_verification_status: '',
                    temporary_link: '',
                    published: false,
                    moderation: 2,
                    moderation_details: '',
                    isSelectInitialized: false
                },

                errors: {},

                zoomImg: 100,
                zoomProcessStyle: {backgroundColor: 'blue'},
                parents: [],

                sectionUrl: 'http://api.' + window.location.host + '/v1/section',
                userTouched: false,
                countries: [],
                verifyCountry: 'Belarus',
                verifyCountryCode: '+375',
                showVerifyPhoneDropdown: false,
                validCountry: true,
                currentMask: '## #######',
                maskedPhone: '',
                unmaskedPhone: '',
                currentPhoneLimit: 0,
                phoneVerified: false,

                fnsInfo: {},
                fnsStatus: 'ok',
                fnsErrorMessage: '',
                pageMenu: [
                  {'title': 'Все компании', 'link': '/desk-company/list', 'name': 'desk-company-list'},
                  {'title': 'Добавить компанию', 'link': '/desk-company/create', 'name': 'desk-company-create'}
                ],
                moderateOptions: [
                    {'label': 'Необработана', value: 1},
                    {'label': 'Промодерирована', value: 2},
                    {'label': 'Отказано в публикации', value: 3},
                    {'label': 'Отложен', value: 4},
                    {'label': 'Удален автоматически', value: 5},
                ],
                newModerate: {label: 'Промодерирована', value: 2},
                isFirst: true
            }
        },

        mounted() {
            this.fetchData()
        },

        computed: {
            isStep1Error: function () {
                let hasError = this.errors.hasOwnProperty('name');
                hasError = hasError || this.errors.hasOwnProperty('alias');
                hasError = hasError || this.errors.hasOwnProperty('selectedSections');
                hasError = hasError || this.errors.hasOwnProperty('introtext');

                return hasError;
            },

            isStep4Error: function () {
                let hasError = this.errors.hasOwnProperty('error_tabs') && (this.errors.error_tabs.length > 0);

                return hasError;
            },

            isStep6Error: function () {
                let hasError = this.errors.hasOwnProperty('contact_person');
                hasError = hasError || this.errors.hasOwnProperty('legal_entity_title');
                hasError = hasError || this.errors.hasOwnProperty('name_suffix');
                hasError = hasError || this.errors.hasOwnProperty('registrationCountry');
                hasError = hasError || this.errors.hasOwnProperty('unp_inn');

                return hasError;
            },

            verificationStatus: function () {
                let start = this.company.verification_status;
                if (this.company.additional_verification_status.length > 0) {
                    return start + " (" + this.company.additional_verification_status + ")";
                }
                return start;
            },

            publicStatus: function () {
                return this.company.published ? 'Опубликована' : 'Не опубликована'
            },

            moderationStatus: function () {
                let moderationWording = this.moderateStatusToWording(this.company.moderation);
                if (this.company.moderation_details.length) {
                    return `${moderationWording} (${this.company.moderation_details})`;
                } else {
                    return moderationWording;
                }
            },

            publicLink: function () {
                return this.company.published ?
                    'http://' + window.location.host + '/company/' + this.company.alias :
                    'http://' + window.location.host + '/temporary/company/' + this.company.temporary_link;
            },

            wrongBelarusNumber() {
                if (this.verifyCountry === 'Belarus') {
                    if (this.maskedPhone.length >= 2) {
                        return !(
                            (this.maskedPhone.startsWith('25'))
                            || (this.maskedPhone.startsWith('29'))
                            || (this.maskedPhone.startsWith('33'))
                            || (this.maskedPhone.startsWith('44'))
                        );
                    }
                }
                return false;
            },

            removeVerificationFile: function () {
                if (confirm('Вы действительно хотите удалить файл для верификации?')) {
                    let data = new FormData();
                    data.append('verificationFile', this.verificationFile);
                    data.append('companyId', this.company.id);

                    this.$store.dispatch('deleteDeskCompanyVerificationFile', {data: data}).then(() => {
                        let response = this.$store.getters.uploadDeskCompanyVerificationFile;

                        if (response.success === true) {
                            this.$notify({
                                title: 'Верифицирующий документ успешно удален!',
                                type: 'success',
                                duration: 5000
                            });
                            this.company.verification_file_url = '';
                        } else {
                            this.$notify({
                                title: 'Ошибка удаления верифицирующего документа',
                                type: 'error',
                                duration: 5000,
                                text: response.error
                            });
                        }
                    });
                }
            },

            confirmButton() {
                if (this.phoneVerified) {
                    return 'Подтвержден';
                }

                return 'Подтвердить';
            },

            fullVerifyPhone() {
                if (this.validCountry) {
                    return this.verifyCountryCode + this.maskedPhone;
                } else {
                    return this.unmaskedPhone;
                }
            },

            companyAlias: {
                get: function () {
                    if (this.userTouched && this.company.alias.length > 0) {
                        return this.company.alias;
                    } else {
                        return this.rusToLatin(this.company.name);
                    }
                },
                set: function (newValue) {
                    this.company.alias = newValue;
                }
            },

            nalogLabel() {
                switch (this.company.registrationCountry.label) {
                    case 'Беларусь':
                        return 'УНП';
                    case 'Россия':
                        return 'ИНН';
                    default:
                        return 'Налоговый номер'
                }
            },
            nalogLabelPlaceholder() {
                switch (this.company.registrationCountry.label) {
                    case 'Беларусь':
                        return 'Введите УНП (учётный номер плательщика)';
                    case 'Россия':
                        return 'Введите ИНН (индивидуальный номер налогоплательщика)';
                    default:
                        return 'Введите налоговый номер'
                }
            },
            showNalogRequestButton() {
                switch (this.company.registrationCountry.label) {
                    case 'Беларусь':
                    case 'Россия':
                        return true;
                }
                return false;
            },
            enableNalogRequestButton() {
                return (this.showNalogRequestButton && this.company.unp_inn.length > 0);
            }
        },

        methods: {
            ...mapMutations(['setOpenVerifyPhone', 'setOpenFns', 'setOpenReason']),

            assignCurrentPageFnsInfo: function(info) {
                this.fnsStatus = 'ok';
                this.fnsInfo = info;
            },

            downloadVerificationFile: function() {
                this.$store.dispatch('downloadVerificationFile', this.company.verification_file_url);
            },

            onChangeModerate(newOption) {
                if (this.isFirst) {
                    this.isFirst = false;
                    return;
                }
                if (newOption.value === 3) {
                    this.setOpenReason({open: true, mode: 'moderate'});
                } else {
                    this.sendModerationToServer({company_id: this.company.id, moderation: newOption.value, reason: ''})
                }
            },

            moderateStatusToWording: function(moderate) {
                let moderationWording;
                switch (moderate) {
                    case 1:
                        moderationWording = 'Необработана';
                        break;
                    case 2:
                        moderationWording = 'Промодерирована';
                        break;
                    case 3:
                        moderationWording = 'Отказано в публикации';
                        break;
                    case 4:
                        moderationWording = 'Отложен';
                        break;
                    case 5:
                        moderationWording = 'Удален автоматически';
                        break;
                }

                return moderationWording;
            },

            scrollToVerify() {
                new SmoothScrollService().scrollToAnchor('verify');
            },

            markPhoneVerified() {
                this.phoneVerified = true;
                this.company.registration_phone = this.fullVerifyPhone;
                this.company.registrationPhoneVerified = true;
            },

            saveNewCompany: function () {
                this.$store.dispatch('createDeskCompany', this.company).then(() => {
                    let response = this.$store.getters.getCreateDeskCompany;
                    if (response.success === true) {
                        let text;
                        this.company.id = response.companyId;
                        if (this.fileName) {
                            text = 'Загружаем верифицирующий документ';
                            this.uploadVerificationDocument();
                        } else {
                            text = 'Компания отправлена на верификацию';
                            this.$router.push('/desk-company/list');
                        }
                        this.$notify({
                            title: 'Компания успешно сохранена!',
                            type: 'success',
                            duration: 5000,
                            text: text
                        });
                    } else {
                        new SmoothScrollService().scrollToTop();
                        this.errors = response.errors;
                        this.$notify({
                            title: 'Ошибка сохранения компании',
                            type: 'error',
                            text: 'К сожалению, мы не смогли сохранить компанию. Проверьте форму на наличие ошибок.',
                            duration: 5000
                        });
                    }
                });

            },

            saveEditedCompany: function () {
                this.$store.dispatch('updateDeskCompany', this.company).then(() => {
                    let response = this.$store.getters.getUpdateDeskCompany;
                    if (response.success === true) {
                        let text;
                        this.company.id = response.companyId;
                        if (this.fileName) {
                            text = 'Загружаем верифицирующий документ';
                            this.uploadVerificationDocument();
                        } else {
                            if (response.validationRequired) {
                                text = 'Компания отправлена на верификацию';
                            } else {
                                text = 'Повторная верификация не требуется';
                            }
                            setTimeout(() => this.$router.push('/desk-company/list'), 5000);
                        }
                        this.$notify({
                            title: 'Компания успешно сохранена!',
                            type: 'success',
                            duration: 5000,
                            text: text
                        });
                    } else {
                        new SmoothScrollService().scrollToTop();
                        this.errors = response.errors;
                        this.$notify({
                            title: 'Ошибка сохранения компании',
                            type: 'error',
                            text: 'К сожалению, мы не смогли сохранить компанию. Проверьте форму на наличие ошибок.',
                            duration: 5000
                        });
                    }
                });
            },

            saveCompany() {
                $('.hint').hide();
                this.company.registration_phone = this.fullVerifyPhone;
                if (this.mode === 'new') {
                    this.saveNewCompany();
                } else {
                    this.saveEditedCompany();
                }
            },

            uploadVerificationDocument() {
                if (!this.fileName) {
                    return;
                }

                let data = new FormData();
                data.append('verificationFile', this.verificationFile);
                data.append('companyId', this.company.id);

                this.$store.dispatch('uploadDeskCompanyVerificationFile', {data: data}).then(() => {
                    let response = this.$store.getters.uploadDeskCompanyVerificationFile;

                    if (response.success === true) {
                        this.$notify({
                            title: 'Верифицирующий документ успешно сохранен!',
                            type: 'success',
                            duration: 5000
                        });
                        setTimeout(() => this.$router.push('/desk-company/list'), 5000);
                    } else {
                        this.$notify({
                            title: 'Ошибка сохранения верифицирующего документа',
                            type: 'error',
                            duration: 5000,
                            text: response.error
                        });
                    }
                })
            },

            assignSelectedOptions: function (values) {
                this.company.selectedSections = values;
                this.company.isSelectInitialized = true;
            },

            confirmCode: function () {
                this.$store.dispatch('checkIfPhoneVerified', {phone: this.fullVerifyPhone}).then(() => {
                    let result = this.$store.getters.getIfVerifiedResponse;
                    if (result.status === 'verified') {
                        this.phoneVerified = true;
                        this.company.registrationPhoneVerified = true;
                    } else {
                        this.phoneVerified = false;
                        this.setOpenVerifyPhone(true);
                        this.company.registration_phone = this.fullVerifyPhone;
                        this.company.registrationPhoneVerified = false;
                    }
                });
            },

            switchToRussianVerification: function () {
                this.verifyCountryCode = '+7';
                this.verifyCountry = 'Russia';
                this.currentMask = '(###)###-##-##';
                this.validCountry = true;
                this.currentPhoneLimit = 10;
            },

            switchToBelarusVerification: function () {
                this.verifyCountryCode = '+375';
                this.verifyCountry = 'Belarus';
                this.currentMask = '## #######';
                this.validCountry = true;
                this.currentPhoneLimit = 9;
            },

            switchToNonameVerification: function () {
                this.verifyCountryCode = '+';
                this.verifyCountry = "";
                this.validCountry = false;
            },

            changePhone: function (country) {
                switch (country) {
                    case 'Russia':
                        this.switchToRussianVerification();
                        this.$nextTick(function () {
                            $(this.$el).find('input[type=tel]').select();
                        });
                        this.company.registration_phone = this.fullVerifyPhone;
                        this.company.registrationPhoneVerified = false;
                        break;
                    case 'Belarus':
                        this.switchToBelarusVerification();
                        this.$nextTick(function () {
                            $(this.$el).find('input[type=tel]').select();
                        });
                        this.company.registration_phone = this.fullVerifyPhone;
                        this.company.registrationPhoneVerified = false;
                        break;
                    default:
                        this.switchToNonameVerification();
                        this.$nextTick(function () {
                            $('#verifyPhone').select();
                        });
                        this.company.registration_phone = this.fullVerifyPhone;
                        this.company.registrationPhoneVerified = true;
                        break;
                }
                this.showVerifyPhoneDropdown = false;
            },

                initCompanyEditMode: function () {
                this.$store.dispatch('getDeskCompany', this.$route.params.id).then(() => {
                    let response = this.$store.getters.getDeskCompany;
                    if (response.success) {
                        this.userTouched = true;
                        this.mode = 'edit';
                        if (response.is_admin) {
                            tinymce.remove();
                        }
                        this.is_admin = response.is_admin;
                        this.company = response.company;
                        this.setupLogoOfCompany();
                        this.setupBranches();
                        this.setupImages();
                        this.setupVerificationBlock();
                        this.newModerate = {label: this.moderateStatusToWording(this.company.moderation), value: this.company.moderation};
                        if (this.is_admin) {
                            this.requestDirectFns();
                        }
                        if (this.company.shouldSanitize) {
                            this.company.text = sanitizeHtml(this.company.text, sanitizeOptions);
                        }
                    } else {
                        this.$notify({
                            title: 'Ошибка получения данных о компании',
                            type: 'error',
                            text: 'К сожалению, мы не смогли получить данные о компании. Попробуйте позже.',
                            duration: 5000
                        });
                        setTimeout(() => this.$router.push('/desk-company/list'), 5000);
                    }
                });
            },

            verifyCompany: function () {
                this.$store.dispatch('verifyDeskCompany', {id: this.company.id}).then(() => {
                    let response = this.$store.getters.getVerifyDeskCompany;
                    if (response.success) {
                        this.company.verified = true;
                        this.$notify({
                            title: 'Компания успешно верифицирована',
                            type: 'success',
                            duration: 5000
                        });
                        setTimeout(() => this.$router.push('/desk-company/list'), 5000);
                    } else {
                        this.$notify({
                            title: 'Ошибка верификации',
                            type: 'error',
                            duration: 5000,
                            text: response.error
                        });
                    }
                })
            },

            dontVerifyCompany: function () {
                this.setOpenReason({open: true, mode: 'verify'});
            },

            sendVerifyReasonToServer: function (reason) {
                this.$store.dispatch('dontVerifyDeskCompany', {id: this.company.id, reason: reason}).then(() => {
                    let response = this.$store.getters.getVerifyDeskCompany;
                    if (response.success) {
                        this.company.verified = false;
                        this.$notify({
                            title: 'В верификации компании успешно отказано',
                            type: 'success',
                            duration: 5000
                        });
                        setTimeout(() => this.$router.push('/desk-company/list'), 5000);
                    } else {
                        this.$notify({
                            title: 'Ошибка отказа в верификации',
                            type: 'error',
                            duration: 5000,
                            text: response.error
                        });
                    }
                })
            },

            sendModerationToServer: function(payload) {
                this.$store.dispatch('moderationDeskCompany', payload).then(() => {
                    let response = this.$store.getters.getModerationDeskCompany;
                    if (response.success) {
                        this.company.moderation = payload.moderation;
                        this.company.moderation_details = payload.reason;
                        let publishedBefore = this.company.published;
                        this.company.published = response.company_published;
                        this.isFirst = true;
                        this.newModerate = {label: this.moderateStatusToWording(this.company.moderation), value: this.company.moderation};
                        this.$notify({
                            title: 'Статус модерации компании успешно изменен',
                            type: 'success',
                            duration: 5000
                        });
                        if (publishedBefore !== this.company.published) {
                            this.$notify({
                                title: 'Статус публикации компании успешно изменен на ' + (this.company.published ? 'опубликована' : 'не опубликована'),
                                type: 'warning',
                                duration: 5000
                            });
                        }
                    } else {
                        this.$notify({
                            title: 'Ошибка смена статуса модерации',
                            type: 'error',
                            duration: 5000,
                            text: response.error
                        });
                    }
                })
            },

            sendModerationReasonToServer: function (reason) {
                this.sendModerationToServer({company_id: this.company.id, moderation: 3, reason: reason})
            },

            sendReasonToServer: function (reason) {
                if (reason.mode === 'verify') {
                    this.sendVerifyReasonToServer(reason.reason);
                } else {
                    this.sendModerationReasonToServer(reason.reason);
                }
            },

            setupLogoOfCompany: function () {
                if (this.company.logo_url) {
                    $('.crop-img').width(320).height(170);
                    this.hideUploadBtn = 3;
                    this.imgSrc = this.company.logo_url;
                    this.cropImg = this.company.logo_url;
                }
                if (this.company.logo_original_url) {
                    this.logo_original_url = this.company.logo_original_url;
                }
            },

            setupBranches: function () {
                this.company.branches = {
                    addresses: this.company.addresses,
                    contacts: this.company.contacts,
                    workingTime: this.company.workingTime
                };
            },

            setupImages: function () {
                this.company.gallery = this.company.images;
            },

            setupVerificationBlock: function () {
                if (this.company.registration_phone.substr(0, 2) === '+7') {
                    this.maskedPhone = this.company.registration_phone.substr(2);
                    this.switchToRussianVerification();
                } else if (this.company.registration_phone.substr(0, 4) === '+375') {
                    this.maskedPhone = this.company.registration_phone.substr(4);
                    this.switchToBelarusVerification();
                } else {
                    this.unmaskedPhone = this.company.registration_phone;
                    this.switchToNonameVerification();
                }
            },

            fetchData: function () {
                this.$store.dispatch('getCountries').then(() => {
                    this.countries = this.$store.getters.getCountries;
                });
                if (this.$route.params.id) {
                    this.initCompanyEditMode();
                }
            },

            requestFns: function () {
                this.setOpenFns(true);
            },

            requestDirectFns: function () {
                this.$store.dispatch('getDeskCompanyFns', {
                    country: this.company.registrationCountry.label,
                    nalogNumber: this.company.unp_inn
                }).then(() => {
                    this.fnsStatus = this.$store.getters.getFnsStatus;
                    this.fnsErrorMessage = this.$store.getters.getFnsErrorMessage;
                    this.fnsInfo = this.$store.getters.getFnsInfo;
                });
            },

            rusToLatin: function (str) {
                let ru = {
                    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
                    'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i',
                    'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
                    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
                    'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh',
                    'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya',
                    ' ': '-'
                }, n_str = [];

                str = str.trim();
                str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i');

                for (let i = 0; i < str.length; ++i) {
                    n_str.push(
                        ru[str[i]]
                        || ru[str[i].toLowerCase()] == undefined && str[i]
                        || ru[str[i].toLowerCase()].replace(/^(.)/, function (match) {
                            return match.toUpperCase()
                        })
                    );
                }

                return n_str.join('').toLowerCase().replace(/[^0-9a-z\-]/gi, '');
            },

            zoomChange: function (value) {
                let canvasData = this.$refs.cropper.getCanvasData();
                let coefWidth = 540 / canvasData.naturalWidth;
                let coefHeight = 360 / canvasData.naturalHeight;
                let coef = Math.min(coefHeight, coefWidth);
                let zoomSize = (0.8 + (value / 100 * 0.2)) * coef;
                this.$refs.cropper.zoomTo(zoomSize);
            },

            assignCompanyAddress: function (addresses) {
                this.company.addresses = addresses;
            },

            assignCompanyImages: function (images) {
                this.$set(this.company, 'images', images);
            },

            assignCompanyContacts: function (contacts) {
                this.company.contacts = contacts;
            },

            assignCompanyTime: function (workingTime) {
                this.company.workingTime = workingTime;
            },

            getFileName(event) {
                this.fileName = event.target.files[0].name;
                this.verificationFile = event.target.files[0];
            },

            setImage(e) {
                const file = e.target.files[0];

                if (!file.type.includes('image/')) {
                    alert('Please select an image file');
                    return;
                }
                if (typeof FileReader === 'function') {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        let img = new Image();
                        img.src = event.target.result;
                        let that = this;

                        img.onload = function () {
                            let height = this.height;
                            let width = this.width;
                            if ((height < 360) || (width < 540)) {
                                let yourLogo = "Размер вашего логотипа " + width + 'x' + height + 'px не подходит.';
                                alert(yourLogo + " Размер логотипа должен быть минимум 540x360px");
                                return false;
                            } else {
                                that.uploadOriginalImage(file, that, event);
                            }
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Sorry, FileReader API not supported');
                }
            },
            uploadOriginalImage(file, that, event) {
                let data = new FormData();
                data.append('logo', file);

                this.$store.dispatch('uploadDeskCompanyLogoOriginal', {data: data}).then(() => {
                    let response = this.$store.getters.uploadDeskCompanyLogoOriginal;

                    if (response.success === true) {
                        that.imgSrc = event.target.result;
                        $('.crop-img__container').css({top: '0px'});
                        // rebuild cropperjs with the updated source
                        that.$refs.cropper.replace(event.target.result);
                        that.hideUploadBtn = 2;
                        this.logo_original_url = response.logo_url;
                        this.company.logo_original = response.logo_id;
                        this.company.logo = response.logo_resized_id;
                        this.$set(this.errors, 'logo', "");
                    } else {
                        new SmoothScrollService().scrollToTop();
                        this.$set(this.errors, 'logo', response.errors);
                    }
                });
            },

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
                // get image data for post processing, e.g. upload or setting image src
                this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
                this.hideUploadBtn = 3

                let data = new FormData();
                data.append('logo', this.dataURItoBlob(this.cropImg));

                $('.crop-img').width(320).height(170);

                this.$store.dispatch('uploadDeskCompanyLogoThumb', {data: data}).then(() => {
                    let response = this.$store.getters.uploadDeskCompanyLogoThumb;

                    if (response.success === true) {
                        this.company.logo = response.logo_id;
                    } else {
                        new SmoothScrollService().scrollToTop();
                        this.$set(this.errors, 'logo', response.errors);
                    }
                });
            },
            rotateImage() {
                // guess what this does :)
                this.$refs.cropper.rotate(90);
            },
            deleteImage() {
                this.imgSrc = '';
                this.hideUploadBtn = 1;
                this.logo_original_url = '';
                this.company.logo = '';
                this.company.logo_original = '';
                delete this.errors.logo;
                this.zoomImg = 100;
                $('.crop-img').width(590).height(360);
                $('.crop-img__container').css({top: '20px'});
            }
        },

        watch: {
            companyAlias() {
                this.company.alias = this.companyAlias;
            },

            unmaskedPhone() {
                this.company.registration_phone = this.fullVerifyPhone;
                this.company.registrationPhoneVerified = true;
            },

            maskedPhone() {
                this.phoneVerified = false;
            }
        }
    }
</script>
