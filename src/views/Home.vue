<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12">
        <v-textarea
          class="pad-text"
          outlined
          v-model="textValue"
          :value="textValue"
          clearable
          height="200px"
        ></v-textarea>
      </v-col>
    </v-row>
    <v-sheet elevation="6" dark class="pad-container row ma-0 pa-0">
      <v-toolbar dense flat class="suggestions-toolbar">
        <div v-if="!candidates.length">Please write in the below pad</div>
        <v-btn
          v-for="(candiate, index) in candidates"
          :key="index"
          text
          :title="candiate.score"
          @click="useCandidate(candiate.pattern)"
          >{{ candiate.pattern }}</v-btn
        >
      </v-toolbar>
      <canvas ref="pad" class="pad col-12"></canvas>
      <v-toolbar dense flat class="pad-toolbar">
        <v-toolbar-items class="row ma-0 pa-0">
          <v-btn icon text class="col-2" @click="back">
            <v-icon>{{ mdiArrowLeft }}</v-icon>
          </v-btn>
          <v-menu dark offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn text v-bind="attrs" v-on="on" class="col-2">
                <v-icon>
                  {{ mdiTranslate }}
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="script in scripts" :key="script.value">
                <v-list-item-title>{{ script.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn text class="col-3" @click="space">
            <v-icon>{{ mdiKeyboardSpace }}</v-icon>
          </v-btn>
          <v-btn text class="col-2" @click="clear">
            <v-icon>{{ mdiBroom }}</v-icon>
          </v-btn>
          <v-btn icon class="col-2" @click="backspace">
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
  mdiTranslate,
  mdiBroom
} from "@mdi/js";
import WritingPad from "../lib/pad";
import HandwritingRecognition from "../lib";

export default {
  name: "Handwriting",
  data: () => ({
    pad: null,
    script: "malayalam",
    scripts: [
      { value: "malayalam", text: "മലയാളം" },
      { value: "tamil", text: "தமிழ்" }
    ],
    mdiKeyboardSpace,
    candidates: [],
    recognitions: [],
    mdiArrowLeft,
    mdiBackspace,
    mdiTranslate,
    mdiBroom
  }),
  computed: {
    recognizer() {
      return new HandwritingRecognition({
        threshold: 0.85,
        script: this.script,
        onResult: this.onResult
      });
    },
    textValue() {
      return this.recognitions.join("");
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
      canvas.height = 240;
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
      console.table(results);
      if (results?.length) {
        const result = results[0];
        this.recognitions.push(result.pattern);
        this.candidates = results;
      }
    },
    useCandidate: function(candidate) {
      this.recognitions.pop();
      this.recognitions.push(candidate);
    },
    space: function() {
      this.recognitions.push(" ");
    },
    backspace: function() {
      this.recognitions.pop();
    },
    back: function() {
      this.pad.previous();
    },
    clear: function() {
      this.pad.clear();
      this.recognizer.reset();
      this.candidates = [];
      this.recognitions = [];
    }
  }
};
</script>
<style lang="less">
.pad-text {
  font-size: 1.5em;
  font-family: "Inter", "Manjari", sans-serif;
}
.pad-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 336px; // canvas height + 48+ 48
  .pad {
    position: absolute;
    bottom: 48px;
    left: 0;
    right: 0;
    opacity: 0.95;
    padding: 0;
    background-color: #37474f;
    cursor: url("../assets/pencil.png"), auto;
    touch-action: none;
  }
  .suggestions-toolbar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
  .pad-toolbar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
