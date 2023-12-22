
    Vue.component("ts-text", {
        mixins: [translationsController],
        inheritAttrs: false,
        props: {
            value: {required: true},
            label: {type: String},
            errors: {required: true},
            type: {type: String},
            placeholder: {type: String},
            maxWidth: {type: String}
        },
        data: function ()
        {
            return {}
        },
        computed:
        {
            actualType: function ()
            {
                switch (this.type) {
                    case "text":
                    case "number":
                        return "number";
                    case "float":
                        return "number";
                    case "password":
                        return "password";
                    default:
                        return "text";
                }
            },

            step: function ()
            {
                if (this.type === "number") {
                    return "1";
                } else if (this.type === "float") {
                    return "0.1";
                }
            },

            style: function ()
            {
                const styles = {};

                if (this.maxWidth !== void 0) {
                    styles.maxWidth = this.maxWidth;
                }

                return styles;
            }
        },
        methods:
        {
            update: function (value)
            {
                if (this.type === "number" && value.length > 0) {
                    value = parseInt(value);
                }
                if (this.type === "float" && value.length > 0) {
                    value = parseFloat(value);
                }
                this.$emit('input', value);
            },

            focus: function ()
            {
                this.$emit('focus');
            },

            keyup: function ($event)
            {
                this.$emit('keyup', $event);
            }
        },
        template: `<label class="ts-input input-text">
    <span v-if="label" v-html="$__(label)"></span>
    <input :type="actualType" :value="value" @input="update($event.target.value)" @focus="focus" @keyup="keyup" :step="step" :placeholder="$__(placeholder)" :style="style" v-bind="$attrs">
    <errors bottom :errors="errors"></errors>
</label>`
    });