<script>
export default {
  props: ["modelValue"],
  emits: ["update:modelValue"],
};
</script>

<template>
  <div class="flex gap-3 justify-end mb-3">
    <input
      id="auto-reload-checkbox"
      name="auto-reload-checkbox"
      type="checkbox"
      :checked="modelValue"
      autocomplete="off"
      @input="$emit('update:modelValue', $event.target.checked)"
    />
    <label for="auto-reload-checkbox"
      >Obnovovat automaticky (může zatížit prohlížeč)</label
    >
  </div>
</template>
