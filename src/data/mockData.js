import { subDays, subHours } from 'date-fns';

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  TRAINEE: 'Trainee',
  VIEWER: 'Viewer',
};

export const MOCK_USERS = [
  { id: '1', name: 'Alice Super', role: ROLES.SUPER_ADMIN, email: 'alice@example.com', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Bob Admin', role: ROLES.ADMIN, email: 'bob@example.com', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Charlie Manager', role: ROLES.MANAGER, email: 'charlie@example.com', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Dave Trainee', role: ROLES.TRAINEE, email: 'dave@example.com', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'Eve Viewer', role: ROLES.VIEWER, email: 'eve@example.com', avatar: 'https://i.pravatar.cc/150?u=5' },
];

export const MOCK_PROJECTS = [
  { id: 'p1', name: 'Website Redesign', status: 'Active', progress: 75, members: ['1', '3', '4'] },
  { id: 'p2', name: 'Mobile App Launch', status: 'Planning', progress: 20, members: ['2', '3'] },
  { id: 'p3', name: 'Q3 Marketing', status: 'Completed', progress: 100, members: ['1', '5'] },
];

export const MOCK_TASKS = {
  backlog: [
    { id: 't1', title: 'Research Competitors', projectId: 'p1', assignee: '4' },
    { id: 't2', title: 'Draft Copy', projectId: 'p1', assignee: '3' },
  ],
  todo: [
    { id: 't3', title: 'Setup Repo', projectId: 'p2', assignee: '2' },
  ],
  inProgress: [
    { id: 't4', title: 'Design Mockups', projectId: 'p1', assignee: '4' },
  ],
  review: [
    { id: 't5', title: 'Wireframe Approval', projectId: 'p1', assignee: '3' },
  ],
  done: [
    { id: 't6', title: 'Kickoff Meeting', projectId: 'p1', assignee: '1' },
  ]
};

export const MOCK_SUBMISSIONS = [
  { id: 's1', taskId: 't4', traineeId: '4', content: 'Here are the initial mockups.', status: 'Pending', date: subHours(new Date(), 2) },
  { id: 's2', taskId: 't5', traineeId: '4', content: 'Wireframes ready for review.', status: 'Approved', date: subDays(new Date(), 1) },
];

export const MOCK_MESSAGES = [
  { id: 'm1', senderId: '3', text: 'Hey Dave, how are the mockups coming along?', timestamp: subHours(new Date(), 3) },
  { id: 'm2', senderId: '4', text: 'Almost done, will submit in an hour.', timestamp: subHours(new Date(), 2.5) },
];

export const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'New Submission', message: 'Dave submitted Design Mockups', isRead: false, date: subHours(new Date(), 2) },
  { id: 'n2', title: 'Project Update', message: 'Website Redesign is now 75% complete', isRead: true, date: subDays(new Date(), 1) },
];

export const MOCK_PERFORMANCE_DATA = [
  { name: 'Mon', tasks: 4 },
  { name: 'Tue', tasks: 3 },
  { name: 'Wed', tasks: 6 },
  { name: 'Thu', tasks: 8 },
  { name: 'Fri', tasks: 5 },
  { name: 'Sat', tasks: 1 },
  { name: 'Sun', tasks: 0 },
];
