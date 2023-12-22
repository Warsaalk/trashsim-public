
    Vue.component("ts-text-array", {
        mixins: [translationsController],
        inheritAttrs: false,
        props: {
            value: {required: true},
            label: {type: String},
            errors: {required: true},
            placeholder: {type: String}
        },
        data: function ()
        {
            return {
                locale: null
            }
        },
        methods:
        {
            update: function (value)
            {
                if (value.length > 0) {
                    if (this.value.indexOf(value) < 0) {
                        this.value.push(value);
                        this.locale = null;

                        this.$emit('input', this.value);
                    }
                }
            },

            remove: function (value)
            {
                const index = this.value.indexOf(value);

                if (index >= 0) {
                    this.value.splice(index, 1);

                    this.$emit('input', this.value);
                }
            }
        },
        template: `<label class="ts-input input-text input-array">
    <span v-if="label">{{$__(label)}}</span>
    <input type="text" v-model="locale" @keydown.enter.prevent @keyup.enter="update($event.target.value)" :placeholder="placeholder ? $__(placeholder) : ''" v-bind="$attrs">
    <errors bottom :errors="errors"></errors>
    <ul>
        <li v-if="value.length === 0" class="empty">{{$__('ts_text_array_empty')}}</li>
        <li v-for="tag in value" @click="remove(tag)">{{tag}}</li>
    </ul>
</label>`
    });