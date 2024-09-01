module.exports = class GroupStageRulesService {
  constructor() {}

  static getPoints(wins, loses) {
    return 2 * wins + 1 * loses;
  }

  static basketsCircleCounter(data, teamName, teamsInCircle) {
    let totalGivenBaskets = 0;
    let totalRecievedBaskets = 0;

    const filterData = data.filter((data) => {
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

  static calculateStatsInCircle(groupsResult, targetTeams) {
    const stats = targetTeams.map((team) => {
      const { totalGivenBaskets, totalRecievedBaskets } =
        this.basketsCircleCounter(groupsResult, team, targetTeams);

      return {
        team,
        totalGivenBaskets,
        totalRecievedBaskets,
        basketsDiff: totalGivenBaskets - totalRecievedBaskets,
      };
    });

    return stats;
  }

  static createCircleForRanking(teams, matchesStats) {
    const circleStats = this.calculateStatsInCircle(matchesStats, teams);

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

  static compareRankWheneTwoTeamsHaveSamePoints(teams, matchesStats) {
    const filterData = matchesStats.filter((data) => {
      return (
        teams.includes(Object.values(data)[0].team) &&
        teams.includes(Object.values(data)[1].team)
      );
    });

    const guestStatus = filterData[0].guest.status;

    if (guestStatus === "WIN") {
      return [teams[1], teams[0]];
    }
    return teams;
  }

  static rankTeamsByGroup(groupStats, matchesStats) {
    let groupATeamsData = [];
    let groupBTeamsData = [];
    let groupCTeamsData = [];

    groupStats.filter((team, index) => {
      if (index < 4) {
        groupATeamsData.push(team);
      } else if (index > 3 && index < 8) {
        groupBTeamsData.push(team);
      } else {
        groupCTeamsData.push(team);
      }
    });

    /* A */
    let circleGroupA = [];
    let circleGroupB = [];
    let circleGroupC = [];
    groupATeamsData.sort((a, b) => {
      if (a.points < b.points) {
        return 1;
      }
      if (a.points > b.points) {
        return -1;
      }

      if (circleGroupA.length === 0) {
        circleGroupA.push(a.team);
        circleGroupA.push(b.team);
      } else {
        !circleGroupA.includes(a.team) && circleGroupA.push(a.team);
        !circleGroupA.includes(b.team) && circleGroupA.push(b.team);
      }

      return 0;
    });

    let groupASortedByRanking = [];

    if (circleGroupA.length === 2) {
      const mutualTeamsARanking = this.compareRankWheneTwoTeamsHaveSamePoints(
        circleGroupA,
        matchesStats
      );

      groupASortedByRanking[0] = groupATeamsData.filter(
        (teamData) => teamData.team === mutualTeamsARanking[0]
      );
      groupASortedByRanking[1] = groupATeamsData.filter(
        (teamData) => teamData.team === mutualTeamsARanking[1]
      );
      groupASortedByRanking[2] = groupATeamsData[2];
      groupASortedByRanking[3] = groupATeamsData[3];
    }
    if (circleGroupA.length === 3) {
      const circleATeams = this.createCircleForRanking(
        circleGroupA,
        matchesStats
      );

      groupASortedByRanking[0] = groupATeamsData.filter(
        (teamData) => teamData.team === circleATeams[0].team
      );
      groupASortedByRanking[1] = groupATeamsData.filter(
        (teamData) => teamData.team === circleATeams[1].team
      );
      groupASortedByRanking[2] = groupATeamsData.filter(
        (teamData) => teamData.team === circleATeams[2].team
      );
      groupASortedByRanking[3] = groupATeamsData[3];
    }

    /* B */

    let groupBSortedByRanking = [];
    groupBTeamsData.sort((a, b) => {
      if (a.points < b.points) {
        return 1;
      }
      if (a.points > b.points) {
        return -1;
      }
      if (circleGroupB.length === 0) {
        circleGroupB.push(a.team);
        circleGroupB.push(b.team);
      } else {
        !circleGroupB.includes(a.team) && circleGroupB.push(a.team);
        !circleGroupB.includes(b.team) && circleGroupB.push(b.team);
      }

      return 0;
    });

    if (circleGroupB.length === 2) {
      const mutualTeamsBRanking = this.compareRankWheneTwoTeamsHaveSamePoints(
        circleGroupB,
        matchesStats
      );

      groupBSortedByRanking[0] = groupBTeamsData.filter(
        (teamData) => teamData.team === mutualTeamsBRanking[0]
      );
      groupBSortedByRanking[1] = groupBTeamsData.filter(
        (teamData) => teamData.team === mutualTeamsBRanking[1]
      );
      groupBSortedByRanking[2] = groupBTeamsData[2];
      groupBSortedByRanking[3] = groupBTeamsData[3];
    }
    if (circleGroupB.length === 3) {
      const circleBTeams = this.createCircleForRanking(
        circleGroupB,
        matchesStats
      );

      groupBSortedByRanking[0] = groupBTeamsData.filter(
        (teamData) => teamData.team === circleBTeams[0].team
      );
      groupBSortedByRanking[1] = groupBTeamsData.filter(
        (teamData) => teamData.team === circleBTeams[1].team
      );
      groupBSortedByRanking[2] = groupBTeamsData.filter(
        (teamData) => teamData.team === circleBTeams[2].team
      );
      groupBSortedByRanking[3] = groupBTeamsData[3];
    }

    /* C*/
    let groupCSortedByRanking = [];
    groupCTeamsData.sort((a, b) => {
      if (a.points < b.points) {
        return 1;
      }
      if (a.points > b.points) {
        return -1;
      }
      if (circleGroupC.length === 0) {
        circleGroupC.push(a.team);
        circleGroupC.push(b.team);
      } else {
        !circleGroupC.includes(a.team) && circleGroupC.push(a.team);
        !circleGroupC.includes(b.team) && circleGroupC.push(b.team);
      }
      return 0;
    });

    if (circleGroupC.length === 2) {
      const mutualTeamsCRanking = this.compareRankWheneTwoTeamsHaveSamePoints(
        circleGroupC,
        matchesStats
      );

      groupCSortedByRanking[0] = groupCTeamsData.filter(
        (teamData) => teamData.team === mutualTeamsCRanking[0]
      );
      groupCSortedByRanking[1] = groupCTeamsData.filter(
        (teamData) => teamData.team === mutualTeamsCRanking[1]
      );
      groupCSortedByRanking[2] = groupCTeamsData[2];
      groupCSortedByRanking[3] = groupCTeamsData[3];
    }
    if (circleGroupC.length === 3) {
      const circleCTeams = this.createCircleForRanking(
        circleGroupC,
        matchesStats
      );

      groupCSortedByRanking[0] = groupCTeamsData.filter(
        (teamData) => teamData.team === circleCTeams[0].team
      );
      groupCSortedByRanking[1] = groupCTeamsData.filter(
        (teamData) => teamData.team === circleCTeams[1].team
      );
      groupCSortedByRanking[2] = groupCTeamsData.filter(
        (teamData) => teamData.team === circleCTeams[2].team
      );
      groupCSortedByRanking[3] = groupCTeamsData[3];
    }

    return {
      A:
        groupASortedByRanking.length === 0
          ? groupATeamsData
          : groupASortedByRanking.flat(),
      B:
        groupBSortedByRanking.length === 0
          ? groupBTeamsData
          : groupBSortedByRanking.flat(),
      C:
        groupCSortedByRanking.length === 0
          ? groupCTeamsData
          : groupCSortedByRanking.flat(),
    };
  }
};
