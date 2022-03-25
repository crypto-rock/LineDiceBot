const _split = (cmd) => {
  var split = "";
  if (cmd.includes("/") || cmd.includes("=")) {
    if (cmd.includes("/")) split = cmd.split("/");
    if (cmd.includes("=")) split = cmd.split("=");

    if (split[1].split(" ")[1] != "" && split[1].split(" ")[0] == "Y") {
      return split;
    } else if (
      (split.length != 2 &&
        split[1].length != parseInt(split[1]).toString().length) ||
      split[1].includes("/") ||
      split[1].includes("=")
    ) {
      return false;
    } else return split;
  }
};

const parser = (cmd) => {
  try {
    if (cmd) {
      var split = _split(cmd);
      var len = split.length;
      try {
        if (split[0] === "") {
          if (split[len - 1].split(" ")[0] == "Y" && split[len - 1][1])
            return "normal";
          switch (split[len - 1]) {
            case "X":
              return "normal";

            case "C":
              return "normal";

            case "A":
              return "normal";

            case "B":
              return "normal";

            case "S":
              return "normal";

            case "Y":
              return "normal";

            case "N":
              return "normal";
          }
        } else if (
          (split[0].toString().length === 1 && split[0] > 0 && split[0] <= 6) ||
          split[0] === "large" ||
          split[0] === "small" ||
          split[0] === "odds" ||
          split[0] === "even"
        ) {
          if (
            split[0] === "large" ||
            split[0] === "small" ||
            split[0] === "odds" ||
            split[0] === "even"
          ) {
            return split[0];
          }
          if (
            parseInt(split[1]).toString() !== "NaN" &&
            split[1].length === parseInt(split[1]).toString().length
          ) {
            return "single";
          }
        } else if (
          split[0].toString().length <= 3 &&
          split[0].toString().length > 1 &&
          split[0] <= 666 &&
          parseInt(split[0]).toString() !== "NaN" &&
          split[0].length === parseInt(split[0]).toString().length
        ) {
          return "double";
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { parser };
