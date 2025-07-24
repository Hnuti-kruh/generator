<script setup>
import VueSelect from "vue-select";
import InputHeading from "../../components/inputs/InputHeading.vue";
</script>

<script>
export default {
  components: { InputHeading, VueSelect },
  props: [
    "name",
    "important",
    "zIndex",
    "overlayImage",
    "overlayName",
    "defaultSelection",
    "options",
  ],
  emits: ["update:overlayImage", "update:overlayName"],
  data() {
    return {
      selectedOption: this.defaultSelection,
    };
  },
  watch: {
    selectedOption: {
      async handler(value) {
        const overlayImage = new Image();

        await new Promise((resolve) => {
          overlayImage.onload = () => {
            resolve();
          };

          overlayImage.src = value.overlayImage;
        });

        this.$emit("update:overlayImage", overlayImage);
        this.$emit("update:overlayName", value.title);
      },
      immediate: true,
    },
  },
};
</script>

<template>
  <section
    class="flex flex-col gap-2 bg-gray-100 p-4 drop-shadow-md"
    :style="{ 'z-index': zIndex }"
  >
    <InputHeading :name="name" :important="important" icon="cog"></InputHeading>
    <VueSelect
      :options="options"
      :clearable="false"
      v-model="selectedOption"
      label="title"
    ></VueSelect>
    <small class="text-gray-600">
      <em>Obrázek se může chvíli načítat.</em>
    </small>
  </section>
</template>
