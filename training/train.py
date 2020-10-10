import cubicsuperpath, simplepath, cspsubdiv
from xml.dom import minidom
import argparse
import json
import os
import sys
import simplify


def flatten(p, flat=10.0, round_to_int=True):
    """
    Flatten a bezier curve to polylines or simple x,y coordinates

    Arguments:

     * p: path array
     * flat: Flattening degree
    """
    cspsubdiv.cspsubdiv(p, flat)
    stroke = []
    for sp in p:
        for csp in sp:
            stroke.append({"x": round(csp[1][0]), "y": round(csp[1][1])})
    return stroke


def get_path(svg_file):
    doc = minidom.parse(svg_file)
    path_strings = [path.getAttribute("d") for path in doc.getElementsByTagName("path")]
    return path_strings


def extract_strokes(svg_file):
    path_strings = get_path(svg_file)
    strokes = []
    for path_string in path_strings:
        p = cubicsuperpath.parsePath(path_string)
        strokes.append(flatten(p))
    return strokes


def parse_args():
    parser = argparse.ArgumentParser(
        description="Convert SVG outlines flattened polylines"
    )
    parser.add_argument(
        "-t",
        "--training_file",
        metavar="language.json",
        help="Input JSON file containing training data",
    )
    parser.add_argument(
        "-o",
        "--output_file",
        default=sys.stdout,
        metavar="language.json",
        help="Output JSON file containing data for the language",
    )
    return parser.parse_args()


def main(options):
    result = {}
    with open(options.training_file, "r") as training_data_file:
        training_data = training_data_file.read()
    training_data = json.loads(training_data)
    language = training_data["language"]
    letters = training_data["data"]
    training_data_dir = os.path.dirname(os.path.realpath(options.training_file))
    print("Language %s(%s)" % (language["name"], language["code"]))
    for letter in letters:
        # print("Letter %s" % (letter["letter"]))
        samples = []
        for sample_file_name in letter["samples"]:
            sample_file = os.path.join(training_data_dir, sample_file_name)
            strokes = extract_strokes(sample_file)
            simplifiedStrokes = [simplify.simplify(stroke, 5, True) for stroke in strokes]
            # print("\t%s" % (sample_file_name))
            samples.append({"strokes": simplifiedStrokes})
        result[letter["letter"]] = {"samples": samples}
    return result


if __name__ == "__main__":
    options = parse_args()
    result = main(options)
    if options.output_file:
        with open(options.output_file, "w") as outfile:
            json.dump(result, outfile, indent=4, ensure_ascii=False)
    else:
        print(json.dumps(result, indent=4, ensure_ascii=False))
