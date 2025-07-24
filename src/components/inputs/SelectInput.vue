<script setup>
import InputHeading from "./InputHeading.vue";

import VueSelect from "vue-select";
</script>

<script>
export default {
  components: { InputHeading, VueSelect },
  props: ["name", "important", "zIndex", "options", "modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      currentOption: this.modelValue,
    };
  },
  methods: {
    setPredefinedColors(value) {
      this.currentOption = value;
    },
  },
  watch: {
    currentOption(value) {
      this.$emit("update:modelValue", value);
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
      icon="menu"
    ></InputHeading>

    <VueSelect
      :options="options"
      :clearable="false"
      :modelValue="modelValue"
      @update:modelValue="setPredefinedColors"
      label="name"
    ></VueSelect>
  </section>
</template>
