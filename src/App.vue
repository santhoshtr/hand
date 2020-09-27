<template>
  <v-app>
    <v-app-bar app flat>
      <v-toolbar-title @click.stop="$router.push('/')" style="cursor:pointer;"
        >Handwriting Recognition</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn href="https://gitlab.com/smc/handwriting" target="_blank" text>
          Source code
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},
  data: () => ({
    //
  })
};
</script>
<style>
#app {
  font-family: Lato, Manjari, sans-serif;
  height: 100%;
  height: -webkit-fill-available;
}
</style>
