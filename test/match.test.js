"use strict";

import Match from "../src/lib/match";
import assert from "assert";
import { describe, it } from "mocha";
import Malayalam from "../src/lib/data/malayalam.json";

describe("Match", () => {
  it("should match candidate letter 1", () => {
    const drawingData = [
      [
        { x: 300, y: 0 },
        { x: 300, y: 200 }
      ]
    ];
    const matcher = new Match("malayalam", 0.8);
    let candidates = matcher.run(drawingData);
    assert.ok(candidates.length > 0);
    assert.ok(candidates[0].score > 0.8);
    assert.strictEqual(candidates[0].pattern, "1");
  });

  it("should match all paths in malayalam training data with its characters", () => {
    const threshold = 0.9;
    const matcher = new Match("malayalam", threshold);
    for (let ligature in Malayalam) {
      const samples = Malayalam[ligature].samples;
      for (let i = 0; i < samples.length; i++) {
        const sample = samples[i];
        let candidates = matcher.run(sample.strokes);
        assert.ok(candidates.length > 0);
        assert.ok(candidates[0].score > threshold);
        if (candidates[0].pattern !== ligature) {
          console.log(candidates);
        }
        if (
          ligature === "ഠ" ||
          ligature === "ം" ||
          ligature === "o" ||
          ligature === "O" ||
          ligature === "I" ||
          ligature === "l" ||
          ligature === "|" ||
          ligature === "/" ||
          ligature === "\\" ||
          ligature === "i" ||
          ligature === "s" ||
          ligature === "S" ||
          ligature === "z" ||
          ligature === "Z" ||
          ligature === "(" ||
          ligature === "ി"
        ) {
          // These are very much similar and need postprocessing to differentiate.
          continue;
        }
        assert.strictEqual(
          candidates[0].pattern,
          ligature,
          "First candidate matches the ligature"
        );
      }
    }
  });
});
