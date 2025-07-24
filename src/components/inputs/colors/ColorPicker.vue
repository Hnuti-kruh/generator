<script setup>
import COLORS from "../../../colors";

import VueSelect from "vue-select";
</script>

<script>
export default {
  components: { VueSelect },
  props: ["modelValue", "colorKey", "label"],
  emits: ["update:modelValue"],
  data() {
    let colorOptions = [];

    for (let [identifier, color] of Object.entries(COLORS)) {
      colorOptions.push({
        name: color.name,
        value: color.value,
      });
    }

    return {
      colorOptions: colorOptions,
    };
  },
  computed: {
    colorValue: {
      get() {
        return this.modelValue[this.colorKey];
      },
      set(value) {
        let copiedModelValue = this.modelValue;
        copiedModelValue[this.colorKey] = value;

        this.$emit("update:modelValue", copiedModelValue);
      },
    },
  },
};
</script>

<template>
  <!-- Temporarily hidden :( -->

  <li class="grid grid-cols-2 justify-between items-center gap-4 hidden">
    <span class="font-condensed">{{ label }}</span>

    <div>
      <VueSelect
        :options="colorOptions"
        :clearable="false"
        label="name"
        v-model="colorValue"
      >
        <template v-slot:option="option">
          <div class="flex gap-2 items-center">
            <div
              class="w-8 h-8 rounded-md border border-gray-200"
              aria-label="Náhled barvy"
              title="Náhled barvy"
              :style="{ background: option.value }"
            ></div>
            <div>
              {{ option.name }}
            </div>
          </div>
        </template>

        <template v-slot:selected-option="option">
          <div class="flex gap-2 items-center">
            <div
              class="w-8 h-8 rounded-md border border-gray-200"
              aria-label="Náhled vybrané barvy"
              title="Náhled vybrané barvy"
              :style="{ background: option.value }"
            ></div>
            <div>
              {{ option.name }}
            </div>
          </div>
        </template>
      </VueSelect>
    </div>
  </li>
</template>
