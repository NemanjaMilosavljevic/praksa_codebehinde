const ResultService = require("./results");

module.exports = class FormatOutputService {
  constructor() {}

  static formatGroupStageData(groupA, groupB, groupC) {
    const groupAPairs = groupA.map((data) => {
      if (data.host.basketsRegular) {
        return `${ResultService.getTeamNameByISOCode(
          data.host.team
        )} - ${ResultService.getTeamNameByISOCode(data.guest.team)} (${
          data.host.baskets
        } : ${data.guest.baskets}) OT`;
      }
      return `${ResultService.getTeamNameByISOCode(
        data.host.team
      )} - ${ResultService.getTeamNameByISOCode(data.guest.team)} (${
        data.host.baskets
      } : ${data.guest.baskets})`;
    });

    const groupBPairs = groupB.map((data) => {
      if (data.host.basketsRegular) {
        return `${ResultService.getTeamNameByISOCode(
          data.host.team
        )} - ${ResultService.getTeamNameByISOCode(data.guest.team)} (${
          data.host.baskets
        } : ${data.guest.baskets}) OT`;
      }
      return `${ResultService.getTeamNameByISOCode(
        data.host.team
      )} - ${ResultService.getTeamNameByISOCode(data.guest.team)} (${
        data.host.baskets
      } : ${data.guest.baskets})`;
    });

    const groupCPairs = groupC.map((data) => {
      if (data.host.basketsRegular) {
        return `${ResultService.getTeamNameByISOCode(
          data.host.team
        )} - ${ResultService.getTeamNameByISOCode(data.guest.team)} (${
          data.host.baskets
        } : ${data.guest.baskets}) OT`;
      }
      return `${ResultService.getTeamNameByISOCode(
        data.host.team
      )} - ${ResultService.getTeamNameByISOCode(data.guest.team)} (${
        data.host.baskets
      } : ${data.guest.baskets})`;
    });

    return {
      firstRound: [
        groupAPairs[0],
        groupAPairs[1],
        groupBPairs[0],
        groupBPairs[1],
        groupCPairs[0],
        groupCPairs[1],
      ],
      secondRound: [
        groupAPairs[2],
        groupAPairs[3],
        groupBPairs[2],
        groupBPairs[3],
        groupCPairs[2],
        groupCPairs[3],
      ],
      thirdRound: [
        groupAPairs[4],
        groupAPairs[5],
        groupBPairs[4],
        groupBPairs[5],
        groupCPairs[4],
        groupCPairs[5],
      ],
    };
  }

  static formatPool(poolD, poolE, poolF, poolG) {
    const formattedPoolD = poolD.map((team) =>
      ResultService.getTeamNameByISOCode(team)
    );
    const formattedPoolE = poolE.map((team) =>
      ResultService.getTeamNameByISOCode(team)
    );
    const formattedPoolF = poolF.map((team) =>
      ResultService.getTeamNameByISOCode(team)
    );
    const formattedPoolG = poolG.map((team) =>
      ResultService.getTeamNameByISOCode(team)
    );
    return [formattedPoolD, formattedPoolE, formattedPoolF, formattedPoolG];
  }

  static formatMainStageData(QFData, SFData, medalsMatchData) {
    const quarterfinal = QFData.map((data) => {
      return {
        host: ResultService.getTeamNameByISOCode(data.host.team),
        hostResult: data.host.baskets,
        guest: ResultService.getTeamNameByISOCode(data.guest.team),
        guestResult: data.guest.baskets,
      };
    });

    const semifinal = SFData.map((data) => {
      return {
        host: ResultService.getTeamNameByISOCode(data.host.team),
        hostResult: data.host.baskets,
        guest: ResultService.getTeamNameByISOCode(data.guest.team),
        guestResult: data.guest.baskets,
      };
    });

    const medalMatches = medalsMatchData.map((data) => {
      return {
        host: ResultService.getTeamNameByISOCode(data.host.team),
        hostResult: data.host.baskets,
        guest: ResultService.getTeamNameByISOCode(data.guest.team),
        guestResult: data.guest.baskets,
      };
    });

    return { qf: quarterfinal, sf: semifinal, finals: medalMatches };
  }

  static formatMedalTeams(data) {
    return Object.values(data).map((team) =>
      ResultService.getTeamNameByISOCode(team)
    );
  }
};
