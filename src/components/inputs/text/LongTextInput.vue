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
    "highlightable",
    "zIndex",
    "customHighlightText",
    "modelValue",
  ],
  emits: ["update:modelValue"],
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
    <textarea
      class="p-2 font-condensed bg-gray-200 rounded-sm"
      :value="modelValue"
      @input="$emit('update:modelValue', sanitizeValue($event.target.value))"
    ></textarea>
    <small v-if="highlightable">
      <span v-if="!customHighlightText">
        Pro zvýraznění části textu ho <em>*obal do hvězdiček.*</em><br />
        Nezapomeň na druhou hvězdičku.
      </span>
      <span v-else v-text="customHighlightText" />
    </small>
  </section>
</template>
