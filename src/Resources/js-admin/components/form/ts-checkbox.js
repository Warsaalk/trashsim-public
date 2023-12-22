
    Vue.component("ts-checkbox", {
        mixins: [translationsController],
        inheritAttrs: false,
        props: {
            value: {required: true},
            label: {type: String, required: true},
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
            }
        },
        template: `<label class="ts-input checkbox" :class="{checked: value}">
    <span class="button"></span>
    <input type="checkbox" :checked="value" @input="update($event.target.checked)" v-bind="$attrs">
    <span class="text">{{$__(label)}}</span>
    <errors bottom middle :errors="errors"></errors>
</label>`
    });