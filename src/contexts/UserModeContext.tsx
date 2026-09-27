import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserMode = 'individual' | 'school' | 'business' | 'home';
export type UserRole = 'student' | 'teacher' | 'admin' | 'employee' | 'manager' | 'parent' | 'child' | 'individual';

export interface ClassRoom {
  id: string;
  name: string;
  teacherId: string;
  teacherName: string;
  students: Student[];
  assignments: Assignment[];
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  progress: StudentProgress;
  joinedAt: string;
}

export interface StudentProgress {
  lessonsCompleted: number;
  totalLessons: number;
  averageWpm: number;
  averageAccuracy: number;
  totalPracticeTime: number;
  assignmentsCompleted: number;
  lastActive: string;
  weeklyProgress: { day: string; wpm: number; accuracy: number }[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  type: 'practice' | 'test' | 'lesson' | 'book';
  targetWpm?: number;
  targetAccuracy?: number;
  duration?: number;
  dueDate: string;
  createdAt: string;
  classId: string;
  submissions: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  wpm: number;
  accuracy: number;
  completedAt: string;
  grade?: string;
  feedback?: string;
}

export interface Team {
  id: string;
  name: string;
  department: string;
  managerId: string;
  members: TeamMember[];
  challenges: TeamChallenge[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  stats: {
    averageWpm: number;
    averageAccuracy: number;
    practiceTime: number;
    rank: number;
  };
}

export interface TeamChallenge {
  id: string;
  title: string;
  description: string;
  targetWpm: number;
  deadline: string;
  participants: string[];
  leaderboard: { memberId: string; wpm: number; accuracy: number }[];
}

export interface FamilyMember {
  id: string;
  name: string;
  role: 'parent' | 'child';
  avatar: string;
  age?: number;
  progress: {
    level: number;
    xp: number;
    lessonsCompleted: number;
    averageWpm: number;
    badges: string[];
    weeklyGoal: number;
    weeklyProgress: number;
  };
}

interface UserModeContextType {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  classrooms: ClassRoom[];
  setClassrooms: React.Dispatch<React.SetStateAction<ClassRoom[]>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  familyMembers: FamilyMember[];
  setFamilyMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
  currentClassroom: ClassRoom | null;
  setCurrentClassroom: (classroom: ClassRoom | null) => void;
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

const sampleClassrooms: ClassRoom[] = [
  {
    id: '1',
    name: 'Typing 101 - Morning Class',
    teacherId: 'teacher1',
    teacherName: 'Mrs. Johnson',
    students: [
      {
        id: 's1',
        name: 'Alex Thompson',
        email: 'alex@school.edu',
        avatar: '👦',
        progress: {
          lessonsCompleted: 12,
          totalLessons: 20,
          averageWpm: 45,
          averageAccuracy: 92,
          totalPracticeTime: 1200,
          assignmentsCompleted: 8,
          lastActive: '2024-01-10',
          weeklyProgress: [
            { day: 'Mon', wpm: 42, accuracy: 90 },
            { day: 'Tue', wpm: 44, accuracy: 91 },
            { day: 'Wed', wpm: 45, accuracy: 92 },
            { day: 'Thu', wpm: 46, accuracy: 93 },
            { day: 'Fri', wpm: 48, accuracy: 94 },
          ],
        },
        joinedAt: '2024-01-01',
      },
      {
        id: 's2',
        name: 'Emma Wilson',
        email: 'emma@school.edu',
        avatar: '👧',
        progress: {
          lessonsCompleted: 15,
          totalLessons: 20,
          averageWpm: 52,
          averageAccuracy: 95,
          totalPracticeTime: 1800,
          assignmentsCompleted: 10,
          lastActive: '2024-01-10',
          weeklyProgress: [
            { day: 'Mon', wpm: 50, accuracy: 94 },
            { day: 'Tue', wpm: 51, accuracy: 94 },
            { day: 'Wed', wpm: 52, accuracy: 95 },
            { day: 'Thu', wpm: 53, accuracy: 95 },
            { day: 'Fri', wpm: 55, accuracy: 96 },
          ],
        },
        joinedAt: '2024-01-01',
      },
      {
        id: 's3',
        name: 'Michael Chen',
        email: 'michael@school.edu',
        avatar: '👦',
        progress: {
          lessonsCompleted: 8,
          totalLessons: 20,
          averageWpm: 38,
          averageAccuracy: 88,
          totalPracticeTime: 900,
          assignmentsCompleted: 5,
          lastActive: '2024-01-09',
          weeklyProgress: [
            { day: 'Mon', wpm: 35, accuracy: 85 },
            { day: 'Tue', wpm: 36, accuracy: 86 },
            { day: 'Wed', wpm: 38, accuracy: 88 },
            { day: 'Thu', wpm: 39, accuracy: 89 },
            { day: 'Fri', wpm: 40, accuracy: 90 },
          ],
        },
        joinedAt: '2024-01-02',
      },
    ],
    assignments: [
      {
        id: 'a1',
        title: 'Home Row Practice',
        description: 'Complete 10 minutes of home row key practice',
        type: 'practice',
        targetWpm: 30,
        targetAccuracy: 90,
        duration: 10,
        dueDate: '2024-01-15',
        createdAt: '2024-01-08',
        classId: '1',
        submissions: [
          { id: 'sub1', studentId: 's1', studentName: 'Alex Thompson', wpm: 45, accuracy: 92, completedAt: '2024-01-10', grade: 'A' },
          { id: 'sub2', studentId: 's2', studentName: 'Emma Wilson', wpm: 52, accuracy: 95, completedAt: '2024-01-09', grade: 'A+' },
        ],
      },
      {
        id: 'a2',
        title: 'Speed Test Challenge',
        description: 'Complete a 5-minute speed test achieving at least 40 WPM',
        type: 'test',
        targetWpm: 40,
        targetAccuracy: 85,
        duration: 5,
        dueDate: '2024-01-20',
        createdAt: '2024-01-10',
        classId: '1',
        submissions: [],
      },
    ],
    createdAt: '2024-01-01',
  },
];

const sampleTeams: Team[] = [
  {
    id: 't1',
    name: 'Data Entry Team',
    department: 'Operations',
    managerId: 'manager1',
    members: [
      {
        id: 'm1',
        name: 'John Smith',
        email: 'john@company.com',
        role: 'Senior Analyst',
        avatar: '👨‍💼',
        stats: { averageWpm: 75, averageAccuracy: 98, practiceTime: 4500, rank: 1 },
      },
      {
        id: 'm2',
        name: 'Sarah Davis',
        email: 'sarah@company.com',
        role: 'Data Entry Specialist',
        avatar: '👩‍💼',
        stats: { averageWpm: 68, averageAccuracy: 96, practiceTime: 3800, rank: 2 },
      },
      {
        id: 'm3',
        name: 'Mike Brown',
        email: 'mike@company.com',
        role: 'Junior Analyst',
        avatar: '👨‍💻',
        stats: { averageWpm: 55, averageAccuracy: 94, practiceTime: 2200, rank: 3 },
      },
    ],
    challenges: [
      {
        id: 'c1',
        title: 'Q1 Speed Challenge',
        description: 'Achieve 80 WPM average by end of quarter',
        targetWpm: 80,
        deadline: '2024-03-31',
        participants: ['m1', 'm2', 'm3'],
        leaderboard: [
          { memberId: 'm1', wpm: 78, accuracy: 98 },
          { memberId: 'm2', wpm: 72, accuracy: 96 },
          { memberId: 'm3', wpm: 58, accuracy: 94 },
        ],
      },
    ],
  },
];

const sampleFamilyMembers: FamilyMember[] = [
  {
    id: 'f1',
    name: 'Dad',
    role: 'parent',
    avatar: '👨',
    progress: {
      level: 15,
      xp: 4500,
      lessonsCompleted: 25,
      averageWpm: 65,
      badges: ['speed-demon', 'accuracy-master'],
      weeklyGoal: 60,
      weeklyProgress: 45,
    },
  },
  {
    id: 'f2',
    name: 'Mom',
    role: 'parent',
    avatar: '👩',
    progress: {
      level: 12,
      xp: 3200,
      lessonsCompleted: 18,
      averageWpm: 55,
      badges: ['consistent-typer'],
      weeklyGoal: 45,
      weeklyProgress: 40,
    },
  },
  {
    id: 'f3',
    name: 'Tommy',
    role: 'child',
    avatar: '👦',
    age: 12,
    progress: {
      level: 8,
      xp: 1800,
      lessonsCompleted: 12,
      averageWpm: 35,
      badges: ['first-lesson', 'week-streak'],
      weeklyGoal: 30,
      weeklyProgress: 25,
    },
  },
  {
    id: 'f4',
    name: 'Emily',
    role: 'child',
    avatar: '👧',
    age: 10,
    progress: {
      level: 5,
      xp: 950,
      lessonsCompleted: 8,
      averageWpm: 25,
      badges: ['first-lesson'],
      weeklyGoal: 20,
      weeklyProgress: 18,
    },
  },
];

export const UserModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<UserMode>(() => {
    const saved = localStorage.getItem('userMode');
    return (saved as UserMode) || 'individual';
  });

  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('userRole');
    return (saved as UserRole) || 'individual';
  });

  const [classrooms, setClassrooms] = useState<ClassRoom[]>(() => {
    const saved = localStorage.getItem('classrooms');
    return saved ? JSON.parse(saved) : sampleClassrooms;
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('teams');
    return saved ? JSON.parse(saved) : sampleTeams;
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem('familyMembers');
    return saved ? JSON.parse(saved) : sampleFamilyMembers;
  });

  const [currentClassroom, setCurrentClassroom] = useState<ClassRoom | null>(null);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

  useEffect(() => {
    localStorage.setItem('userMode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('userRole', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('classrooms', JSON.stringify(classrooms));
  }, [classrooms]);

  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
  }, [familyMembers]);

  return (
    <UserModeContext.Provider
      value={{
        mode,
        setMode,
        role,
        setRole,
        classrooms,
        setClassrooms,
        teams,
        setTeams,
        familyMembers,
        setFamilyMembers,
        currentClassroom,
        setCurrentClassroom,
        currentTeam,
        setCurrentTeam,
      }}
    >
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => {
  const context = useContext(UserModeContext);
  if (!context) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
};
