
    Vue.component("ts-submit", {
        mixins: [translationsController],
        inheritAttrs: false,
        props: {
            label: {type: String, required: true},
            error: {required: true},
            states: {type: Object, required: true},
            waiting: {type: Boolean}
        },
        computed:
        {
            errors ()
            {
                return this.error !== null ? {form: this.$__(this.error)} : {};
            }
        },
        methods:
        {
            click ()
            {
                this.$emit('click');
            }
        },
        template: `<div class="ts-submit">
        <input type="submit" class="btn btn-light" :value="$__(label)" :disabled="states.submitting || waiting === true" @click="click" />
        <i class="fas fa-spinner spinner" v-if="states.submitting || waiting === true"></i>
        <errors bottom :errors="errors"></errors>
    </div>`
    });
