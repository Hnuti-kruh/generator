<script setup>
import VueSelect from "vue-select";
import InputHeading from "./InputHeading.vue";

import likeImage from "../../assets/reactions/like.png";
import laughImage from "../../assets/reactions/laugh.png";
import heartImage from "../../assets/reactions/heart.png";
import angryImage from "../../assets/reactions/angry.png";
import sadImage from "../../assets/reactions/sad.png";
import surprisedImage from "../../assets/reactions/surprised.png";
import careImage from "../../assets/reactions/care.png";
</script>

<script>
export default {
  components: { InputHeading, VueSelect },
  props: ["name", "important", "zIndex", "modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      emojiOptions: [
        {
          title: "👍 Like",
          url: likeImage,
        },
        {
          title: "😂 Smích",
          url: laughImage,
        },
        {
          title: "♥️ Srdce",
          url: heartImage,
        },
        {
          title: "😡 Naštvaný",
          url: angryImage,
        },
        {
          title: "☹️ Smutný",
          url: sadImage,
        },
        {
          title: "😲 Překvapený",
          url: surprisedImage,
        },
        {
          title: "🥰 Péče",
          url: careImage,
        },
      ],
      selectedEmoji: this.modelValue,
    };
  },
  watch: {
    selectedEmoji(value) {
      const image = new Image();

      if (value === null || value === undefined) {
        this.$emit("update:modelValue", null);
        return;
      }

      image.onload = () => {
        this.$emit("update:modelValue", image);
      };

      image.src = value.url;
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
      icon="thumbs-up"
    ></InputHeading>
    <VueSelect
      :options="emojiOptions"
      v-model="selectedEmoji"
      label="title"
    ></VueSelect>
  </section>
</template>
