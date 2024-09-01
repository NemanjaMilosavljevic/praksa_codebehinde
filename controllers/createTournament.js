const ResultService = require("../services/results");
const GroupStageRulesService = require("../services/groupStageRules");
const RankingService = require("../services/ranking");
const PoolService = require("../services/pool");
const EliminationPhaseService = require("../services/eliminationPhase");
const GroupService = require("../services/group");
const groups = require("../groups.json");
const TournamentStatisticService = require("../services/tournamentStatistic");
const FormatOutputService = require("../services/formatOutput");

exports.createTournament = (req, res) => {
  const allTeams = TournamentStatisticService.getParticipantsDataByPropertyName(
    groups,
    "Team"
  );

  const groupA = GroupService.createGroup("A", allTeams.slice(0, 4));
  const groupB = GroupService.createGroup("B", allTeams.slice(4, 8));
  const groupC = GroupService.createGroup("C", allTeams.slice(8));

  const pairsA = GroupService.getPairs(groupA.teams);
  const pairsB = GroupService.getPairs(groupB.teams);
  const pairsC = GroupService.getPairs(groupC.teams);

  const groupAMatchResults = ResultService.groupStageResultHandler(pairsA);
  const groupBMatchResults = ResultService.groupStageResultHandler(pairsB);
  const groupCMatchResults = ResultService.groupStageResultHandler(pairsC);

  const groupStageMatchResults = [
    ...groupAMatchResults,
    ...groupBMatchResults,
    ...groupCMatchResults,
  ];

  const teamsGroupStageStats = ResultService.calculateGroupsStats(
    groupStageMatchResults
  );

  const ranking = GroupStageRulesService.rankTeamsByGroup(
    teamsGroupStageStats,
    groupStageMatchResults
  );

  const bestNineTeams = RankingService.rankTeamsAfterGroupStage(ranking);

  const poolD = PoolService.createPool(
    "D",
    bestNineTeams.slice(0, 2).map((team) => {
      return team.team;
    })
  );
  const poolE = PoolService.createPool(
    "E",
    bestNineTeams.slice(2, 4).map((team) => {
      return team.team;
    })
  );
  const poolF = PoolService.createPool(
    "F",
    bestNineTeams.slice(4, 6).map((team) => {
      return team.team;
    })
  );
  const poolG = PoolService.createPool(
    "G",
    bestNineTeams.slice(6, 8).map((team) => {
      return team.team;
    })
  );

  const QFPairs = PoolService.getQuarterfinalPairs(
    poolD.teams,
    poolE.teams,
    poolF.teams,
    poolG.teams
  );

  const QFResults = EliminationPhaseService.getQFResults(QFPairs);
  const SFPairs = EliminationPhaseService.formSemifinalPairs(QFResults);

  const SFResults = EliminationPhaseService.getSemifinalResults(SFPairs);
  const pairsForMedals =
    EliminationPhaseService.formFinalAndMatchForThirdPlace(SFResults);

  const medalMatchesResults =
    EliminationPhaseService.getResultsForFinalsAndThirdPlace(pairsForMedals);
  const medals =
    EliminationPhaseService.showTeamsWithMedals(medalMatchesResults);

  const outputData = {
    ranking,
    rounds: FormatOutputService.formatGroupStageData(
      groupAMatchResults,
      groupBMatchResults,
      groupCMatchResults
    ),
    pools: FormatOutputService.formatPool(
      poolD.teams,
      poolE.teams,
      poolF.teams,
      poolG.teams
    ),
    mainStage: FormatOutputService.formatMainStageData(
      QFResults,
      SFResults,
      medalMatchesResults
    ),
    medals: FormatOutputService.formatMedalTeams(medals),
  };

  res.end(JSON.stringify(outputData));
};
