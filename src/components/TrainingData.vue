<template>
  <v-sheet>
    <v-toolbar flat>
      <v-toolbar-items>
        <v-btn @click="addPattern" text color="success">
          <v-icon>{{ mdiPlus }}</v-icon
          >Add letter
        </v-btn>
        <v-btn @click="download" text color="primary">
          <v-icon>{{ mdiDownload }}</v-icon
          >Download
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-expansion-panels>
      <v-expansion-panel v-for="(data, pattern) in scriptdata" :key="pattern">
        <v-expansion-panel-header>
          <h2>{{ pattern }}</h2>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <v-card
            flat
            outlined
            class="my-2"
            v-for="(sample, sampleIndex) in data.samples"
            :key="sampleIndex"
          >
            <v-card-text>
              <pattern-sample
                :key="sampleIndex"
                :id="sampleIndex"
                :sample="sample"
                class="pattern-sample"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="remove(pattern, sampleIndex)" text color="error">
                <v-icon>{{ mdiDelete }}</v-icon
                >Delete</v-btn
              >
              <v-btn
                @click="add(pattern)"
                text
                v-if="data.samples.length === sampleIndex + 1"
                color="success"
              >
                <v-icon>{{ mdiPlus }}</v-icon
                >Add more</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-sheet>
</template>
<script>
import PatternSample from "./PatternSample";
import { mdiPlus, mdiDownload, mdiDelete } from "@mdi/js";
export default {
  name: "TrainingData",
  props: {
    id: String,
    name: String,
    scriptdata: Object
  },
  components: { PatternSample },
  data: () => ({
    mdiPlus,
    mdiDownload,
    mdiDelete
  }),
  methods: {
    download: function() {
      var dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(this.scriptdata, null, 2));
      var downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", this.id + ".json");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      return false;
    },
    addPattern: function() {},
    add: function(pattern) {
      this.scriptdata[pattern].samples.push({
        strokes: []
      });
    },
    remove: function(pattern, sampleIndex) {
      this.scriptdata[pattern].samples.splice(sampleIndex, 1);
    }
  }
};
</script>
