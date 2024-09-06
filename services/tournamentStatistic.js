const exibitions = require("../exibitions.json");

module.exports = class TournamentStatisticService {
  static teamsStats;
  static teamNames;
  static teamISOCodes;
  static teamRanks;
  constructor() {}

  static getTeamNames() {
    return this.teamNames;
  }

  static getTeamISOCodes() {
    return this.teamISOCodes;
  }

  static getTeamRanks() {
    return this.teamRanks;
  }

  static setTeamNames(data) {
    this.teamNames = data;
  }

  static setTeamISOCodes(data) {
    this.teamISOCodes = data;
  }

  static setTeamRanks(data) {
    this.teamRanks = data;
  }

  static getTeamsStats() {
    return this.teamsStats;
  }

  static setTeamsStats(data) {
    this.teamsStats = data;
  }

  static getParticipantsDataByPropertyName(participantsData, target) {
    let participantsDataArray = [];

    target.map((targetProperty) => {
      targetProperty in participantsData
        ? participantsDataArray.push(participantsData[targetProperty])
        : Object.values(participantsData).map((group) => {
            group.forEach((element) => {
              participantsDataArray.push(element[targetProperty]);
            });
          });
    });

    this.setTeamNames(participantsDataArray.slice(0, 12));
    this.setTeamISOCodes(participantsDataArray.slice(12, 24));
    this.setTeamRanks(participantsDataArray.slice(24));
  }

  static isLuckDayToday() {
    const luckNumber = 7;

    const randomNumber = Math.floor(Math.random() * 100);

    return luckNumber === randomNumber;
  }

  static getWinningFactorByRanking(hostRank, guestRank) {
    const teamRanks = this.getTeamRanks();

    const maxRankDiffInTournament = Math.max(teamRanks) - Math.min(teamRanks);

    const rankDiff = hostRank - guestRank;
    const correlationFactorPerRankDiff = (50 / maxRankDiffInTournament).toFixed(
      2
    );
    let chanceToWin;

    if (rankDiff === 1) {
      chanceToWin = 0.5;
    }

    chanceToWin =
      (50 + Math.abs(rankDiff) * correlationFactorPerRankDiff) / 100;

    if (Math.sign(rankDiff) === 1) {
      chanceToWin = 1 - chanceToWin;
    }

    return +chanceToWin.toFixed(2);
  }

  static getInitialTeamForm(exibitionsData, team) {
    let teamData;

    if (team in exibitionsData) {
      teamData = exibitionsData[team];
    }

    const teamScoreStatus = teamData.filter((match) => {
      const resultsArray = match.Result.split("-");
      return +resultsArray[0] > +resultsArray[1];
    });

    switch (teamScoreStatus.length) {
      case 2:
        return "GREAT";
      case 1:
        return "GOOD";
      default:
        return "BAD";
    }
  }

  static getTeamsStatsBasedOnExibitions(exibitionsData) {
    let overallStats = {};
    for (const team in exibitionsData) {
      const getStatsPerTeam = exibitionsData[team].reduce((acc, val) => {
        const totalReceivedBasket =
          +acc.Result.split("-")[1] + +val.Result.split("-")[1];
        const avgReceivedBasket = totalReceivedBasket / 2;
        const totalGivenBasket =
          +acc.Result.split("-")[0] + +val.Result.split("-")[0];
        const avgGivenBasket = totalGivenBasket / 2;

        return {
          avgReceivedBasket,
          avgGivenBasket,
          totalGivenBasket,
          totalReceivedBasket,
        };
      });

      overallStats[team] = {
        team: team,
        avgGivenBasket: getStatsPerTeam.avgGivenBasket,
        avgReceivedBasket: getStatsPerTeam.avgReceivedBasket,
        totalGivenBasket: getStatsPerTeam.totalGivenBasket,
        totalReceivedBasket: getStatsPerTeam.totalReceivedBasket,
        basketRatio: (
          getStatsPerTeam.avgGivenBasket / getStatsPerTeam.avgReceivedBasket
        ).toFixed(2),
      };
    }

    return overallStats;
  }

  static getWinningFactorBasedOnTeamForm(hostForm, guestForm) {
    switch (true) {
      case hostForm === guestForm:
        return 0;
      case (hostForm === "GREAT" && guestForm === "GOOD") ||
        (hostForm === "GOOD" && guestForm === "BAD"):
        return 0.05;
      case hostForm === "GREAT" && guestForm === "BAD":
        return 0.1;
      case (hostForm === "GOOD" && guestForm === "GREAT") ||
        (hostForm === "BAD" && guestForm === "GOOD"):
        return -0.05;
      default:
        return -0.1;
    }
  }

  static updateTeamForm(hostData, guestData) {
    switch (true) {
      case (hostData.status === "WIN" &&
        hostData.currentForm === "BAD" &&
        hostData.basketsDiff < 20) ||
        (hostData.status === "LOSE" &&
          hostData.currentForm === "GREAT" &&
          (guestData.currentForm === "BAD" ||
            guestData.currentForm === "GOOD") &&
          hostData.basketsDiff < 25) ||
        (hostData.status === "LOSE" &&
          hostData.currentForm === "GREAT" &&
          guestData.currentForm === "GREAT" &&
          hostData.basketsDiff < -10):
        return (this.getTeamsStats()[hostData.team].currentForm = "GOOD");

      case (guestData.status === "WIN" &&
        guestData.currentForm === "BAD" &&
        guestData.basketsDiff < 20) ||
        (guestData.status === "LOSE" &&
          guestData.currentForm === "GREAT" &&
          (hostData.currentForm === "BAD" || hostData.currentForm === "GOOD") &&
          guestData.basketsDiff < 25) ||
        (guestData.status === "LOSE" &&
          guestData.currentForm === "GREAT" &&
          hostData.currentForm === "GREAT" &&
          guestData.basketsDiff < -10):
        return (this.getTeamsStats()[guestData.team].currentForm = "GOOD");

      case (hostData.status === "WIN" &&
        hostData.currentForm === "GOOD" &&
        (guestData.currentForm === "GREAT" ||
          guestData.currentForm === "GOOD")) ||
        (hostData.status === "WIN" &&
          hostData.currentForm === "BAD" &&
          hostData.basketsDiff > 20):
        return (this.getTeamsStats()[hostData.team].currentForm = "GREAT");

      case (guestData.status === "WIN" &&
        guestData.currentForm === "GOOD" &&
        (hostData.currentForm === "GREAT" ||
          hostData.currentForm === "GOOD")) ||
        (guestData.status === "WIN" &&
          guestData.currentForm === "BAD" &&
          guestData.basketsDiff > 20):
        return (this.getTeamsStats()[guestData.team].currentForm = "GREAT");

      case (hostData.status === "LOSE" &&
        hostData.currentForm === "GOOD" &&
        (guestData.currentForm === "BAD" ||
          guestData.currentForm === "GOOD")) ||
        (hostData.status === "LOSE" &&
          hostData.currentForm === "GREAT" &&
          guestData.currentForm === "BAD" &&
          hostData.basketsDiff > 25):
        return (this.getTeamsStats()[hostData.team].currentForm = "BAD");

      case (guestData.status === "LOSE" &&
        guestData.currentForm === "GOOD" &&
        (hostData.currentForm === "BAD" || hostData.currentForm === "GOOD")) ||
        (guestData.status === "LOSE" &&
          guestData.currentForm === "GREAT" &&
          hostData.currentForm === "BAD" &&
          guestData.basketsDiff > 25):
        return (this.getTeamsStats()[guestData.team].currentForm = "BAD");

      default:
        return;
    }
  }

  static getParticipantsStats() {
    const teamsISOCodes = this.getTeamISOCodes();
    const teamsRanks = this.getTeamRanks();

    const statsBasedOnExibitions =
      this.getTeamsStatsBasedOnExibitions(exibitions);

    const teamsStats = teamsISOCodes.map((team, index) => {
      return {
        rank: teamsRanks[index],
        avgGivenBasket: +statsBasedOnExibitions[team].avgGivenBasket,
        avgReceivedBasket: +statsBasedOnExibitions[team].avgReceivedBasket,
        basketRatio: +statsBasedOnExibitions[team].basketRatio,
        currentForm: this.getInitialTeamForm(exibitions, team),
        team: team,
      };
    });

    this.setTeamsStats({
      CAN: teamsStats[0],
      AUS: teamsStats[1],
      GRE: teamsStats[2],
      ESP: teamsStats[3],
      GER: teamsStats[4],
      FRA: teamsStats[5],
      BRA: teamsStats[6],
      JPN: teamsStats[7],
      USA: teamsStats[8],
      SRB: teamsStats[9],
      SSD: teamsStats[10],
      PRI: teamsStats[11],
    });
  }
};
