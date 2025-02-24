const CHATGPT_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export const analyzeBoardData = async (lanes, capacities) => {
  try {
    const totalStoryPoints = lanes.reduce((total, lane) => 
      total + lane.cards.reduce((laneTotal, card) => laneTotal + card.storyPoints, 0), 0
    );

    const laneAnalysis = lanes.map(lane => {
      const lanePoints = lane.cards.reduce((total, card) => total + card.storyPoints, 0);
      const capacity = capacities[lane.id] || 10;
      return {
        title: lane.title,
        totalPoints: lanePoints,
        capacity,
        utilizationPercentage: (lanePoints / capacity) * 100
      };
    });

    const prompt = `
      Analyze this Kanban board data:
      Total Story Points: ${totalStoryPoints}
      
      Lane Analysis:
      ${laneAnalysis.map(lane => `
        ${lane.title}:
        - Story Points: ${lane.totalPoints}
        - Capacity: ${lane.capacity}
        - Utilization: ${lane.utilizationPercentage.toFixed(1)}%
      `).join('\n')}
      
      Please provide:
      1. Capacity utilization insights
      2. Workload distribution analysis
      3. Recommendations for optimization
      Keep the response concise and actionable.
    `;

    const response = await fetch(CHATGPT_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get analysis from ChatGPT');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing board data:', error);
    return 'Unable to generate analysis at this time.';
  }
};