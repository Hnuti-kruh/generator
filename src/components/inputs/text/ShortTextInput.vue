<script setup>
import InputHeading from "../InputHeading.vue";
import { sanitizeValue } from "./utils";
</script>

<script>
export default {
  components: { InputHeading },
  props: [
    "name",
    "important",
    "zIndex",
    "relatedModel",
    "predefinedValues",
    "modelValue",
    "defaultValue",
  ],
  emits: ["update:modelValue", "update:relatedModel"],
  methods: {
    emitChanges(event) {
      this.$emit("update:modelValue", sanitizeValue(event.currentTarget.value));

      let predefinedValue = null;

      if (!this.$props.predefinedValues) {
        return;
      }

      for (let value of this.$props.predefinedValues) {
        if (value.self === event.currentTarget.value) {
          predefinedValue = value;
        }
      }

      if (predefinedValue === null) {
        return;
      }

      this.$emit("update:relatedModel", predefinedValue.related);
    },
  },
};
</script>

<template>
  <section
    class="flex flex-col gap-2 bg-gray-100 p-4 drop-shadow-md"
    :style="{ 'z-index': zIndex }"
  >
    <InputHeading
      :name="name"
      :important="important"
      icon="pencil"
    ></InputHeading>
    <input
      class="p-2 font-condensed bg-gray-200 rounded-sm"
      type="text"
      :list="$props.predefinedValues ? predefinedValues : ''"
      :value="modelValue !== null ? modelValue : defaultValue"
      @input="emitChanges($event)"
    />
    <datalist id="predefinedValues" v-if="$props.predefinedValues">
      <option
        v-for="predefinedValue in predefinedValues"
        :value="predefinedValue.self"
      />
    </datalist>
  </section>
</template>
