<!--<template src="./Companies.html"></template>-->

<script>
    import ConfigService from '@/services/ConfigService';
    import MetaTagsService from '@/services/MetaTagsService';
    import Pagination from '@/components/shared/Pagination/Pagination.vue';
    import Banner from '@/components/shared/Banner/Banner.vue';
    import CatalogFilterCity from '@/components/shared/CatalogFilterCity/CatalogFilterCity.vue';
    import CatalogMenuRight from '@/components/shared/CatalogMenuRight/CatalogMenuRight.vue';
    import CatalogFilterRight from '@/components/shared/CatalogFilterRight/CatalogFilterRight.vue';
    import VueRecaptcha from 'vue-recaptcha';
    import FormElementError from '@/components/shared/FormElementError/FormElementError.vue';
    import CompanyContact from '@/components/shared/CompanyContact/CompanyContact.vue';
    import {mapMutations} from 'vuex';

    export default {
        name: 'Companies',

        template: require('./Companies.html'),

        components: {
            'pagination': Pagination,
            'banner': Banner,
            'catalog-filter-city': CatalogFilterCity,
            'catalog-menu-right': CatalogMenuRight,
            'catalog-filter-right': CatalogFilterRight,
            'vue-recaptcha' : VueRecaptcha,
            'form-element-error': FormElementError,
            'company-contact' : CompanyContact
        },

        data() {
            return {
                page: {
                    'items': [],
                    'section': [],
                    'favoriteCompanies': [],
                    'pagination': {}
                },
                sections: [],
                noImageUrls: ConfigService.getSetting('noImageUrl'),
                opennedAlias: null,
                companyContactsId: '',
                companyContactsPrompt: '',
                search: '',
                sort: '',
                selectedCompanyTab: "phones",
                isShowCompanyFeedback: false,
                today: ''
            };
        },

        created() {
            this.fetchData(this.pagination.current_page);
            this.fetchSections();
        },

        mounted() {
            this.sort = (typeof this.$route.query.sort !== "undefined") ? this.$route.query.sort : "asc";
            this.search =  (typeof this.$route.query.search!== "undefined") ? this.$route.query.search : '';
        },

        computed: {
            selectedCompany() {
                return this.page.items[this.companyContactsId];
            },

            pagination() {
                return this.page.pagination;
            },

            companiesAlias: function () {
                return this.$route.params.companiesAlias;
            },
            dayIsToday() {
                let date = new Date();
                return date.getDay()
            },

            companiesTop() {
                let companies = [];
                if (!this.page.items.length) {
                    return companies;
                }

                for (let i in this.page.items) {
                    if (this.page.items[i].plan_top) {
                        companies.push(this.page.items[i]);
                    }
                }

                return companies;
            },

            companiesGeneral() {
                let companies = [];
                if (!this.page.items.length) {
                    return companies;
                }

                for (let i in this.page.items) {
                    if (!this.page.items[i].plan_top) {
                        companies.push(this.page.items[i]);
                    }
                }

                return companies;
            }
        },

        methods: {
            ...mapMutations(['setOpenCompanyContact']),
            companyWorkingDay(days) {
                var day = Object.keys(days)
                return day
                let workingTime = days
                // for(let day in days){
                //     workingTime.push(day)
                    
                // }
                var index = Object.keys(workingTime)
                    for(let i in index){
                        if(i == this.isToday) return Object.values(workingTime)
                    }
            },
            companyWorkingTime(days) {
                var hour = Object.values(days)
                return hour
                let workingTime = days
                // for(let day in days){
                //     workingTime.push(day)
                    
                // }
                var index = Object.keys(workingTime)
                    for(let i in index){
                        if(i == this.isToday) return Object.values(workingTime)
                    }
            },
            openGeneralCompanyContact(i, index) {
                this.companyContactsId = (i-1)*2 + index + this.companiesTop.length;
                this.isShowCompanyFeedback = false;
                this.selectedCompanyTab = 'phones';
                this.setOpenCompanyContact(true);
            },

            fetchSearchDataCompany() {
                var data = Object.assign({}, this.$route.query);
                data['search'] = this.search;
                data['sort'] = this.sort;
                if (typeof this.companiesAlias !== "undefined") {
                    this.$router.push({path: `/companies/${this.companiesAlias}`, query: data});
                } else {
                    this.$router.push({name: 'companies', query: data});
                }
                this.fetchData();
            },

            fetchSearchDataAscCompany() {
                var data = Object.assign({}, this.$route.query);
                data['search'] = this.search;
                this.sort = 'asc';
                data['sort'] = this.sort;
                if (typeof this.companiesAlias !== "undefined") {
                    this.$router.push({path: `/companies/${this.companiesAlias}`, query: data});
                } else {
                    this.$router.push({name: 'companies', query: data});
                }
                this.fetchData();
            },

            fetchSearchDataDescCompany() {
                var data = Object.assign({}, this.$route.query);
                data['search'] = this.search;
                this.sort = 'desc';
                data['sort'] = this.sort;
                if (typeof this.companiesAlias !== "undefined") {
                    this.$router.push({path: `/companies/${this.companiesAlias}`, query: data});
                } else {
                    this.$router.push({name: 'companies', query: data});
                }

                this.fetchData();
            },

            fetchData() {
                this.sort = (typeof this.$route.query.sort !== "undefined") ? this.$route.query.sort : "asc";
                this.search =  (typeof this.$route.query.search!== "undefined") ? this.$route.query.search : '';

                this.$store.dispatch('getCompanies', [this.$route.params.companiesAlias, this.$route.params.companiesPage, this.search, this.sort]).then(() => {
                    this.page = this.$store.getters.getCompanies;
                });
            },

            fetchSections() {
                this.$store.dispatch('getSections').then(() => {
                    this.sections = this.$store.getters.getSections;
                    this.changeOpennedAlias();
                });
            },

            changeOpennedAlias() {
                let route = this.$route.params.companiesAlias;
                for (let i in this.sections) {
                    if (this.sections[i].alias === route) {
                        this.opennedAlias = this.sections[i].alias;
                        return;
                    }

                    if (this.sections[i].items.length) {
                        for (let j in this.sections[i].items) {
                            if (this.sections[i].items[j].alias === route) {
                                this.opennedAlias = this.sections[i].alias;
                                return;
                            }
                        }
                    }
                }
            }
        },

        watch: {
            '$route.params.companiesAlias': function (newRoute, oldRoute) {
                this.fetchData();
                this.changeOpennedAlias();
            },
            '$route.params.companiesPage': function (newRoute, oldRoute) {
                this.fetchData();
            },

            'page.section': function () {
                let title = this.page.section.title ? this.page.section.title : this.page.section.name;
                let keywords = this.page.section.keywords;
                let description = this.page.section.description;
                return MetaTagsService.setTags(title, keywords, description);
            }
        },

        filters: {
          truncate(text, length) {
            return text.length > length ? text.slice(0, length) + '...' : text;
          }
        }
    };
</script>
