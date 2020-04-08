<template>
  <transition name="confirm-fade">
    <!-- @click.stop防止事件冒泡写法 -->
    <div class="confirm" v-show="showFlag" @click.stop="cancel">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{ title }}</p>
          <div class="operate">
            <div class="operate-btn primary" @click="confirm">{{ confirmBtnText }}</div>
            <div class="operate-btn normal" @click="cancel">{{ cancelBtnText }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'confirm',
  props: {
    title: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  },
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    },
    confirm() {
      this.hide();
      this.$emit('confirm');
    },
    cancel() {
      this.hide();
      this.$emit('cancel');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variable';
.confirm {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 998;
  background-color: $color-background-dd;
  &.confirm-fade-enter-active {
    animation: confirm-fadein 0.3s;
    .confirm-content {
      animation: confirm-slideDown 0.3s;
    }
  }
  &.confirm-fade-leave-active {
    animation: confirm-fadeout 0.3s;
    .confirm-content {
      animation: confirm-slideUp 0.3s;
    }
  }
  .confirm-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    // transform: translate(-50%, -50%);
    width: 100%;
    z-index: 999;
    .confirm-content {
      box-sizing: border-box;
      width: 100%;
      padding: 50px 10px;
      background: $color-background;
      border-radius: 0 0 20px 20px;
      .text {
        padding: 0px 15px 40px;
        line-height: 22px;
        text-align: center;
        font-size: $font-size-large;
        color: $color-text-dd;
      }
      .operate {
        display: flex;
        align-items: center;
        justify-content: space-around;
        text-align: center;
        font-size: $font-size-medium-x;
        .operate-btn {
          width: 30%;
          line-height: 22px;
          padding: 10px 0;
          color: white;
          border-radius: 4px;
          &.primary {
            background-color: $color-theme;
            border: 1px solid $color-theme;
            &:active {
              opacity: 0.3;
            }
          }
          &.normal {
            background-color: #ffffff;
            border: 1px solid #e6e6e6;
            color: black;
            &:active {
              background-color: $color-background-active;
            }
          }
        }
      }
    }
  }
}
@keyframes confirm-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes confirm-fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes confirm-slideUp {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(0, -100%, 0);
  }
}

@keyframes confirm-slideDown {
  0% {
    transform: translate3d(0, -100%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
</style>
