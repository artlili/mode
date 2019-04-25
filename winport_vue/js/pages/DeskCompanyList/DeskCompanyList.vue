import { lstatSync } from "fs";

<!--<template src="./DeskCompanyList.html"></template>-->
<style src="./DeskCompanyList.scss" lang="scss" scoped></style>

<script>
    import ConfigService from '@/services/ConfigService';
    import DeskPageMenu from '@/components/shared/DeskPageMenu/DeskPageMenu.vue';
    import DeskSidebarMenu from '@/components/shared/DeskSidebarMenu/DeskSidebarMenu.vue';
    import CompanyContact from '@/components/shared/CompanyContact/CompanyContact.vue';
    import {mapMutations} from 'vuex';

    export default {
        name: 'DeskCompanyList',

        template: require('./DeskCompanyList.html'),

        data() {
            return {
                page: {
                    deskCompanies: {},
                    lastRequests: {},
                    items: []
                },
                companyHistory: '',
                noImageUrls: ConfigService.getSetting('noImageUrl'),

                currentCompany: '',

                companyContactsId: '',
                companyContactsPrompt: '',

                selectedCompanyTab: "phones",
                isShowCompanyFeedback: false,
                pageMenu: [
                    {'title': 'Все компании', 'link': '/desk-company/list', 'name': 'desk-company-list'},
                    {'title': 'Добавить компанию', 'link': '/desk-company/create', 'name': 'desk-company-create'}
                ],
            };
        },

        components: {
            'desk-page-menu': DeskPageMenu,
            'desk-sidebar-menu': DeskSidebarMenu,
            'company-contact': CompanyContact
        },
        mounted() {
            this.fetchData();
        },
        methods: {
            ...mapMutations(['setOpenCompanyContact']),

            isHistoryExists: function (companyId) {
                for (const i in this.page.lastRequests) {
                    if (this.page.lastRequests[i].company_id == companyId) {
                        return true;
                    }
                }

                return false;
            },

            fetchData() {
                this.$store.dispatch('getDeskCompanies').then(() => {
                    this.page = this.$store.getters.getDeskCompanies;
                });
            },
            openGeneralCompanyContact(item, index) {
                this.currentCompany = item
                this.isShowCompanyFeedback = false;
                this.setOpenCompanyContact(true);
                this.companyContactsId = ''
                this.companyHistory = ''

            },
            showHistory(item) {
                if (this.companyHistory === item.id) {
                    this.companyContactsId = ''
                    this.companyHistory = ''
                } else {
                    this.companyContactsId = item.id
                    this.companyHistory = item.id
                }

            }
        }
    }
</script>
