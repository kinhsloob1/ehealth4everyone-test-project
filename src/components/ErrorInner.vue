<template>
  <div class="error">
    <div class="image">
      <img v-show="showImageElement" :src="imageSrc" />
    </div>
    <div class="text">{{ errorText }}</div>
  </div>
</template>

<script>
import img from "../assets/images/error.png";

export default {
  props: {
    /** loader text  */
    text: {
      type: String,
      required: true
    },

    /** option to show loader image  */
    showImage: {
      type: Boolean,
      required: false,
      default: true
    },

    /** option to change loader image  */
    imageUrl: {
      type: String,
      required: false,
      default: img
    }
  },
  computed: {
    imageSrc() {
      return this.imageUrl;
    },
    errorText() {
      return this.text;
    },
    showImageElement() {
      return this.showImage;
    }
  }
};
</script>

<style lang="less" scoped>
.error {
  display: flex;
  width: 100%;
  height: 100%;
  align-content: center;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  > .image {
    &:extend(.error);
    height: auto;
    margin-bottom: 10px;
    position: relative;
    z-index: 1;

    > img {
      width: 70px;
      height: 70px;
      display: flex;
    }
  }

  > .text {
    &:extend(.error);
    height: auto;
    margin-top: 10px;
    font-size: 15px;
    text-transform: capitalize;
    font-weight: 700;
    color: rgb(95, 0, 0);
  }
}
</style>
