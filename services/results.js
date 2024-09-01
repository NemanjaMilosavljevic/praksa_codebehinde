const TournamentStatisticService = require("./tournamentStatistic");
const GroupStageRules = require("./groupStageRules");

const groups = require("../groups.json");

module.exports = class ResultService {
  constructor() {}

  static getBaskets(teamAvgBaskets, victoryFactor, isLuckyToday) {
    const formattedVictoryFactor =
      victoryFactor > 0.5
        ? 1 + (2 * victoryFactor - 1) / 10
        : victoryFactor < 0.5
        ? 1 - (1 - 2 * victoryFactor) / 10
        : 1;

    //ako je srecan neki tim, pomeramo mu default granicu min/max za 8 kosa
    let max;
    let min;
    if (isLuckyToday) {
      max = teamAvgBaskets * 1.1 * formattedVictoryFactor + 8;
      min = teamAvgBaskets * 0.9 * formattedVictoryFactor + 8;
    }
    // default state je avgBasket +- 10%
    max = teamAvgBaskets * 1.1 * formattedVictoryFactor;
    min = teamAvgBaskets * 0.9 * formattedVictoryFactor;

    return Math.floor(Math.random() * (max - min) + min);
  }

  static resultMatchHandler(host, guest) {
    const rankingFactorForHost =
      TournamentStatisticService.getWinningFactorByRanking(
        host.rank,
        guest.rank
      );

    const formFactor =
      TournamentStatisticService.getWinningFactorBasedOnTeamForm(
        host.currentForm,
        guest.currentForm
      );

    let isHostLuckyToday = TournamentStatisticService.isLuckDayToday();
    let isGuestLuckyToday = TournamentStatisticService.isLuckDayToday();

    if (isHostLuckyToday === isGuestLuckyToday) {
      isHostLuckyToday = false;
      isGuestLuckyToday = false;
    }

    let overallChanceToWinHost = +(formFactor + rankingFactorForHost).toFixed(
      2
    );

    if (overallChanceToWinHost > 1) {
      overallChanceToWinHost = 1;
    }

    const overallChanceToWinGuest = +(1 - overallChanceToWinHost).toFixed(2);

    let hostBaskets = this.getBaskets(
      host.avgGivenBasket,
      overallChanceToWinHost,
      isHostLuckyToday
    );

    let guestBaskets = this.getBaskets(
      guest.avgGivenBasket,
      overallChanceToWinGuest,
      isGuestLuckyToday
    );

    if (hostBaskets === guestBaskets) {
      const { hostOvertimeBaskets, guestOvertimeBaskets } =
        this.overtimeHandler(hostBaskets);

      TournamentStatisticService.updateTeamForm(
        {
          status: hostOvertimeBaskets > guestOvertimeBaskets ? "WIN" : "LOSE",
          currentForm: host.currentForm,
          basketsDiff: hostOvertimeBaskets - guestOvertimeBaskets,
          team: host.team,
        },
        {
          status: hostOvertimeBaskets > guestOvertimeBaskets ? "WIN" : "LOSE",
          currentForm: guest.currentForm,
          basketsDiff: guestOvertimeBaskets - hostOvertimeBaskets,
          team: guest.team,
        }
      );

      return {
        host: {
          team: host.team,
          basketsRegular: hostBaskets,
          basketsRecievedRegular: guestBaskets,
          baskets: hostOvertimeBaskets,
          basketsRecieved: guestOvertimeBaskets,
          status: hostOvertimeBaskets > guestOvertimeBaskets ? "WIN" : "LOSE",
        },
        guest: {
          team: guest.team,
          basketsRegular: guestBaskets,
          basketsRecievedRegular: hostBaskets,
          baskets: guestOvertimeBaskets,
          basketsRecieved: hostOvertimeBaskets,
          status: hostOvertimeBaskets > guestOvertimeBaskets ? "LOSE" : "WIN",
        },
      };
    }

    TournamentStatisticService.updateTeamForm(
      {
        status: hostBaskets > guestBaskets ? "WIN" : "LOSE",
        currentForm: host.currentForm,
        basketsDiff: hostBaskets - guestBaskets,
        team: host.team,
      },
      {
        status: hostBaskets > guestBaskets ? "WIN" : "LOSE",
        currentForm: guest.currentForm,
        basketsDiff: guestBaskets - hostBaskets,
        team: guest.team,
      }
    );

    return {
      host: {
        team: host.team,
        baskets: hostBaskets,
        basketsRecieved: guestBaskets,
        status: hostBaskets > guestBaskets ? "WIN" : "LOSE",
      },
      guest: {
        team: guest.team,
        baskets: guestBaskets,
        basketsRecieved: hostBaskets,
        status: hostBaskets > guestBaskets ? "LOSE" : "WIN",
      },
    };
  }

  static overtimeHandler(result) {
    let hostOvertimeBaskets = +(result + Math.floor(Math.random() * 15));
    let guestOvertimeBaskets = +(result + Math.floor(Math.random() * 15));

    if (hostOvertimeBaskets === guestOvertimeBaskets) {
      return this.overtimeHandler(hostOvertimeBaskets);
    }

    return {
      hostOvertimeBaskets,
      guestOvertimeBaskets,
    };
  }

  static groupStageResultHandler(pairs) {
    const res = pairs.map((match) => {
      const results = this.resultMatchHandler(
        this.getTeamStatsByTeamName(match[0]),
        this.getTeamStatsByTeamName(match[1])
      );

      return results;
    });

    return res;
  }

  static getTeamStatsByTeamName(teamName) {
    const teamsNames =
      TournamentStatisticService.getParticipantsDataByPropertyName(
        groups,
        "Team"
      );
    const teamsISOCodes =
      TournamentStatisticService.getParticipantsDataByPropertyName(
        groups,
        "ISOCode"
      );

    const targetedIndex = teamsNames.indexOf(teamName);
    const targetedISOCode = teamsISOCodes[targetedIndex];

    const participantsStats = TournamentStatisticService.getParticipantsStats();

    return participantsStats[targetedISOCode];
  }

  static getTeamNameByISOCode(ISOCode) {
    const teamsNames =
      TournamentStatisticService.getParticipantsDataByPropertyName(
        groups,
        "Team"
      );
    const teamsISOCodes =
      TournamentStatisticService.getParticipantsDataByPropertyName(
        groups,
        "ISOCode"
      );

    const targetedIndex = teamsISOCodes.indexOf(ISOCode);
    const targetedTeamName = teamsNames[targetedIndex];

    return targetedTeamName;
  }

  static winCounter(groupStageData, teamName) {
    let totalWins = 0;

    groupStageData.map((data) => {
      Object.values(data).map((teamStats) => {
        if (teamStats.team === teamName) {
          totalWins = teamStats.status === "WIN" ? ++totalWins : totalWins;
        }
      });
    });

    return totalWins;
  }

  static basketsCounter(groupStageData, teamName) {
    let totalGivenBaskets = 0;
    let totalRecievedBaskets = 0;

    groupStageData.map((data) => {
      Object.values(data).map((teamStats) => {
        if (teamStats.team === teamName) {
          totalGivenBaskets += +teamStats.baskets;
          totalRecievedBaskets += +teamStats.basketsRecieved;
        }
      });
    });

    return {
      totalGivenBaskets,
      totalRecievedBaskets,
    };
  }

  static calculateGroupsStats(groupsResult) {
    const teamNames =
      TournamentStatisticService.getParticipantsDataByPropertyName(
        groups,
        "ISOCode"
      );
    const groupStats = teamNames.map((team, index) => {
      const wins = this.winCounter(groupsResult, team);
      const { totalGivenBaskets, totalRecievedBaskets } = this.basketsCounter(
        groupsResult,
        team
      );

      return {
        group:
          index >= 0 && index < 4 ? "A" : index >= 4 && index < 8 ? "B" : "C",
        team,
        wins,
        loses: 3 - wins,
        points: GroupStageRules.getPoints(wins, 3 - wins),
        totalGivenBaskets,
        totalRecievedBaskets,
        basketsDiff: totalGivenBaskets - totalRecievedBaskets,
      };
    });

    return groupStats;
  }

  static eliminationStageResultHandler(data, identificator) {
    if (identificator === "lose") {
      return data
        .map((match) => {
          return Object.values(match)
            .map((teamStats) => teamStats.status === "LOSE" && teamStats.team)
            .filter((elem) => elem);
        })
        .flat();
    }
    return data
      .map((match) => {
        return Object.values(match)
          .map((teamStats) => teamStats.status === "WIN" && teamStats.team)
          .filter((elem) => elem);
      })
      .flat();
  }
};
