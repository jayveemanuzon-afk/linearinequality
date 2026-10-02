export type GameMode = 'MENU' | 'LEVEL_1_LEARN' | 'LEVEL_2_ARCHERY';

export interface ExitTicket {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  hint: string;
}

export type InequalityOperator = '<' | '<=' | '>' | '>=' | '≤' | '≥';

export interface LessonSlide {
  id: number;
  title: string;
  subtitle: string;
  definition: {
    term: string;
    meaning: string;
    keyTakeaway: string;
  };
  theory: string[];
  workedExample: {
    problem: string;
    steps: {
      action: string;
      result: string;
      reason: string;
    }[];
    finalSolution: string;
    graphNote: string;
  };
  interactivePractice: {
    prompt: string;
    inequality: string;
    boundary: number;
    operator: InequalityOperator;
    testPoints: number[];
  };
  exitTicket: ExitTicket;
}

export interface SimplificationStep {
  label: string;
  operationType: 'add' | 'subtract' | 'multiply' | 'divide';
  operand: number;
  flipsSign?: boolean;
  leftResult: string;
  rightResult: string;
  newOperator: InequalityOperator;
  isCorrect: boolean;
  explanation: string;
}

export interface InequalityChallenge {
  id: number;
  initialInequality: string;
  storyContext: string;
  steps: {
    stage: number;
    currentDisplay: string;
    availableOperations: SimplificationStep[];
  }[];
  finalSolution: {
    variable: string;
    operator: InequalityOperator;
    boundary: number;
    formatted: string;
  };
  targetCoordinates: number[]; // Numbers appearing on targets
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'bow' | 'quiver' | 'sight' | 'arrow' | 'cloak';
  cost: number;
  description: string;
  perk: string;
  purchased: boolean;
  equipped: boolean;
  icon: string;
}

export interface PlayerStats {
  gold: number;
  level1Completed: boolean;
  currentSlide: number;
  level2Score: number;
  arrowsFired: number;
  bullseyes: number;
  streak: number;
  highestStreak: number;
  equippedBow: string;
  equippedQuiver: string;
  hasTrajectoryGuide: boolean;
  hasTargetGlow: boolean;
  goldMultiplier: number;
}
