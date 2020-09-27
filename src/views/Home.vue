<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12">
        <v-textarea
          class="pad-text"
          flat
          v-model="textValue"
          :value="textValue"
          clearable
          height="80px"
        ></v-textarea>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="9" xs="12" class="ma-0 pa-2">
        <v-btn
          v-for="(candiate, index) in candidates"
          :key="index"
          text
          :title="candiate.score"
          large
          >{{ candiate.pattern }}</v-btn
        >
      </v-col>
      <v-col cols="12" sm="3" xs="12" class="ma-0 pa-2">
        <v-select
          placeholder="Select script"
          label="Script"
          v-model="script"
          class="ma-0 pa-2"
          :items="scripts"
        ></v-select>
      </v-col>
    </v-row>
    <v-sheet class="pad-container row ma-1 pa-1">
      <canvas ref="pad" class="pad col-12"></canvas>
      <v-toolbar dense class="pad-toolbar">
        <v-toolbar-items class="row">
          <v-btn icon class="col-2" @click="back">
            <v-icon>{{ mdiArrowLeft }}</v-icon>
          </v-btn>
          <v-btn class="col-2" @click="clear">
            <v-icon>{{ mdiBroom }}</v-icon>
          </v-btn>
          <v-btn class="col-6" @click="space">
            <v-icon>{{ mdiKeyboardSpace }}</v-icon>
          </v-btn>
          <v-btn class="col-2" @click="backspace">
            <v-icon>{{ mdiBackspace }}</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-sheet>
  </v-container>
</template>
<script>
import {
  mdiBackspace,
  mdiArrowLeft,
  mdiKeyboardSpace,
  mdiBroom
} from "@mdi/js";
import WritingPad from "../lib/pad";
import HandwritingRecognition from "../lib";

export default {
  name: "Handwriting",
  data: () => ({
    pad: null,
    textValue: "",
    script: "malayalam",
    scripts: [
      { value: "malayalam", text: "മലയാളം" },
      { value: "tamil", text: "தமிழ்" }
    ],
    mdiKeyboardSpace,
    candidates: [],
    mdiArrowLeft,
    mdiBackspace,
    mdiBroom
  }),
  computed: {
    recognizer() {
      return new HandwritingRecognition({
        threshold: 0.85,
        script: this.script,
        onResult: this.onResult
      });
    }
  },
  mounted: function() {
    this.init();
  },
  created: function() {
    window.addEventListener("resize", this.init);
  },
  destroyed: function() {
    window.removeEventListener("resize", this.init);
  },
  methods: {
    init() {
      const canvas = this.$refs.pad;
      canvas.width = document.body.clientWidth;
      canvas.height = 360;
      this.pad = new WritingPad({
        canvas,
        onPenDown: this.onPenDown,
        onPenUp: this.onPenUp,
        onPadClear: this.onPadClear
      });
    },
    onPenDown: function() {},
    onPenUp: function(data) {
      this.recognizer.queue(data);
    },
    onPadClear: function() {
      this.recognizer.reset();
    },
    onResult: function(results) {
      console.log({ results });
      if (results?.length) {
        const result = results[0];
        this.textValue += result.pattern;
        this.candidates = results.slice(1);
      }
    },
    space: function() {
      this.textValue += " ";
    },
    backspace: function() {
      this.textValue = this.textValue.slice(0, -1);
    },
    back: function() {
      this.pad.previous();
    },
    clear: function() {
      this.pad.clear();
      this.recognizer.reset();
    }
  }
};
</script>
<style lang="less">
.pad-text {
  font-size: 1.5em;
  font-family: Lato, Manjari, sans-serif;
}
.pad-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 360px;
  .pad {
    position: absolute;
    bottom: 0;
    background-color: #fffde7;
    touch-action: none;
  }
  .pad-toolbar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
