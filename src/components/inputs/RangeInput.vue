<script setup>
import InputHeading from "./InputHeading.vue";
</script>

<script>
export default {
  components: { InputHeading },
  props: ["name", "important", "zIndex", "min", "max", "modelValue"],
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
      icon="equalizer"
    ></InputHeading>
    <input
      type="range"
      :min="min * 100"
      :max="max * 100"
      :value="modelValue * 100"
      @input="$emit('update:modelValue', $event.target.value / 100)"
    />
  </section>
</template>
