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
    let rounds = teams.length - 1;
    let pairs = [];

    for (let i = 1; i <= rounds; i++) {
      let tempPair;

      for (let j = i; j <= rounds; j++) {
        tempPair = [teams[i - 1], teams[j]];

        pairs.push(tempPair);
      }
    }

    this.setAllMatches(pairs);

    return [pairs[0], pairs[5], pairs[1], pairs[4], pairs[2], pairs[3]];
  }
};
