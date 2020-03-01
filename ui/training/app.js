import { malayalam, tamil } from "../../src/scripts.js";
import TrainingData from "./training-data.js";

export default {
  data: () => ({
    scripts: [malayalam, tamil]
  }),
  template: `<div>
    <div class="col s12">
    <ul class="tabs">
        <li class="tab col s3" v-for="script in scripts"><a
                v-bind:href="'#'+script.id">{{script.name}}</a>
        </li>
    </ul>
    </div>
    <training-data v-bind:key="script.id" v-bind:id="script.id" v-bind:name="script.name"
    v-for="script in scripts" class="training-data col s12 grey lighten-5">
    </training-data>
  </div>`,
  components: { TrainingData }
};
