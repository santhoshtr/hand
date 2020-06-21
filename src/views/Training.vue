<template>
  <v-container>
    <v-tabs v-model="script">
      <v-tab v-for="script in scripts" :key="script.value">{{
        script.text
      }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="script">
      <v-tab-item v-for="script in scripts" :key="script.value">
        <v-card>
          <training-data
            :key="script.value"
            :id="script.value"
            :data="script.data"
            :scriptdata="script.data"
            class="training-data"
          >
          </training-data>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>
<script>
import TrainingData from "../components/TrainingData";
import malayalam from "../lib/data/malayalam.json";
import tamil from "../lib/data/tamil.json";
export default {
  name: "Training",
  data: () => ({
    script: "malayalam",
    scripts: [
      { value: "malayalam", text: "മലയാളം", data: malayalam },
      { value: "tamil", text: "தமிழ்", data: tamil }
    ]
  }),
  components: { TrainingData }
};
</script>
