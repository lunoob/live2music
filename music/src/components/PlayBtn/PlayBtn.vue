<template>
    <div class="mask" ref="maskWrapper">
        <div class="btnBox" @click="onPlay">
            <img :src="loading" alt="" class="playBtn">
        </div>
    </div>
</template>

<script>
import loading from 'assets/images/play.png';
export default {
    name: 'playbtn',
    data() {
        return {
            loading,
        }
    },
    methods: {
        onPlay() {
            console.log('click');
            this.$emit('play');
        }
    }
}
</script>

<style lang="scss">
    .mask {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
    }
    $size: 80px;
    .btnBox {
        width: $size;
        height: $size;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.5);
    }
    .playBtn {
        height: $size - 20px;
        width: $size - 20px;
    }
</style>