/* global HandwritingRecognition */
let hwr, pad;

function onResult(results) {
  let candidates = document.getElementsByClassName("candidates")[0];
  if (results && results.length) {
    candidates.innerHTML = "";
    document.getElementById("result").value += results[0].pattern;
    console.log(JSON.stringify({ match: results[0] }, null, 2));

    for (let i = 1; i < Math.min(3, results.length); i++) {
      let button = document.createElement("button");
      button.classList = "btn btn-smal";
      button.innerText = results[i].pattern;
      button.title = results[i].score;
      candidates.appendChild(button);
    }
  } else {
    candidates.innerHTML = "No match";
  }
}

function onLanguageChange() {
  hwr = getRecognizer(
    document.getElementsByClassName("language")[0].value,
    onResult
  );
}

function onPenDown() {}

function onPenUp(data) {
  hwr.queue(data);
}

function onPadClear() {
  hwr.reset();
}

function getRecognizer(script, onResult) {
  return new HandwritingRecognition({
    threshold: 0.85,
    script,
    onResult
  });
}

function clear() {
  pad.clear();
  hwr.reset();
}

function initPad() {
  let canvas = document.getElementsByClassName("pad")[0];
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight * 0.4;
  // eslint-disable-next-line no-undef
  pad = new WritingPad({ canvas, onPenDown, onPenUp, onPadClear });
}

function init() {
  let script = document.getElementsByClassName("language")[0].value;
  document.getElementById("result").value = "";
  initPad();

  hwr = getRecognizer(script, onResult);

  document.getElementsByClassName("space")[0].onclick = () => {
    document.getElementById("result").value =
      document.getElementById("result").value + " ";
  };

  document.getElementsByClassName("backspace")[0].onclick = () => {
    document.getElementById("result").value = document
      .getElementById("result")
      .value.slice(0, -1);
  };

  document.getElementsByClassName("back")[0].onclick = () => {
    pad.previous();
  };

  document.getElementsByClassName("clear-all")[0].onclick = () => {
    clear();
    document.getElementById("result").value = "";
  };

  document.getElementsByClassName("language")[0].onchange = onLanguageChange;
  document.body.onresize = initPad;

  const elems = document.querySelectorAll("select");
  const nstances = M.FormSelect.init(elems, {});
}

window.addEventListener("load", init);
