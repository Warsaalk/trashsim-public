
    Vue.component("ts-checkbox-array", {
        mixins: [translationsController],
        inheritAttrs: false,
        props: {
            value: {type: Array, required: true},
            options: {type: [Object, Array], required: true},
            label: {type: String},
            errors: {required: true}
        },
        methods:
        {
            update: function (checked)
            {
                if (!this.value.includes(checked)) {
                    this.value.push(checked);
                } else {
                    let index = this.value.indexOf(checked);
                    if (index !== -1) {
                        this.value.splice(index, 1);
                    }
                }
                this.$emit('input', this.value);
            },

            checked: function(toCheck) {
                return this.value.includes(toCheck);
            }
        },
        template: `<div class="ts-input checkbox-array">
                        <span v-if="label">{{$__(label)}}</span>
                        <label v-for="option in options" :class="{checked: checked(option.value)}">
                            <span class="button"></span>
                            <input type="checkbox" :checked="checked(option.value)" :value="option.value" @input="update($event.target.value)" v-bind="$attrs">
                            <span class="text">{{$__(option.label)}}</span>
                        </label>
                        <errors bottom middle :errors="errors"></errors>
                  </div>`
    });