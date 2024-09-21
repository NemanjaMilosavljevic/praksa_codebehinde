module.exports = class GroupStageRulesService {
  constructor() {}

  static getPoints(wins, loses) {
    return 2 * wins + 1 * loses;
  }

  static basketsCircleCounter(groupMatchResults, teamName, teamsInCircle) {
    let totalGivenBaskets = 0;
    let totalRecievedBaskets = 0;

    const filterData = groupMatchResults.filter((data) => {
      return (
        teamsInCircle.includes(Object.values(data)[0].team) &&
        teamsInCircle.includes(Object.values(data)[1].team)
      );
    });

    filterData.map((data) => {
      Object.values(data).map((teamStats) => {
        if (teamStats.team === teamName) {
          totalGivenBaskets += teamStats.baskets;
          totalRecievedBaskets += teamStats.basketsRecieved;
        }
      });
    });

    return { totalGivenBaskets, totalRecievedBaskets };
  }

  static calculateStatsInCircle(groupMatchResults, teamsInCircle) {
    const stats = teamsInCircle.map((team) => {
      const { totalGivenBaskets, totalRecievedBaskets } =
        this.basketsCircleCounter(groupMatchResults, team, teamsInCircle);

      return {
        team,
        totalGivenBaskets,
        totalRecievedBaskets,
        basketsDiff: totalGivenBaskets - totalRecievedBaskets,
      };
    });

    return stats;
  }

  static createCircleForRanking(teamsInCircle, groupMatchResults) {
    const circleStats = this.calculateStatsInCircle(
      groupMatchResults,
      teamsInCircle
    );

    return circleStats.sort((a, b) => {
      if (a.basketsDiff < b.basketsDiff) {
        return 1;
      }
      if (a.basketsDiff > b.basketsDiff) {
        return -1;
      }

      return 0;
    });
  }

  static compareRankWheneTwoTeamsHaveSamePoints(
    teamsInCircle,
    groupMatchResults
  ) {
    const filterData = groupMatchResults.filter((data) => {
      return (
        teamsInCircle.includes(Object.values(data)[0].team) &&
        teamsInCircle.includes(Object.values(data)[1].team)
      );
    });

    const guestStatus = filterData[0].guest.status;

    if (guestStatus === "WIN") {
      return [teams[1], teams[0]];
    }
    return teams;
  }

  static rankTeamsByGroup(groupTeamStats, groupMatchResults) {
    let teamsInCircle = [];

    groupTeamStats.sort((a, b) => {
      if (a.points < b.points) {
        return 1;
      }
      if (a.points > b.points) {
        return -1;
      }

      if (teamsInCircle.length === 0) {
        teamsInCircle.push(a.team);
        teamsInCircle.push(b.team);
      } else {
        !teamsInCircle.includes(a.team) && teamsInCircle.push(a.team);
        !teamsInCircle.includes(b.team) && teamsInCircle.push(b.team);
      }

      return 0;
    });

    let sortedGroup = [];

    if (teamsInCircle.length === 2) {
      const mutualTeamsRanking = this.compareRankWheneTwoTeamsHaveSamePoints(
        teamsInCircle,
        groupMatchResults
      );

      sortedGroup[0] = groupTeamStats.filter(
        (teamData) => teamData.team === mutualTeamsRanking[0]
      );
      sortedGroup[1] = groupTeamStats.filter(
        (teamData) => teamData.team === mutualTeamsRanking[1]
      );
      sortedGroup[2] = groupTeamStats[2];
      sortedGroup[3] = groupTeamStats[3];
    }
    if (teamsInCircle.length === 3) {
      const teamRankingAfterCircle = this.createCircleForRanking(
        teamsInCircle,
        groupMatchResults
      );

      sortedGroup[0] = groupTeamStats.filter(
        (teamData) => teamData.team === teamRankingAfterCircle[0].team
      );
      sortedGroup[1] = groupTeamStats.filter(
        (teamData) => teamData.team === teamRankingAfterCircle[1].team
      );
      sortedGroup[2] = groupTeamStats.filter(
        (teamData) => teamData.team === teamRankingAfterCircle[2].team
      );
      sortedGroup[3] = groupTeamStats[3];
    }

    return sortedGroup.length === 0 ? groupTeamStats : sortedGroup.flat();
  }
};
