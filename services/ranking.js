module.exports = class RankingService {
  constructor() {}

  static rankTeamsAfterGroupStage(data) {
    let firstTempGroup = [];
    let secondTempGroup = [];
    let thirdTempGroup = [];

    Object.values(data).map((team) => {
      firstTempGroup.push(team[0]);
      secondTempGroup.push(team[1]);
      thirdTempGroup.push(team[2]);
    });

    const allTeamsRanking = [
      ...firstTempGroup,
      ...secondTempGroup,
      ...thirdTempGroup,
    ];

    allTeamsRanking.sort((a, b) => {
      if (a.points < b.points) {
        return 1;
      }
      if (a.points > b.points) {
        return -1;
      }

      if (a.basketsDiff < b.basketsDiff) {
        return 1;
      }
      if (a.basketsDiff > b.basketsDiff) {
        return -1;
      }

      if (a.totalGivenBaskets < b.totalGivenBaskets) {
        return 1;
      }
      if (a.totalGivenBaskets > b.totalGivenBaskets) {
        return -1;
      }

      return 0;
    });

    return allTeamsRanking;
  }
};
