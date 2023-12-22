
    Vue.component("errors", {
        props: {
            errors: Object
        },
        template: '<div class="errors"><div v-for="(message, key) in errors" class="error" :class="\'error-\' + key">{{message}}</div></div>'
    });