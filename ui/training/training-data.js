import PatternSample from "./pattern-sample.js";

export default {
  props: {
    id: String,
    name: String
  },
  components: { PatternSample },
  template: `<div class="row" v-bind:id="id">
    <div class="row">
      <button class='btn download col s4'  @click="download"><i class="material-icons">file_download</i> Download {{name}} data</button>
      <button class='btn add-pattern col s4 offset-s3' @click="addPattern"><i class="material-icons">add</i>Add letter</button>
  </div>
  <ul class="collapsible">
    <li v-for="data,pattern in scriptdata">
        <div class="collapsible-header"><i class="material-icons">gesture</i>{{pattern}} <span class="badge">{{data.samples? data.samples.length: 0}}</span></div>
        <div class="collapsible-body">
                  <div class="row">
                    <button @click="add(pattern)" class="actions-add btn-floating waves-effect waves-light right"><i class="material-icons">add</i></button>
                </div>
                <div class="row" v-for="sample,sampleIndex in data.samples">
                <button class="actions-remove btn-floating waves-effect waves-light right" @click="remove(pattern, sampleIndex)"><i class="material-icons">delete</i></button>
            <pattern-sample
                v-bind:key="sampleIndex"
                v-bind:id="sampleIndex"
                v-bind:sample="sample"
                class="pattern-sample">
            </pattern-sample>
            </div>
        </div>
  </li>
  </ul>
  </div>`,
  data: () => ({
    scriptdata: []
  }),
  created() {
    fetch(`src/data/${this.id}.json`)
      .then(r => r.json())
      .then(data => {
        this.scriptdata = data;
      });
  },
  methods: {
    download: function(script) {
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
    addPattern: function(pattern) {},
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
