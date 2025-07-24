<script>
export default {
  props: ["parentRefs"],
};
</script>

<template>
  <button
    class="btn btn--icon max-w-[unset]"
    :disabled="
      $props.parentRefs.canvas ? $props.parentRefs.canvas.redrawing : true
    "
  >
    <div class="btn__body-wrap">
      <div class="btn__body w-full">Obnovit šablonu</div>
      <div class="btn__icon">
        <i class="ico--refresh"></i>
      </div>
    </div>
  </button>
</template>
