<style src="./VerifyPhone.scss" lang="scss"></style>

<script>
    import {mapGetters, mapState, mapMutations} from 'vuex';

    export default {
        name: "VerifyPhone",

        template: require('./VerifyPhone.html'),

        components: {
        },

        props: ['phone', 'country'],

        data() {
            return {
                status: null,
                code: '',
                now: 0,
                count: 0,
                endDate: 0,
                nextRequestIdle: 180,
                error: '',
                wrongCode: false
            }
        },

        mounted() {
        },

        methods: {
            ...mapMutations(['setOpenVerifyPhone']),

            timerLoop() {
                this.count++;
                this.now = Math.trunc(new Date().getTime() / 1000);
                this.count < this.nextRequestIdle && setTimeout(this.timerLoop, 1000);
            },

            sendVerifyPhone: function () {
                this.$store.dispatch('sendVerifyPhone', {phone: this.phone, country: this.country}).then(() => {
                    this.code = '';
                    this.error = '';
                    this.count = 0;
                    this.wrongCode = false;
                    this.endDate = Math.trunc(new Date().getTime() / 1000) + this.nextRequestIdle;
                    this.timerLoop();
                    let result = this.$store.getters.getVerifyPhoneResponse;
                    if (!result.success) {
                        if (typeof result.error === "undefined") {
                            this.error = "Произошла ошибка. Повторите запрос кода позже."
                        } else {
                            this.error = result.error;
                        }
                    }
                    if (result.success && result.status === 'already_confirmed') {
                        this.sendVerifiedToParent();
                        this.setOpenVerifyPhone(false);
                    }
                });
            },

            confirmPhone: function () {
                this.$store.dispatch('sendVerifyPhoneCode', {code: this.code, phone: this.phone}).then(() => {
                    let result = this.$store.getters.getVerifyCodeResponse;
                    if (result.success) {
                        this.sendVerifiedToParent();
                        this.setOpenVerifyPhone(false);
                    } else {
                        this.wrongCode = true;
                    }
                });
            },

            sendVerifiedToParent: function () {
                this.$emit('verified')
            }
        },

        computed: {
            seconds() {
                let sec = Math.floor((this.endDate - this.now) % 60);
                return parseInt(sec) < 10 ? '0' + sec : sec;
            },
            minutes() {
                let min = Math.floor(((this.endDate - this.now) / 60) % 60);
                return parseInt(min) < 10 ? '0' + min : min;
            },
            openVerifyPhone() {
                return this.$store.getters.getOpenVerifyPhone;
            },
            waitForRepeat() {
                return this.count < this.nextRequestIdle;
            },
            formattedPhone() {
                let result = '';
                if (this.country === 'Russia') {
                    result = "+7 (" + this.phone.substr(2, 3) + ") " + this.phone.substr(5, 3) + "-" + this.phone.substr(8, 2) + "-" + this.phone.substr(10, 2);
                } else {
                    result = this.phone.substr(0, 4) + " " + this.phone.substr(4, 2) + " " + this.phone.substr(6, 7);
                }

                return result;
            }
        },

        watch: {
            openVerifyPhone: function () {
                if (this.openVerifyPhone) {
                    this.sendVerifyPhone();
                }
            },

            code: function () {
                this.wrongCode = false;
            }
        }
    };
</script>
