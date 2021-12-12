let str = "月胡";
let saveCan = false;

function preload() {
  r = loadJSON("expand_rrpl.json");
  // r = loadJSON("rrpl.json");
}
let r = {};
let c; //canvas
function setup() {
  c = createCanvas(400, 400);
  background(255);
  strokeWeight(2);
  let newarr = recompose();

  Object.keys(r).forEach(function (key) {
    if (key == str[index]) {
      k = r[key];
      return;
    }
  });
  tree = parse(k);
  recurse(0, 0, width, height, tree);
  if (saveCan) {
    saveCanvas(c, "test_" + num, "png");
    num++;
  }
}

function mouseClicked() {
  background(255);
  strokeWeight(2);

  Object.values(r).forEach((values) => (sequence += values + " "));
  let newarr = recompose();

  if (index < str.length) {
    index++;
    Object.keys(r).forEach(function (key) {
      if (key == str[index]) {
        k = r[key];
        return;
      }
    });
  }
  tree = parse(k);
  recurse(0, 0, width, height, tree);
  if (saveCan) {
    saveCanvas(c, "test_" + num, "png");
    num++;
  }
}
let num = 0;
let index = 0;
let tree = [];
let k = "";

// ====the expanded version has been stored as "expand_rrpl.json===="
// expand all references
// function preprocess(dict, src_dict) {
//   if (src_dict == undefined) {
//     src_dict = dict;
//   }
//   for (var k in dict) {
//     var trials = 50;
//     while (!pure(dict[k]) && trials > 0) {
//       trials -= 1;
//       for (var k0 in src_dict) {
//         dict[k] = dict[k].replace(new RegExp(k0, "g"), src_dict[k0]);
//       }
//     }
//   }
// }

// // check if string doesn't contain references
// function pure(s) {
//   var chars = /^[0-8|()-]+$/;
//   if (s.match(chars)) return true;
//   else return false;
// }

function isop(x) {
  return ["|", "-"].indexOf(x) != -1;
}

// parse a string into tree structure
function parse(x) {
  var isp = function (x) {
    return ["(", ")"].includes(x);
  };
  var ins = function (x, L, fun) {
    if (L.length > 0 && typeof L[0] == "object") {
      return [ins(x, L[0], fun)].concat(L.slice(1));
    } else {
      return fun(x, L);
    }
  };
  var jump = function (x, L) {
    if (L.length > 0 && typeof L[0] == "object") {
      if (L[0].length > 0 && typeof L[0][0] != "object") {
        return [x].concat(L);
      }
    }
    return [jump(x, L[0])].concat(L.slice(1));
  };
  var listify = function (x) {
    if (x.length == 0) {
      return [];
    }
    var car = x[0];
    var cdr = x.slice(1);

    var res = listify(cdr);
    if (car == ")") {
      res = ins([], res, (x, L) => [x].concat(L));
    } else if (car == "(") {
      res = jump("$", res);
    } else if (isop(car)) {
      res = ins(car, res, (x, L) => [x].concat(L));
    } else {
      res = ins(car, res, (x, L) =>
        L.length == 0 || isop(L[0])
          ? [x].concat(L)
          : [x + L[0]].concat(L.slice(1))
      );
    }
    return res;
  };
  var clean = function (x, L) {
    return L.filter((y) => (typeof y == "object" ? true : x != y)).map((y) =>
      typeof y == "object" ? clean(x, y) : y
    );
  };
  var pfxop = function (L) {
    if (typeof L != "object") {
      return L;
    }
    if (L.length == 1) {
      return pfxop(L[0]);
    }
    return [L.filter((x) => isop(x)).join("")].concat(
      L.filter((x) => !isop(x)).map(pfxop)
    );
  };
  return pfxop(clean("$", listify(x)));
}

function recurse(startX, startY, w, h, currentBranch) {
  //  console.log(currentBranch);
  let horizonDivNum =
    currentBranch[0].indexOf("-") == -1 ? 1 : currentBranch[0].length + 1;
  let vertDivNum =
    currentBranch[0].indexOf("-") == -1 ? currentBranch[0].length + 1 : 1;

  let horizonEdge = w / (horizonDivNum * 2);
  let vertEdge = h / (vertDivNum * 2);

  for (let i = 0; i < horizonDivNum; i++) {
    for (let j = 0; j < vertDivNum; j++) {
      let g = new Grid(
        (i * 2 + 1) * horizonEdge + startX,
        (j * 2 + 1) * vertEdge + startY,
        horizonEdge,
        vertEdge
      );
      if (typeof currentBranch[i + j + 1] === "object") {
        recurse(
          i * 2 * horizonEdge + startX,
          j * 2 * vertEdge + startY,
          horizonEdge * 2,
          vertEdge * 2,
          currentBranch[i + j + 1]
        );
      } else {
        //if (typeof currentBranch[i+j+1] === "string")
        g.render(currentBranch[i + j + 1]);
      }
    }
  }
}

let sequence = "";

function randomPair() {
  let value;
  let en = Object.entries(r);
  let randomKey = floor(random(en.length));
  return en[randomKey][1];
}

function preprocess(str) {
  let segments = [];
  let index = -1;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "(" || str[i] === "|") {
      index++;
      segments[index] = "";
      segments[index] += str[i];
      index++;
      segments[index] = "";
    } else if (str[i] === ")") {
      index++;
      segments[index] = "";
      segments[index] += str[i];
    } else {
      segments[index] += str[i];
    }
  }
}

function chopString(str) {
  let open = 0;
  let close = 0;
  let index = 0;
  let segments = [];
  segments[0] = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "(") {
      open++;
    } else if (str[i] === ")") {
      close++;
    }
    segments[index] += str[i];

    if (open === close) {
      index++;
      segments[index] = "";
    }
  }
  return segments;
}
function recompose() {
  let l = random(1, 3);
  let newKey = "";
  for (let i = 0; i < l; i++) {
    let segments = chopString(randomPair());
    newKey += segments[0];
    if (random(2) < 1) {
      newKey += "|";
    } else {
      newKey += "-";
    }
  }
  return newKey.slice(0, -1);
}
