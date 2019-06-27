let mineCount = document.querySelector(".mine-count");
let easyBtn = document.querySelector(".easy");
let normalBtn = document.querySelector(".normal");
let hardBtn = document.querySelector(".hard");
let tbody = document.querySelector("#table tbody");
let refreshBtn = document.querySelector(".refreshBtn");
let realTimer = document.querySelector(".realTimer");
let mineCounter = document.querySelector(".mineCounter");
let dataset = [];
let isReady = false;
let hor;
let timerFun;
let mine;
let mineC;
let difficulty;
let 열은칸 = 0;
let 코드표 = {
  연칸: -1,
  물음표: -2,
  깃발: -3,
  깃발지뢰: -4,
  물음표지뢰: -5,
  지뢰: 1,
  보통칸: 0
};
var sourceImgUrl = {
  0: "<img src='https://minesweeper.online/img/skins/hd/type0.svg' width='25px' height='25px'/>",
  1: "<img src='https://minesweeper.online/img/skins/hd/type1.svg' width='25px' height='25px' />",
  2: "<img src='https://minesweeper.online/img/skins/hd/type2.svg' width='25px' height='25px' />",
  3: "<img src='https://minesweeper.online/img/skins/hd/type3.svg' width='25px' height='25px' />",
  4: "<img src='https://minesweeper.online/img/skins/hd/type4.svg' width='25px' height='25px' />",
  5: "<img src='https://minesweeper.online/img/skins/hd/type5.svg' width='25px' height='25px' />",
  6: "<img src='https://minesweeper.online/img/skins/hd/type6.svg' width='25px' height='25px' />",
  7: "<img src='https://minesweeper.online/img/skins/hd/type7.svg' width='25px' height='25px' />",
  8: "<img src='https://minesweeper.online/img/skins/hd/type8.svg' width='25px' height='25px' />"
};

function del() {
  let tHead = document.getElementById("tHead");
  if (tHead) tHead.remove();
}
function timer() {
  let time = 0;
  if (timerFun) clearInterval(timerFun);
  timerFun = setInterval(function() {
    if (time > 999) time = 0;
    realTimer.textContent = time;
    time++;
  }, 1000);
}

easyBtn.addEventListener("click", function() {
  refreshBtn.classList.remove("regame");
  difficulty = 1;
  del();
  timer();
  tableMaker("easy");
});
normalBtn.addEventListener("click", function() {
  refreshBtn.classList.remove("regame");
  difficulty = 2;
  del();
  timer();
  tableMaker("normal");
});

hardBtn.addEventListener("click", function() {
  refreshBtn.classList.remove("regame");
  difficulty = 3;
  del();
  timer();
  tableMaker("hard");
});

refreshBtn.addEventListener("click", function() {
  refreshBtn.classList.remove("regame");
  if (difficulty === 1) {
    tableMaker("easy");
  } else if (difficulty === 2) {
    tableMaker("normal");
  } else if (difficulty === 3) {
    tableMaker("hard");
  } else {
    alert("난이도를 선택하세요");
    return;
  }
  timer();
});

function tableMaker(text) {
  열은칸 = 0;
  if (text === "easy") {
    hor = 10;
    mine = 20;
  } else if (text === "normal") {
    hor = 15;
    mine = 30;
  } else {
    hor = 20;
    mine = 40;
  }
  mineC = mine;
  mineCounter.textContent = mineC;
  tbody.innerHTML = "";
  dataset = [];
  isReady = false;

  let mineList = Array(hor * hor)
    .fill()
    .map((c, i) => i);
  let ranMineList = [];

  while (mineList.length > hor * hor - mine) {
    let mineNumber = mineList.splice(
      Math.floor(Math.random() * mineList.length),
      1
    )[0];
    ranMineList.push(mineNumber);
  }
  
  for (let i = 0; i < hor; i++) {
    let arr = [];
    let tr = document.createElement("tr");
    dataset.push(arr);
    for (let j = 0; j < hor; j++) {
      arr.push(코드표.보통칸);
      let td = document.createElement("td");
      td.classList.add("chance");
      td.addEventListener("contextmenu", rightClick);

      td.addEventListener("click", function(e) {
        if (isReady) return;
        var parentTr = e.currentTarget.parentNode;
        var parentBody = e.currentTarget.parentNode.parentNode;
        var blank = Array.prototype.indexOf.call(
          parentTr.children,
          e.currentTarget
        );
        var blankCol = Array.prototype.indexOf.call(
          parentBody.children,
          parentTr
        );
        if (
          [
            코드표.연칸,
            코드표.깃발,
            코드표.깃발지뢰,
            코드표.물음표지뢰,
            코드표.물음표
          ].includes(dataset[blankCol][blank])
        ) {
          return;
        }
        열은칸 += 1;
        if (dataset[blankCol][blank] === 코드표.지뢰) {
          let mineAll = document.querySelectorAll(".MINE");
          for (let i = 0; i < mineAll.length; i++) {
            mineAll[i].innerHTML =
              "<img src='https://minesweeper.online/img/skins/hd/mine.svg' width='25px' height='25px' />";
          }
          e.currentTarget.innerHTML =
            "<img src='https://minesweeper.online/img/skins/hd/mine_red.svg' width='25px' height='25px' />";
          isReady = true;
          clearInterval(timerFun);
          refreshBtn.classList.add("regame");
        } else {clearInterval(timerFun);
          var 주변 = [
            dataset[blankCol][blank - 1],
            dataset[blankCol][blank + 1]
          ];
          if (dataset[blankCol - 1]) {
            주변 = 주변.concat([
              dataset[blankCol - 1][blank - 1],
              dataset[blankCol - 1][blank],
              dataset[blankCol - 1][blank + 1]
            ]);
          }
          if (dataset[blankCol + 1]) {
            주변 = 주변.concat([
              dataset[blankCol + 1][blank - 1],
              dataset[blankCol + 1][blank],
              dataset[blankCol + 1][blank + 1]
            ]);
          }
          var 주변지뢰개수 = 주변.filter(function(v) {
            return [코드표.지뢰, 코드표.깃발지뢰, 코드표.물음표지뢰].includes(
              v
            );
          }).length;
          e.currentTarget.innerHTML = sourceImgUrl[주변지뢰개수];
          e.currentTarget.classList.remove("chance");
          dataset[blankCol][blank] = 코드표.연칸;
          if (주변지뢰개수 === 0) {
            var 주변칸 = [];
            if (tbody.children[blankCol - 1]) {
              주변칸 = 주변칸.concat([
                tbody.children[blankCol - 1].children[blank - 1],
                tbody.children[blankCol - 1].children[blank],
                tbody.children[blankCol - 1].children[blank + 1]
              ]);
            }
            주변칸 = 주변칸.concat([
              tbody.children[blankCol].children[blank - 1],
              tbody.children[blankCol].children[blank + 1]
            ]);

            if (tbody.children[blankCol + 1]) {
              주변칸 = 주변칸.concat([
                tbody.children[blankCol + 1].children[blank - 1],
                tbody.children[blankCol + 1].children[blank],
                tbody.children[blankCol + 1].children[blank + 1]
              ]);
            }
            주변칸
              .filter(function(v) {
                return !!v;
              })
              .forEach(function(o) {
                let blank = Array.prototype.indexOf.call(parentTr.children, o);
                if (dataset[blankCol][blank] !== 코드표.연칸) {
                  o.click();
                }
              });
          }
        }
        if (열은칸 === hor * hor - mine && mineC === 0) {
          isReady = true;
          alert("clear!");
          clearInterval(timerFun);
          refreshBtn.classList.add("regame");
        }
      });
      td.addEventListener("mousedown", function(e) {
        var 부모tr = e.currentTarget.parentNode;
        var 부모tbody = e.currentTarget.parentNode.parentNode;
        var 칸 = Array.prototype.indexOf.call(부모tr.children, e.currentTarget);
        var 줄 = Array.prototype.indexOf.call(부모tbody.children, 부모tr);
        if (dataset[줄][칸] === 코드표.연칸) return;
        td.classList.add("mouseDown");
      });
      td.addEventListener("mouseup", function() {
        td.classList.remove("mouseDown");
      });
      tr.appendChild(td);
    }
    tbody.classList.add("tableBorder");
    tbody.appendChild(tr);
  }

  for (let i = 0; i < ranMineList.length; i++) {
    let col = Math.floor(ranMineList[i] / hor);
    let row = ranMineList[i] % hor;
    tbody.children[col].children[row].innerHTML =
      "<img src='https://minesweeper.online/img/skins/hd/closed.svg' width='25px' height='25px' />";
    tbody.children[col].children[row].classList.add("MINE");
    dataset[col][row] = 코드표.지뢰;
  }
}

function rightClick(e) {
  e.preventDefault();
  if (isReady) {
    return;
  }
  let parentTr = e.currentTarget.parentNode;
  let parentBody = e.currentTarget.parentNode.parentNode;
  let blank = Array.prototype.indexOf.call(parentTr.children, e.currentTarget);
  let blankCol = Array.prototype.indexOf.call(parentBody.children, parentTr);
  if (
    e.currentTarget.classList.contains("chance") ||
    e.currentTarget.classList.contains("MINE")
  ) {
    e.currentTarget.textContent = ".";
    mineCounter.textContent = mineC -= 1;
    e.currentTarget.classList.add("flag");
    e.currentTarget.classList.remove("MINE");
    e.currentTarget.classList.remove("chance");
    if (dataset[blankCol][blank] === 코드표.지뢰) {
      dataset[blankCol][blank] = 코드표.깃발지뢰;
    } else {
      dataset[blankCol][blank] = 코드표.깃발;
    }
  } else if (e.currentTarget.textContent === ".") {
    e.currentTarget.textContent = "`";
    e.currentTarget.classList.remove("flag");
    mineCounter.textContent = mineC += 1;
    e.currentTarget.classList.add("question");
    if (dataset[blankCol][blank] === 코드표.깃발지뢰) {
      dataset[blankCol][blank] = 코드표.물음표지뢰;
    } else {
      dataset[blankCol][blank] = 코드표.물음표;
    }
  } else if (e.currentTarget.textContent === "`") {
    e.currentTarget.classList.remove("question");
    if (dataset[blankCol][blank] === 코드표.물음표지뢰) {
      e.currentTarget.innerHTML =
        "<img src='https://minesweeper.online/img/skins/hd/closed.svg' width='25px' height='25px' />";
      e.currentTarget.classList.add("MINE");
      dataset[blankCol][blank] = 코드표.지뢰;
    } else {
      e.currentTarget.textContent = "";
      e.currentTarget.classList.add("chance");
      dataset[blankCol][blank] = 코드표.보통칸;
    }
  }
  if (열은칸 === hor * hor - mine && mineC === 0) {
    isReady = true;
    alert("clear!");
    clearInterval(timerFun);
    refreshBtn.classList.add("regame");
  }
}
