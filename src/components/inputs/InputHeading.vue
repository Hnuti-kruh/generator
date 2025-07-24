<script>
export default {
  props: ["name", "important", "zIndex", "icon"],
  methods: {
    getClass() {
      return {
        "font-bold text-xl": this.important,
        "text-lg": !this.important,
      };
    },
  },
};
</script>

<template>
  <div class="flex gap-2 items-center" :style="{ 'z-index': zIndex }">
    <i :class="'ico--' + icon" class="text-lg" v-if="icon"></i>
    <h2 class="font-condensed" :class="getClass()">{{ this.name }}</h2>
  </div>
</template>
