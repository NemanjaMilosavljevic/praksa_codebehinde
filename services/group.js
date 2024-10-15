const Group = require("../model/group");

module.exports = class GroupService {
  static allPairs = [];
  constructor() {}

  static getAllMatches() {
    return this.allPairs;
  }

  static setAllMatches(data) {
    this.allPairs.push(data);
  }

  static createGroup(name, teams) {
    return new Group(name, teams);
  }

  static getPairs(teams) {
    let pairs = [];

    teams.map((team, index) => {
      const pairsPerIteration = teams.length - 1 - index;
      let tempPairs = [];

      switch (pairsPerIteration) {
        case 3:
          tempPairs = [
            [team, teams[index + 1]],
            [team, teams[index + 2]],
            [team, teams[index + 3]],
          ];
          break;
        case 2:
          tempPairs = [
            [team, teams[index + 1]],
            [team, teams[index + 2]],
          ];
          break;
        case 1:
          tempPairs = [[team, teams[index + 1]]];
          break;

        default:
          break;
      }

      pairs.push(tempPairs);
    });

    const flatPairs = pairs.flat();
    this.setAllMatches(flatPairs);

    return [
      flatPairs[0],
      flatPairs[5],
      flatPairs[1],
      flatPairs[4],
      flatPairs[2],
      flatPairs[3],
    ];
  }
};
