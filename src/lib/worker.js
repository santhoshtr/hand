import Match from "./match";

self.onmessage = message => {
  const matcher = new Match(message.data.script, message.data.threshold);
  const results = {
    candidates: matcher.run(message.data.strokes),
    id: message.data.id
  };
  self.postMessage(results);
};
