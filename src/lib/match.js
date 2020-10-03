import { shapeSimilarity, curveLength } from "curve-matcher";
import simplify from "simplify-js";
import malayalam from "./data/malayalam.json";
import tamil from "./data/tamil.json";

const scriptData = { malayalam, tamil };

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

const sortByScore = (a, b) => parseFloat(b.score) - parseFloat(a.score);

const pathToStr = path => {
  let pathStrArray = [];
  for (let i = 0; i < path?.length; i++) {
    pathStrArray.push(`(${path[i].x},${path[i].y})`);
  }
  return `[${pathStrArray.join()}]`;
};

export default class Match {
  constructor(script, threshold) {
    this.scriptData = scriptData[script];
    this.threshold = threshold;
    this.goodEnoughScore = 0.92;
    this.maxRotationAngle = 0.5235988; // 30 degree in radians
  }

  run(strokes) {
    let candidates = [];

    if (!strokes) return candidates;

    strokes = Array.isArray(strokes[0]) ? strokes : [strokes];

    for (let key in this.scriptData) {
      let score = this.matchLetter(strokes, this.scriptData[key].samples, key);
      if (score) {
        candidates.push({ pattern: key, score });
        // Good score. Stop here, ignore all other low score candidates.
        if (score > this.goodEnoughScore) {
          candidates = [{ pattern: key, score }];
          break;
        }
      }
    }
    // Sort by descending order of scores
    return candidates.sort(sortByScore);
  }

  /**
   *
   * @param {*} letterData
   * @param {*} samples
   * @param {string} key
   * @returns {number}
   */
  matchLetter(letterData, samples, key) {
    for (let i = 0; i < samples.length; i++) {
      const sample = samples[i];
      // Check if number of strokes match.
      if (letterData.length !== sample.strokes.length) {
        continue;
      }
      let strokeScores = [];
      const matching = letterData.every((stroke, index) => {
        console.debug(`Trying: ${key}`);
        const score = this.match(stroke, sample.strokes[index]);
        if (score >= this.threshold) {
          strokeScores.push(score);
          return true;
        }
      });
      if (matching) {
        // return average score
        return average(strokeScores);
      }
    }

    return 0;
  }

  /**
   * Match the drawn path to a candidate path of leaned patterns
   *
   * @param {import("curve-matcher").Point[]} path
   * @param {import("curve-matcher").Point[]} candidatePath
   * @returns {number}
   */
  match(path, candidatePath) {
    const tolerance = 5;
    const highQuality = true;

    // Simplify both paths
    const simplifiedPath = simplify(path, tolerance, highQuality);
    const simplifiedCandidatePath = simplify(
      candidatePath,
      tolerance,
      highQuality
    );

    console.debug(
      `Compare\n ${pathToStr(simplifiedPath)} (length: ${curveLength(
        simplifiedPath
      )})\n ${pathToStr(simplifiedCandidatePath)} (length: ${curveLength(
        simplifiedCandidatePath
      )}) `
    );

    const estimationPoints = candidatePath.length > 50 ? 100 : 50;
    // Internally, shapeSimilarity works by first normalizing the curves
    // using Procrustes analysis and then calculating Fréchet distance between the curves.
    // Procrustes analysis attempts to translate both the curves to the origin and adjust
    // their scale so they're the same size. Then, it rotates the curves so their
    // rotations are as close as possible.
    //
    // shapeSimilarity first redraws each curve using `estimationPoints` (50 by default)
    // points equally spaced out along the length of the curve. In addition, Procrustes analysis
    // sometimes doesn't choose the best rotation if curves are not that similar to each other,
    // ShapeSimilarity also tries 10 (by default) equally spaced rotations to make sure it
    // picks the best possible rotation normalization.
    const similarityScore = shapeSimilarity(
      simplifiedPath,
      simplifiedCandidatePath,
      {
        restrictRotationAngle: this.maxRotationAngle,
        estimationPoints: estimationPoints
      }
    );
    console.debug(`score: ${similarityScore}`);
    return similarityScore;
  }
}
