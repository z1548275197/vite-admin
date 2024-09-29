<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>


<script lang="ts" setup>
import { computed, ComputedRef } from 'vue';
import { useStore } from 'vuex';
import { useElementPlusTheme } from "use-element-plus-theme";
const store = useStore(); // 使用 Vuex store
const currentThemeColor: ComputedRef<string> = computed(() => {
  return store.state.user.themeColor
});
useElementPlusTheme(currentThemeColor.value);
</script>


<style scoped>
#app {
  width: 100%;
}
</style>

