
    Vue.component("ts-radiobutton", {
        mixins: [translationsController],
        inheritAttrs: false,
        props: {
            value: {type: String | Number | Boolean},
            options: {type: [Object, Array], required: true},
            name: {type: String, required: true},
            label: {type: String},
            errors: {required: true}
        },
        data: function ()
        {
            return {}
        },
        methods:
        {
            update: function (checked)
            {
                this.$emit('input', checked);
            },

            checked: function(toCheck) {
                var currentVal = this.value;
                if (toCheck !== void 0 && typeof toCheck !== "string") {
                    return toCheck.toString() === currentVal.toString();
                }
                return toCheck == currentVal
            }
        },
        template: `<div class="ts-input radio">
                        <span v-if="label">{{$__(label)}}</span>
                        <label v-for="option in options" :class="{checked: checked(option.value)}">
                            <span class="button"></span>
                            <input type="radio" :name="name" :checked="checked(option.value)" :value="option.value" @input="update($event.target.value)" v-bind="$attrs">
                            <span class="text">{{$__(option.label)}}</span>
                        </label>
                        <errors bottom middle :errors="errors"></errors>
                    </div>`
    });