const Pool = require("../model/pool");
const GroupService = require("./group");
const ResultService = require("./results");

module.exports = class PoolService {
  constructor() {}

  static createPool(name, teams) {
    return new Pool(name, teams);
  }

  static checkIfTeamsPlayedInGroupStage(firstTeam, secondTeam) {
    const pairs = GroupService.getAllMatches();

    const wasPairedInGroupStage = pairs.filter((group) => {
      return (
        group.flat().includes(firstTeam) && group.flat().includes(secondTeam)
      );
    });

    return wasPairedInGroupStage.length !== 0 ? true : false;
  }

  static randomPoolPairPicker(firstPool, secondPool) {
    const max = 2;
    const randomNumFirst = Math.floor(Math.random() * max);
    const firstTeamFromFirstPool = firstPool[randomNumFirst];
    const remainedTeamFromFirstPool =
      randomNumFirst === 0 ? firstPool[1] : firstPool[0];

    const randomNumSecond = Math.floor(Math.random() * max);
    const firstTeamFromSecondPool = secondPool[randomNumSecond];
    const remainedTeamFromSecondPool =
      randomNumSecond === 0 ? secondPool[1] : secondPool[0];

    const firstMatchWasPairedInGroups = this.checkIfTeamsPlayedInGroupStage(
      ResultService.getTeamNameByISOCode(firstTeamFromFirstPool),
      ResultService.getTeamNameByISOCode(firstTeamFromSecondPool)
    );

    const secondMatchWasPairedInGroups = this.checkIfTeamsPlayedInGroupStage(
      ResultService.getTeamNameByISOCode(remainedTeamFromFirstPool),
      ResultService.getTeamNameByISOCode(remainedTeamFromSecondPool)
    );

    if (firstMatchWasPairedInGroups || secondMatchWasPairedInGroups) {
      return this.randomPoolPairPicker(firstPool, secondPool);
    }

    return {
      firstPair: [firstTeamFromFirstPool, firstTeamFromSecondPool],
      secondPair: [remainedTeamFromFirstPool, remainedTeamFromSecondPool],
    };
  }

  static getQuarterfinalPairs(poolD, poolE, poolF, poolG) {
    let firstQFPair;
    let secondQFPair;
    let thirdQFPair;
    let forthQFPair;

    //PoolD and PoolG
    const randomNumPoolDG = Math.floor(Math.random() * 2);
    const { firstPair: firstPairFromPoolDG, secondPair: secondPairFromPoolDG } =
      this.randomPoolPairPicker(poolD, poolG);

    if (randomNumPoolDG === 0) {
      firstQFPair = [...firstPairFromPoolDG];
      thirdQFPair = [...secondPairFromPoolDG];
    } else {
      firstQFPair = [...secondPairFromPoolDG];
      thirdQFPair = [...firstPairFromPoolDG];
    }

    //PoolE and PoolF
    const randomNumPoolEF = Math.floor(Math.random() * 2);
    const { firstPair: firstPairFromPoolEF, secondPair: secondPairFromPoolEF } =
      this.randomPoolPairPicker(poolE, poolF);

    if (randomNumPoolEF === 0) {
      secondQFPair = [...firstPairFromPoolEF];
      forthQFPair = [...secondPairFromPoolEF];
    } else {
      secondQFPair = [...secondPairFromPoolEF];
      forthQFPair = [...firstPairFromPoolEF];
    }

    return { firstQFPair, secondQFPair, thirdQFPair, forthQFPair };
  }
};
