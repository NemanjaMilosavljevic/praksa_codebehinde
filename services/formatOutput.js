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

    const groupStageRound = {
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

    const output = Object.values(groupStageRound).map((round, idx) => {
      const heading = idx === 0 ? "I KOLO" : idx === 1 ? "II KOLO" : "III KOLO";

      return `
      ${heading}

          Grupa A:
               ${round[0]}
               ${round[1]}

          Grupa B:
               ${round[2]}
               ${round[3]}

          Grupa C:
               ${round[4]}
               ${round[5]}
      `;
    });

    return output;
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
    const pools = [
      formattedPoolD,
      formattedPoolE,
      formattedPoolF,
      formattedPoolG,
    ];

    const output = pools.map((pool, index) => {
      const pollName =
        index === 0
          ? "ŠEŠIR D"
          : index === 1
          ? "ŠEŠIR E"
          : index === 2
          ? "ŠEŠIR F"
          : "ŠEŠIR G";

      return `  ${pollName}
                      ${pool[0]}
                      ${pool[1]}
      `;
    });

    return output;
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

    const quarterfinalOutput = quarterfinal.map((match, index) => {
      return `${match.host} - ${match.guest} (${match.hostResult} : ${match.guestResult})`;
    });

    const semifinalOutput = semifinal.map((match, index) => {
      return `${match.host} - ${match.guest} (${match.hostResult} : ${match.guestResult})`;
    });

    const medalMatchesOutput = medalMatches.map((match, index) => {
      return `${match.host} - ${match.guest} (${match.hostResult} : ${match.guestResult})`;
    });

    return { quarterfinalOutput, semifinalOutput, medalMatchesOutput };
  }

  static formatMedalTeams(data) {
    return Object.values(data).map((team) =>
      ResultService.getTeamNameByISOCode(team)
    );
  }

  static formatRankingGruops(ranking) {
    let groupARanking = [];
    let groupBRanking = [];
    let groupCRanking = [];
    Object.values(ranking).map((group, idx) => {
      group.map((team) => {
        const dataRow = [
          team.team,
          team.wins,
          team.loses,
          team.points,
          team.totalGivenBaskets,
          team.totalRecievedBaskets,
          team.basketsDiff,
        ];

        idx === 0
          ? groupARanking.push(dataRow)
          : idx === 1
          ? groupBRanking.push(dataRow)
          : groupCRanking.push(dataRow);
      });
    });

    return { groupARanking, groupBRanking, groupCRanking };
  }

  static displayTournament(
    groupA,
    groupB,
    groupC,
    ranking,
    poolD,
    poolE,
    poolF,
    poolG,
    QFResults,
    SFResults,
    medalMatchesResults,
    medals
  ) {
    const groupStage = this.formatGroupStageData(groupA, groupB, groupC);

    const rankingOutput = this.formatRankingGruops(ranking);
    const { groupARanking, groupBRanking, groupCRanking } = rankingOutput;

    const pools = this.formatPool(poolD, poolE, poolF, poolG);

    const mainStage = this.formatMainStageData(
      QFResults,
      SFResults,
      medalMatchesResults
    );

    const medalsOutput = this.formatMedalTeams(medals);

    return `
      ${groupStage}

      KONAČAN PLASMAN U GRUPAMA

        Grupa A

          Poz  Tim  Pob  Por  Bod   Dati koš  Prm koš  Koš Raz
           1.  ${groupARanking[0][0]}   ${groupARanking[0][1]}    ${groupARanking[0][2]}    ${groupARanking[0][3]}       ${groupARanking[0][4]}     ${groupARanking[0][5]}      ${groupARanking[0][6]}  
           2.  ${groupARanking[1][0]}   ${groupARanking[1][1]}    ${groupARanking[1][2]}    ${groupARanking[1][3]}       ${groupARanking[1][4]}     ${groupARanking[1][5]}      ${groupARanking[1][6]}  
           3.  ${groupARanking[2][0]}   ${groupARanking[2][1]}    ${groupARanking[2][2]}    ${groupARanking[2][3]}       ${groupARanking[2][4]}     ${groupARanking[2][5]}      ${groupARanking[2][6]}  
           4.  ${groupARanking[3][0]}   ${groupARanking[3][1]}    ${groupARanking[3][2]}    ${groupARanking[3][3]}       ${groupARanking[3][4]}     ${groupARanking[3][5]}      ${groupARanking[3][6]}

        Grupa B

          Poz  Tim  Pob  Por  Bod   Dati koš  Prm koš  Koš Raz
           1.  ${groupBRanking[0][0]}   ${groupBRanking[0][1]}    ${groupBRanking[0][2]}    ${groupBRanking[0][3]}       ${groupBRanking[0][4]}     ${groupBRanking[0][5]}      ${groupBRanking[0][6]}  
           2.  ${groupBRanking[1][0]}   ${groupBRanking[1][1]}    ${groupBRanking[1][2]}    ${groupBRanking[1][3]}       ${groupBRanking[1][4]}     ${groupBRanking[1][5]}      ${groupBRanking[1][6]}  
           3.  ${groupBRanking[2][0]}   ${groupBRanking[2][1]}    ${groupBRanking[2][2]}    ${groupBRanking[2][3]}       ${groupBRanking[2][4]}     ${groupBRanking[2][5]}      ${groupBRanking[2][6]}  
           4.  ${groupBRanking[3][0]}   ${groupBRanking[3][1]}    ${groupBRanking[3][2]}    ${groupBRanking[3][3]}       ${groupBRanking[3][4]}     ${groupBRanking[3][5]}      ${groupBRanking[3][6]}

        Grupa C

          Poz  Tim  Pob  Por  Bod   Dati koš  Prm koš  Koš Raz
           1.  ${groupCRanking[0][0]}   ${groupCRanking[0][1]}    ${groupCRanking[0][2]}    ${groupCRanking[0][3]}       ${groupCRanking[0][4]}     ${groupCRanking[0][5]}      ${groupCRanking[0][6]}  
           2.  ${groupCRanking[1][0]}   ${groupCRanking[1][1]}    ${groupCRanking[1][2]}    ${groupCRanking[1][3]}       ${groupCRanking[1][4]}     ${groupCRanking[1][5]}      ${groupCRanking[1][6]}  
           3.  ${groupCRanking[2][0]}   ${groupCRanking[2][1]}    ${groupCRanking[2][2]}    ${groupCRanking[2][3]}       ${groupCRanking[2][4]}     ${groupCRanking[2][5]}      ${groupCRanking[2][6]}  
           4.  ${groupCRanking[3][0]}   ${groupCRanking[3][1]}    ${groupCRanking[3][2]}    ${groupCRanking[3][3]}       ${groupCRanking[3][4]}     ${groupCRanking[3][5]}      ${groupCRanking[3][6]}
 

      

      ŠEŠIRI:

        ${pools}

      ELIMINACIONA FAZA
      
        Četvrtfinalni parovi:

          ${mainStage.quarterfinalOutput[0]}
          ${mainStage.quarterfinalOutput[1]}

          ${mainStage.quarterfinalOutput[2]}
          ${mainStage.quarterfinalOutput[3]}

        Polufinalni parovi:

          ${mainStage.semifinalOutput[0]}

          ${mainStage.semifinalOutput[1]}

        Za treće mesto:

          ${mainStage.medalMatchesOutput[1]}

        Finale:

          ${mainStage.medalMatchesOutput[0]}

        MEDALJE

            1. ${medalsOutput[0]}
            2. ${medalsOutput[1]}
            3. ${medalsOutput[2]}
          
    `;
  }
};
