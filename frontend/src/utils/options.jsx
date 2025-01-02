const promptRanks = [
    { rank: "Beginner", minPrompts: 0, maxPrompts: 9 },
    { rank: "Explorer", minPrompts: 10, maxPrompts: 49 },
    { rank: "Creator", minPrompts: 50, maxPrompts: 99 },
    { rank: "Expert", minPrompts: 100, maxPrompts: 199 },
    { rank: "Master", minPrompts: 200, maxPrompts: Infinity }
  ];
  
  // Function to get rank based on number of prompts
  function getPromptRank(promptCount) {
    const rank= promptRanks.find(
      rank => promptCount >= rank.minPrompts && promptCount <= rank.maxPrompts
    );
        return rank.rank;   

  }
  export default getPromptRank;