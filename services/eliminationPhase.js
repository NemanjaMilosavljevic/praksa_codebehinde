const ResultService = require("./results");

module.exports = class EliminationPhaseService {
  constructor() {}

  static getQFResults(QFPairs) {
    const QFResults = Object.values(QFPairs).map((match) => {
      const hostTeamName = ResultService.getTeamNameByISOCode(match[0]);
      const guestTeamName = ResultService.getTeamNameByISOCode(match[1]);

      const results = ResultService.resultMatchHandler(
        ResultService.getTeamStatsByTeamName(hostTeamName),
        ResultService.getTeamStatsByTeamName(guestTeamName)
      );

      return results;
    });
    return QFResults;
  }

  static formSemifinalPairs(QFResults) {
    const teamMovingToSemifinal =
      ResultService.eliminationStageResultHandler(QFResults);

    return {
      firstSemiPair: [teamMovingToSemifinal[0], teamMovingToSemifinal[1]],
      secondSemiPair: [teamMovingToSemifinal[2], teamMovingToSemifinal[3]],
    };
  }

  static getSemifinalResults(semiPairs) {
    const SFResults = Object.values(semiPairs).map((match) => {
      const hostTeamName = ResultService.getTeamNameByISOCode(match[0]);
      const guestTeamName = ResultService.getTeamNameByISOCode(match[1]);

      const results = ResultService.resultMatchHandler(
        ResultService.getTeamStatsByTeamName(hostTeamName),
        ResultService.getTeamStatsByTeamName(guestTeamName)
      );

      return results;
    });

    return SFResults;
  }

  static formFinalAndMatchForThirdPlace(SFResults) {
    const teamsMovingToFinal =
      ResultService.eliminationStageResultHandler(SFResults);
    const teamsForThirdPlace = ResultService.eliminationStageResultHandler(
      SFResults,
      "lose"
    );

    return { final: teamsMovingToFinal, thirdPlace: teamsForThirdPlace };
  }

  static getResultsForFinalsAndThirdPlace(data) {
    const finalResults = Object.values(data).map((match) => {
      const hostTeamName = ResultService.getTeamNameByISOCode(match[0]);
      const guestTeamName = ResultService.getTeamNameByISOCode(match[1]);

      const results = ResultService.resultMatchHandler(
        ResultService.getTeamStatsByTeamName(hostTeamName),
        ResultService.getTeamStatsByTeamName(guestTeamName)
      );

      return results;
    });

    return finalResults;
  }

  static showTeamsWithMedals(finalAndThirdPlaceResults) {
    const winnersFromFinalAndThirdPlace =
      ResultService.eliminationStageResultHandler(finalAndThirdPlaceResults);

    const loserTeamInFinals = ResultService.eliminationStageResultHandler(
      finalAndThirdPlaceResults,
      "lose"
    )[0];

    return {
      gold: winnersFromFinalAndThirdPlace[0],
      silver: loserTeamInFinals,
      bronze: winnersFromFinalAndThirdPlace[1],
    };
  }
};
