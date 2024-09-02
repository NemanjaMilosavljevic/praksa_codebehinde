let roundPairsTemplate = document.getElementById("rounds");
let poolTemplate = document.getElementById("pool");
let tableTemplate = document.getElementById("table");
let qfTemplate = document.getElementById("qf");
let finalTemplate = document.getElementById("final");
let medalsTemplate = document.getElementById("medals");
let notFoundTemplate = document.getElementById("not-found");

let poolsWrapper = document.querySelector(".pools-container");
let groupsWrapper = document.querySelector(".group-stage");
let tablesWrapper = document.querySelector(".table-container");
let quarterfinalWrapper = document.querySelector(".qf-container");
let finalsWrapper = document.querySelector(".finals-container");
let medalsWrapper = document.querySelector(".medals");
let notFoundWrapper = document.querySelector(".not-found");

let buttonEl = document.querySelector(".new-tournament");
let clickButton;

const xhr = new XMLHttpRequest();

xhr.open("GET", "http://localhost:5000", true);

xhr.onload = () => {
  const data = JSON.parse(xhr.response);

  const { pools, rounds, ranking, mainStage, medals } = data;

  pools.map((pool, index) => {
    const poolEl = document.importNode(poolTemplate.content, true);
    poolEl.querySelector("h1").textContent =
      index === 0
        ? "ŠEŠIR D"
        : index === 1
        ? "ŠEŠIR E"
        : index === 2
        ? "ŠEŠIR F"
        : "ŠEŠIR G";

    poolEl.querySelector(".first-p").textContent = pool[0];
    poolEl.querySelector(".second-p").textContent = pool[1];

    poolsWrapper.append(poolEl);
  });

  Object.values(rounds).map((round, idx) => {
    let roundEl = document.importNode(roundPairsTemplate.content, true);

    const heading = idx === 0 ? "I KOLO" : idx === 1 ? "II KOLO" : "III KOLO";

    roundEl.querySelector("h1").textContent = heading;
    roundEl.querySelector(".pairsA .first-p").textContent = round[0];
    roundEl.querySelector(".pairsA .second-p").textContent = round[1];
    roundEl.querySelector(".pairsB .first-p").textContent = round[2];
    roundEl.querySelector(".pairsB .second-p").textContent = round[3];
    roundEl.querySelector(".pairsC .first-p").textContent = round[4];
    roundEl.querySelector(".pairsC .second-p").textContent = round[5];

    groupsWrapper.append(roundEl);
  });

  Object.values(ranking).map((group) => {
    let tableEl = document.importNode(tableTemplate.content, true);

    group.map((team, index) => {
      const selector =
        index === 0
          ? ".first"
          : index === 1
          ? ".second"
          : index === 2
          ? ".third"
          : ".forth";

      tableEl.querySelector(
        ".group-name"
      ).textContent = `Grupa ${group[0].group}`;
      const tableRow = tableEl.querySelector(selector).children;
      tableRow.item(1).textContent = team.team;
      tableRow.item(2).textContent = team.wins;
      tableRow.item(3).textContent = team.loses;
      tableRow.item(4).textContent = team.points;
      tableRow.item(5).textContent = team.totalGivenBaskets;
      tableRow.item(6).textContent = team.totalRecievedBaskets;
      tableRow.item(7).textContent = team.basketsDiff;
    });

    const tableHeaderEl = document.querySelector(".subheader");
    tableHeaderEl.setAttribute("class", "subheader show");

    tablesWrapper.append(tableEl);
  });

  mainStage.qf.map((match, index) => {
    let qfEl = document.importNode(qfTemplate.content, true);

    qfEl.querySelector(
      ".first-inner-mainstage-container .teamname"
    ).textContent = match.host;
    qfEl.querySelector(".first-inner-mainstage-container .result").textContent =
      match.hostResult;
    qfEl.querySelector(
      ".second-inner-mainstage-container .teamname"
    ).textContent = match.guest;
    qfEl.querySelector(
      ".second-inner-mainstage-container .result"
    ).textContent = match.guestResult;

    qfEl
      .querySelector(".mainstage-container")
      .setAttribute("class", `mainstage-container container-${index}`);

    const mainstageHeaderEl = document.querySelector(".mainstage-header");
    mainstageHeaderEl.setAttribute("class", "mainstage-header show");

    quarterfinalWrapper.append(qfEl);
  });

  mainStage.sf.map((match, index) => {
    let qfEl = document.importNode(qfTemplate.content, true);
    qfEl.querySelector(
      ".first-inner-mainstage-container .teamname"
    ).textContent = match.host;
    qfEl.querySelector(".first-inner-mainstage-container .result").textContent =
      match.hostResult;
    qfEl.querySelector(
      ".second-inner-mainstage-container .teamname"
    ).textContent = match.guest;
    qfEl.querySelector(
      ".second-inner-mainstage-container .result"
    ).textContent = match.guestResult;

    qfEl
      .querySelector(".mainstage-container")
      .setAttribute("class", `mainstage-container container-sf-${index}`);

    quarterfinalWrapper.append(qfEl);
  });

  data.mainStage.finals.map((match, index) => {
    let finalEl = document.importNode(finalTemplate.content, true);

    finalEl.querySelector("h3").textContent =
      index === 0 ? "FINALE" : "TREĆE MESTO";
    finalEl.querySelector(
      ".first-inner-mainstage-container .teamname"
    ).textContent = match.host;
    finalEl.querySelector(
      ".first-inner-mainstage-container .result"
    ).textContent = match.hostResult;
    finalEl.querySelector(
      ".second-inner-mainstage-container .teamname"
    ).textContent = match.guest;
    finalEl.querySelector(
      ".second-inner-mainstage-container .result"
    ).textContent = match.guestResult;

    finalEl
      .querySelector(".mainstage-container")
      .setAttribute("class", `mainstage-container finals-${index}`);

    finalsWrapper.append(finalEl);
  });

  Object.values(medals).map((team, index) => {
    let medalEl = document.importNode(medalsTemplate.content, true);

    const medalsHeaderEl = document.querySelector(".medals-container h2");
    medalsHeaderEl.setAttribute("class", "show");

    medalEl
      .querySelector("img")
      .setAttribute(
        "src",
        index === 0
          ? "./client/assets/gold.svg"
          : index === 1
          ? "./client/assets/silver.svg"
          : "./client/assets/bronze.svg"
      );

    medalEl.querySelector("span").textContent = team;

    medalsWrapper.append(medalEl);
  });

  clickButton = buttonEl.addEventListener("click", startNewTournament);
  buttonEl.setAttribute("class", "new-tournament show");
};

xhr.onerror = () => {
  if (xhr.status === 0) {
    let notfoundEl = document.importNode(notFoundTemplate.content, true);

    notfoundEl.querySelector("h1").textContent =
      "Server not running! Please start it to see tournament results";

    const mainEl = document.querySelector("main");
    mainEl.setAttribute("class", "hidden");

    notFoundWrapper.append(notfoundEl);
  }
};

xhr.send();

const startNewTournament = (e) => {
  e.preventDefault();

  removeEventListener("click", clickButton);

  window.location.reload();
};
