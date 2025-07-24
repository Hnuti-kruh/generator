<script setup>
import InputHeading from "../InputHeading.vue";
import ColorPicker from "./ColorPicker.vue";

import VueSelect from "vue-select";
</script>

<script>
export default {
  components: { InputHeading, ColorPicker, VueSelect },
  props: [
    "name",
    "important",
    "zIndex",
    "colorLabels",
    "predefinedColors",
    "defaultPredefinedColors",
    "modelValue",
  ],
  emits: ["update:modelValue"],
  data() {
    return {
      currentColors: this.modelValue,
      currentPredefinedColors: this.defaultPredefinedColors,
      predefinedColorOptions: Object.values(this.predefinedColors),
    };
  },
  watch: {
    currentColors(value) {
      this.$emit("update:modelValue", value);
    },
  },
  methods: {
    setPredefinedColors(value) {
      this.currentPredefinedColors = value;
      this.currentColors = value.colors;
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
      icon="equalizer"
    ></InputHeading>

    <VueSelect
      :options="predefinedColorOptions"
      :clearable="false"
      :modelValue="currentPredefinedColors"
      @update:modelValue="setPredefinedColors"
      label="name"
    ></VueSelect>

    <ul class="flex flex-col gap-2">
      <ColorPicker
        v-for="(templateColorIdentifier, index) in Object.keys(currentColors)"
        :key="index"
        :label="colorLabels[templateColorIdentifier]"
        :colorKey="templateColorIdentifier"
        v-model="currentColors"
      ></ColorPicker>
    </ul>
  </section>
</template>
