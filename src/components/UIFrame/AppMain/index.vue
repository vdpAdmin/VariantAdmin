<template>
  <el-main>
    <transition name="fade-transform" mode="out-in">
      <router-view v-if="routerViewActive" :key="key" />
    </transition>
  </el-main>
</template>

<script>
  import EventBus from '@/components/EventBus/index'

  export default {
    name: 'AppMain',
    data() {
      return {
        routerViewActive: true
      }
    },
    mounted() {
      EventBus.$on('route-reload', () => {
        //console.log('reload begin...')
        this.routerViewActive = false
        this.$nextTick(() => {
          this.routerViewActive = true
          //console.log('reload success')
        })
      })
    },
    computed: {
      key () {
        return this.$route.path
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-main {
    height: 100%;
    width: 100%;
    padding: 12px;
    background-color: #f0f2f5;
  }
</style>
