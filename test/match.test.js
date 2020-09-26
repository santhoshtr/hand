"use strict";

import Match from "../src/lib/match";
import assert from "assert";
import { describe, it } from "mocha";

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

  it("should match multi stroke candidate letter 4", () => {
    const drawingData = [
      [
        { x: 300, y: 0 },
        { x: 200, y: 200 },
        { x: 400, y: 200 }
      ],
      [
        { x: 300, y: 100 },
        { x: 300, y: 300 }
      ]
    ];
    const matcher = new Match("malayalam", 0.8);
    let candidates = matcher.run(drawingData);
    assert.ok(candidates.length > 0);
    assert.ok(candidates[0].score > 0.8);
    assert.strictEqual(candidates[0].pattern, "4");
  });
  /*
  it("should match variant stroke of candidate letter 2", () => {
    const drawingData = [
      [
        { x: 210, y: 61 },
        { x: 246, y: 61 },
        { x: 291, y: 97 },
        { x: 311, y: 135 },
        { x: 311, y: 180 },
        { x: 297, y: 202 },
        { x: 270, y: 219 },
        { x: 207, y: 229 },
        { x: 183, y: 219 },
        { x: 178, y: 184 },
        { x: 189, y: 169 },
        { x: 245, y: 166 },
        { x: 348, y: 252 }
      ]
    ];
    const matcher = new Match("malayalam", 0.8);
    let candidates = matcher.run(drawingData);
    assert.ok(candidates.length > 0);
    assert.ok(candidates[0].score > 0.8);
    assert.strictEqual(candidates[0].pattern, "2");
  });*/
});
