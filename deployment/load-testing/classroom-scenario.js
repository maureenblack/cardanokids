import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { SharedArray } from 'k6/data';
import { randomItem, randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// Load test users from JSON file
const users = new SharedArray('users', function() {
  return JSON.parse(open('./test-users.json'));
});

// Age groups for content filtering
const ageGroups = ['young', 'middle', 'older'];

// Configuration for classroom-scale load testing
export const options = {
  stages: [
    // Warm-up: Simulate a few users logging in (teachers preparing)
    { duration: '30s', target: 5 },
    
    // Classroom login surge: Simulate 30 students logging in at once
    { duration: '1m', target: 30 },
    
    // Steady classroom usage: 30 students using the platform
    { duration: '5m', target: 30 },
    
    // Multiple classrooms: Scale up to 3 classrooms (90 students)
    { duration: '1m', target: 90 },
    
    // Sustained multiple classroom usage
    { duration: '5m', target: 90 },
    
    // School-wide event: Peak load of 10 classrooms (300 students)
    { duration: '2m', target: 300 },
    
    // Sustained peak load
    { duration: '3m', target: 300 },
    
    // Gradual ramp down as classes end
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
    'group_duration{group:::login}': ['p(95)<1000'], // Login should be fast
    'group_duration{group:::content_access}': ['p(95)<800'], // Content access should be responsive
    'group_duration{group:::blockchain_interaction}': ['p(95)<3000'], // Blockchain interactions can be slower
  },
};

// Main test function
export default function() {
  // Select a random user
  const user = randomItem(users);
  const ageGroup = randomItem(ageGroups);
  
  // Simulate login process
  group('login', function() {
    const loginRes = http.post('https://api.cardanokids.example.com/auth/login', JSON.stringify({
      username: user.username,
      password: user.password,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    check(loginRes, {
      'login successful': (r) => r.status === 200,
      'token received': (r) => r.json('token') !== undefined,
    });
    
    // Store token for subsequent requests
    if (loginRes.status === 200) {
      user.token = loginRes.json('token');
    } else {
      console.error(`Login failed for user ${user.username}`);
      return;
    }
  });
  
  // If login failed, skip the rest
  if (!user.token) return;
  
  // Set up common headers with auth token
  const headers = {
    'Authorization': `Bearer ${user.token}`,
    'Content-Type': 'application/json',
  };
  
  // Simulate browsing courses and modules
  group('browse_curriculum', function() {
    // Get courses for the user's age group
    const coursesRes = http.get(`https://api.cardanokids.example.com/courses?ageGroup=${ageGroup}`, { headers });
    
    check(coursesRes, {
      'courses retrieved': (r) => r.status === 200,
      'courses not empty': (r) => r.json('data') && r.json('data').length > 0,
    });
    
    if (coursesRes.status === 200 && coursesRes.json('data') && coursesRes.json('data').length > 0) {
      // Select a random course
      const courses = coursesRes.json('data');
      const course = randomItem(courses);
      
      // Get modules for the selected course
      const modulesRes = http.get(`https://api.cardanokids.example.com/courses/${course.id}/modules`, { headers });
      
      check(modulesRes, {
        'modules retrieved': (r) => r.status === 200,
        'modules not empty': (r) => r.json('data') && r.json('data').length > 0,
      });
    }
  });
  
  // Simulate accessing educational content
  group('content_access', function() {
    // Get available content for the user
    const contentRes = http.get(`https://api.cardanokids.example.com/content?ageGroup=${ageGroup}&limit=10`, { headers });
    
    check(contentRes, {
      'content retrieved': (r) => r.status === 200,
      'content not empty': (r) => r.json('data') && r.json('data').length > 0,
    });
    
    if (contentRes.status === 200 && contentRes.json('data') && contentRes.json('data').length > 0) {
      // Select a random content item
      const contentItems = contentRes.json('data');
      const content = randomItem(contentItems);
      
      // View the content details
      const contentDetailRes = http.get(`https://api.cardanokids.example.com/content/${content.id}`, { headers });
      
      check(contentDetailRes, {
        'content detail retrieved': (r) => r.status === 200,
      });
      
      // Record a content view
      http.post(`https://api.cardanokids.example.com/content/${content.id}/view`, JSON.stringify({
        viewDuration: randomIntBetween(30, 300), // 30s to 5min
        deviceType: randomItem(['desktop', 'tablet', 'mobile']),
      }), { headers });
      
      // Update progress (50% of the time)
      if (Math.random() > 0.5) {
        const progress = randomIntBetween(10, 100);
        const completed = progress === 100;
        
        http.post(`https://api.cardanokids.example.com/content/${content.id}/progress`, JSON.stringify({
          progress: progress,
          completed: completed,
        }), { headers });
      }
      
      // Submit quiz answers (if content is a quiz and 30% of the time)
      if (content.contentType === 'quiz' && Math.random() > 0.7) {
        http.post(`https://api.cardanokids.example.com/content/${content.id}/quiz-submit`, JSON.stringify({
          answers: [
            { questionId: 'q1', answer: 'option_a', timeSpent: randomIntBetween(5, 60) },
            { questionId: 'q2', answer: 'option_c', timeSpent: randomIntBetween(5, 60) },
            { questionId: 'q3', answer: 'option_b', timeSpent: randomIntBetween(5, 60) },
          ],
          totalTimeSpent: randomIntBetween(60, 300),
        }), { headers });
      }
    }
  });
  
  // Simulate blockchain interactions (less frequent)
  if (Math.random() > 0.9) {
    group('blockchain_interaction', function() {
      // Check wallet connection status
      const walletStatusRes = http.get('https://api.cardanokids.example.com/wallet/status', { headers });
      
      check(walletStatusRes, {
        'wallet status retrieved': (r) => r.status === 200,
      });
      
      // Check for available achievements
      const achievementsRes = http.get('https://api.cardanokids.example.com/achievements/available', { headers });
      
      check(achievementsRes, {
        'achievements retrieved': (r) => r.status === 200,
      });
      
      // Claim an achievement (10% of the time when checking blockchain)
      if (Math.random() > 0.9 && achievementsRes.status === 200 && 
          achievementsRes.json('data') && achievementsRes.json('data').length > 0) {
        
        const achievements = achievementsRes.json('data');
        const achievement = randomItem(achievements);
        
        http.post(`https://api.cardanokids.example.com/achievements/${achievement.id}/claim`, {}, { headers });
      }
    });
  }
  
  // Simulate user thinking/reading time (varies by age group)
  let thinkingTime;
  switch(ageGroup) {
    case 'young':
      thinkingTime = randomIntBetween(3, 10); // Shorter attention span
      break;
    case 'middle':
      thinkingTime = randomIntBetween(5, 15); // Medium attention span
      break;
    case 'older':
      thinkingTime = randomIntBetween(8, 20); // Longer attention span
      break;
    default:
      thinkingTime = randomIntBetween(5, 15);
  }
  
  sleep(thinkingTime);
}
