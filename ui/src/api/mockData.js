export const fetchKanbanData = () => {
  // Simulating an API call with a Promise
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        lanes: [
          {
            id: 'sprint1',
            title: 'Sprint 1',
            cards: [
              {
                id: '1',
                title: 'User Authentication',
                description: 'Implement OAuth2 authentication flow',
                link: 'https://example.com/task/1',
                storyPoints: 5
              },
              {
                id: '2',
                title: 'Dashboard Layout',
                description: 'Create responsive dashboard layout with sidebar',
                link: 'https://example.com/task/2',
                storyPoints: 3
              }
            ]
          },
          {
            id: 'sprint2',
            title: 'Sprint 2',
            cards: [
              {
                id: '3',
                title: 'API Integration',
                description: 'Connect frontend with backend REST APIs',
                link: 'https://example.com/task/3',
                storyPoints: 8
              },
              {
                id: '4',
                title: 'Data Visualization',
                description: 'Implement charts and graphs for analytics',
                link: 'https://example.com/task/4',
                storyPoints: 2
              }
            ]
          },
          {
            id: 'sprint3',
            title: 'Sprint 3',
            cards: [
              {
                id: '5',
                title: 'Performance Optimization',
                description: 'Optimize application loading and rendering',
                link: 'https://example.com/task/5',
                storyPoints: 1
              }
            ]
          }
        ]
      });
    }, 1000); // Simulate network delay
  });
};