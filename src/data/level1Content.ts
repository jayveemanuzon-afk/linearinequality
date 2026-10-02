import { LessonSlide } from '../types';

export const LEVEL_1_SLIDES: LessonSlide[] = [
  {
    id: 1,
    title: 'The Sherwood Code: What is a Linear Inequality?',
    subtitle: 'Understanding ranges, intervals, and inequality symbols',
    definition: {
      term: 'Linear Inequality in One Variable',
      meaning:
        'A mathematical statement comparing two linear expressions using inequality symbols (<, ≤, >, ≥, or ≠) with exactly one variable with degree 1 (highest exponent is 1).',
      keyTakeaway:
        'Unlike equations with one single exact answer, inequalities have an entire infinite range of numbers that make the statement true!',
    },
    theory: [
      'An equation (like x = 5) is like striking the exact center pin. Only one value works.',
      'An inequality (like x > 5) is like an archery zone. Any shot landing beyond 5 paces hits the target: 6, 7.5, 10, 100 all work!',
      'Symbols to memorize:',
      '• < : Strictly Less Than (cannot be equal to)',
      '• ≤ : Less Than or Equal To (includes the boundary)',
      '• > : Strictly Greater Than (cannot be equal to)',
      '• ≥ : Greater Than or Equal To (includes the boundary)',
    ],
    workedExample: {
      problem: 'Determine if x = 4 and x = 2 satisfy: x + 1 > 3',
      steps: [
        {
          action: 'Test x = 4',
          result: '4 + 1 > 3  →  5 > 3',
          reason: '5 is indeed greater than 3, so x = 4 is a VALID solution.',
        },
        {
          action: 'Test x = 2',
          result: '2 + 1 > 3  →  3 > 3',
          reason: '3 is NOT strictly greater than 3 (it is equal), so x = 2 is NOT a solution.',
        },
      ],
      finalSolution: 'x > 2 (Any number strictly greater than 2 is a solution)',
      graphNote: 'Solutions extend infinitely to the right on a number line.',
    },
    interactivePractice: {
      prompt: 'Robin Hood tests bow tension: T > 5 pounds. Test which draw weights satisfy this requirement:',
      inequality: 'x > 5',
      boundary: 5,
      operator: '>',
      testPoints: [2, 4, 5, 6, 8, 10],
    },
    exitTicket: {
      id: 'et-1',
      question: 'Which of the following numbers is a valid solution to the inequality: y ≤ 7?',
      options: [
        {
          id: 'opt-a',
          text: 'y = 8',
          isCorrect: false,
          explanation: '8 is greater than 7, so 8 ≤ 7 is false.',
        },
        {
          id: 'opt-b',
          text: 'y = 7',
          isCorrect: true,
          explanation: 'Correct! The symbol ≤ means less than OR equal to, so 7 is included!',
        },
        {
          id: 'opt-c',
          text: 'y = 9.5',
          isCorrect: false,
          explanation: '9.5 is strictly greater than 7.',
        },
        {
          id: 'opt-d',
          text: 'y = 12',
          isCorrect: false,
          explanation: '12 is well above 7.',
        },
      ],
      hint: 'Notice the symbol has an "or equal to" bar under it (≤). Does 7 satisfy 7 ≤ 7?',
    },
  },
  {
    id: 2,
    title: 'The Archer’s Map: Number Lines & Boundary Dots',
    subtitle: 'Open circles vs. solid closed circles and shading direction',
    definition: {
      term: 'Boundary Dot & Ray Shading',
      meaning:
        'A graphical representation of all solutions on a real number line. The boundary point separates numbers that work from numbers that do not.',
      keyTakeaway:
        'Use an OPEN CIRCLE (○) for strict inequalities (<, >). Use a SOLID CLOSED DOT (●) when equality is allowed (≤, ≥).',
    },
    theory: [
      'Open Circle (○): Hollow ring indicates the boundary number itself is NOT included in the solution set.',
      'Closed Dot (●): Filled solid dot indicates the boundary number IS included as an allowable solution.',
      'Shading to the Right (→): Represents numbers greater than the boundary (x > a or x ≥ a).',
      'Shading to the Left (←): Represents numbers less than the boundary (x < a or x ≤ a).',
      'Quick Robin Hood Tip: If the variable is on the LEFT side, the inequality symbol points in the direction of the arrow on the number line! (x > 3 points right →, x < 3 points left ←).',
    ],
    workedExample: {
      problem: 'Graph the inequality: x ≥ -2 on the number line',
      steps: [
        {
          action: 'Find Boundary Point',
          result: 'Boundary is at -2',
          reason: 'This is where the transition occurs.',
        },
        {
          action: 'Determine Dot Style',
          result: 'Solid Closed Dot (●)',
          reason: 'Because the symbol is ≥ (or equal to), -2 is included in the solution.',
        },
        {
          action: 'Determine Direction',
          result: 'Shade to the RIGHT (→)',
          reason: 'Values like -1, 0, 3 are greater than -2.',
        },
      ],
      finalSolution: 'Solid dot at -2, shaded ray pointing infinitely right.',
      graphNote: 'Interval notation: [-2, ∞)',
    },
    interactivePractice: {
      prompt: 'Calibrate the target range: x < 3. Test values to see which side of the boundary 3 must be shaded:',
      inequality: 'x < 3',
      boundary: 3,
      operator: '<',
      testPoints: [-2, 0, 2, 3, 4, 6],
    },
    exitTicket: {
      id: 'et-2',
      question: 'Which inequality is represented by an OPEN CIRCLE at 4 with arrow shading pointing to the LEFT?',
      options: [
        {
          id: 'opt-a',
          text: 'x ≥ 4',
          isCorrect: false,
          explanation: '≥ would have a solid closed dot and point to the right.',
        },
        {
          id: 'opt-b',
          text: 'x > 4',
          isCorrect: false,
          explanation: '> points to the right (greater than).',
        },
        {
          id: 'opt-c',
          text: 'x < 4',
          isCorrect: true,
          explanation: 'Spot on! Open circle means strict inequality (<), and left arrow means values less than 4!',
        },
        {
          id: 'opt-d',
          text: 'x ≤ 4',
          isCorrect: false,
          explanation: '≤ would require a solid closed dot at 4.',
        },
      ],
      hint: 'Open circle means NO equal sign (< or >). Shading left means numbers smaller than 4.',
    },
  },
  {
    id: 3,
    title: 'The Golden Balance: Addition & Subtraction Properties',
    subtitle: 'Balancing both sides of an inequality without altering direction',
    definition: {
      term: 'Addition and Subtraction Property of Inequality',
      meaning:
        'If a < b, then a + c < b + c and a - c < b - c. Adding or subtracting the exact same real number to both sides of an inequality preserves the truth and NEVER changes the direction of the inequality sign.',
      keyTakeaway:
        'Just like a two-pan balance scale, adding or removing equal weight on both sides keeps the tilt identical!',
    },
    theory: [
      'Robin Hood’s Balance Principle: Whatever you give to one side, you must give equally to the other side.',
      'To isolate variable x, apply the INVERSE operation:',
      '• If a number is added (+ c), SUBTRACT it from both sides.',
      '• If a number is subtracted (- c), ADD it to both sides.',
      'The inequality symbol ALWAYS stays pointing in the exact same direction during addition and subtraction.',
    ],
    workedExample: {
      problem: 'Solve: x - 7 ≥ 5',
      steps: [
        {
          action: 'Identify inverse operation',
          result: 'We have - 7 attached to x. Add 7 to both sides.',
          reason: 'Addition is the inverse of subtraction: -7 + 7 = 0.',
        },
        {
          action: 'Apply to both sides',
          result: 'x - 7 + 7 ≥ 5 + 7',
          reason: 'Both sides must receive the exact same operation.',
        },
        {
          action: 'Simplify',
          result: 'x ≥ 12',
          reason: 'The inequality sign remains ≥.',
        },
      ],
      finalSolution: 'x ≥ 12',
      graphNote: 'Closed dot at 12, shaded to the right.',
    },
    interactivePractice: {
      prompt: 'Solve: x + 4 < 9. Subtract 4 from both sides to find the range of x:',
      inequality: 'x < 5',
      boundary: 5,
      operator: '<',
      testPoints: [1, 3, 4, 5, 7, 9],
    },
    exitTicket: {
      id: 'et-3',
      question: 'Solve for m: m + 6 > 15. What is the solution set?',
      options: [
        {
          id: 'opt-a',
          text: 'm > 9',
          isCorrect: true,
          explanation: 'Excellent! Subtracting 6 from both sides gives m > 15 - 6, so m > 9.',
        },
        {
          id: 'opt-b',
          text: 'm < 9',
          isCorrect: false,
          explanation: 'Subtracting 6 does not reverse the inequality sign!',
        },
        {
          id: 'opt-c',
          text: 'm > 21',
          isCorrect: false,
          explanation: 'You added 6 instead of subtracting 6 from both sides.',
        },
        {
          id: 'opt-d',
          text: 'm ≥ 9',
          isCorrect: false,
          explanation: 'The original sign was strictly >, it cannot gain an equal bar.',
        },
      ],
      hint: 'Undo "+ 6" by subtracting 6 from both sides: 15 - 6 = ?',
    },
  },
  {
    id: 4,
    title: 'The Great Trap: Multiplying & Dividing by Negatives (THE FLIP!)',
    subtitle: 'The single most important rule in solving linear inequalities',
    definition: {
      term: 'The Negative Multiplication / Division Reversal Rule',
      meaning:
        'When you MULTIPLY or DIVIDE both sides of an inequality by a NEGATIVE number, you MUST REVERSE (FLIP) the direction of the inequality sign! (< becomes >, and ≤ becomes ≥).',
      keyTakeaway:
        'Positive multiplier/divisor? KEEP the sign. Negative multiplier/divisor? FLIP the sign immediately!',
    },
    theory: [
      'Why does it flip? Look at a simple truth on the number line:',
      '2 < 5 (2 is smaller than 5, because it is to the left).',
      'Now multiply both sides by -1: -2 and -5.',
      'On the number line, -2 is GREATER than -5 because -2 is closer to 0! Thus: -2 > -5!',
      'Whenever signs are inverted across zero, the relative sizes flip completely!',
      'RULE OF THUMB:',
      '• 3x < 12 → divide by +3 → x < 4 (Sign stays same).',
      '• -3x < 12 → divide by -3 → x > -4 (Sign FLIPS from < to >!).',
    ],
    workedExample: {
      problem: 'Solve: -4x ≤ 20',
      steps: [
        {
          action: 'Identify operation',
          result: 'Divide both sides by -4',
          reason: 'To isolate x from -4 * x.',
        },
        {
          action: 'Apply the Negative Flip Rule',
          result: '-4x / (-4)  ≥  20 / (-4)',
          reason: 'Because we divided by a negative number (-4), the sign changes from ≤ to ≥!',
        },
        {
          action: 'Calculate final result',
          result: 'x ≥ -5',
          reason: '20 divided by -4 equals -5.',
        },
      ],
      finalSolution: 'x ≥ -5',
      graphNote: 'Closed dot at -5, arrow shaded to the right.',
    },
    interactivePractice: {
      prompt: 'Check the sign flip rule: Solve -2x > 6 by dividing both sides by -2:',
      inequality: 'x < -3',
      boundary: -3,
      operator: '<',
      testPoints: [-6, -4, -3, -2, 0, 4],
    },
    exitTicket: {
      id: 'et-4',
      question: 'Solve for k: -5k < 25. Which is the correct solution?',
      options: [
        {
          id: 'opt-a',
          text: 'k < -5',
          isCorrect: false,
          explanation: 'Dividing by -5 requires reversing the inequality symbol!',
        },
        {
          id: 'opt-b',
          text: 'k > -5',
          isCorrect: true,
          explanation: 'Bravo! Dividing by -5 inverts the sign from < to >, yielding k > -5.',
        },
        {
          id: 'opt-c',
          text: 'k > 5',
          isCorrect: false,
          explanation: '25 / (-5) is negative 5, not positive 5.',
        },
        {
          id: 'opt-d',
          text: 'k ≤ -5',
          isCorrect: false,
          explanation: 'Strict inequality (<) cannot transform into a non-strict inequality (≤).',
        },
      ],
      hint: 'Remember the Robin Hood Flip Rule: dividing by -5 inverts the inequality symbol!',
    },
  },
  {
    id: 5,
    title: 'The Master Archer: Multi-Step Linear Inequalities',
    subtitle: 'Combining like terms, distributing, and isolating the variable',
    definition: {
      term: 'Multi-Step Linear Inequality Strategy',
      meaning:
        'A sequence of algebraic steps to isolate the variable: 1) Distribute parentheses, 2) Combine like terms, 3) Move variable terms to one side, 4) Move constant terms to the opposite side, 5) Divide/multiply by the coefficient (remembering to flip if negative).',
      keyTakeaway:
        'Follow standard PEMDAS in reverse to peel away layers from the variable, just like stringing and aiming a longbow.',
    },
    theory: [
      'Robin Hood’s 4-Step Battle Routine:',
      '1. Clear brackets (use distributive property: a(b + c) = ab + ac).',
      '2. Collect variables on the left side (subtract smaller variable term).',
      '3. Undo addition or subtraction first to isolate the variable term.',
      '4. Undo multiplication or division last. (Check if coefficient was negative!).',
      '5. Graph on number line and test a number in the original problem to verify!',
    ],
    workedExample: {
      problem: 'Solve: 3x - 5 ≥ x + 7',
      steps: [
        {
          action: 'Subtract x from both sides',
          result: '3x - x - 5 ≥ 7  →  2x - 5 ≥ 7',
          reason: 'Gathers all variable terms onto the left side.',
        },
        {
          action: 'Add 5 to both sides',
          result: '2x ≥ 7 + 5  →  2x ≥ 12',
          reason: 'Inverse of -5 is +5.',
        },
        {
          action: 'Divide by +2',
          result: 'x ≥ 6',
          reason: '2 is positive, so the inequality sign stays ≥.',
        },
      ],
      finalSolution: 'x ≥ 6',
      graphNote: 'Closed dot at 6, arrow points right towards infinity.',
    },
    interactivePractice: {
      prompt: 'Solve: 2x + 1 > 7. Subtract 1, then divide by 2 to find x:',
      inequality: 'x > 3',
      boundary: 3,
      operator: '>',
      testPoints: [1, 2, 3, 4, 6, 8],
    },
    exitTicket: {
      id: 'et-5',
      question: 'Solve for x: -2x + 8 ≤ 16. What is the final simplified solution?',
      options: [
        {
          id: 'opt-a',
          text: 'x ≤ -4',
          isCorrect: false,
          explanation: 'Subtracting 8 gives -2x ≤ 8. Dividing by -2 must flip the symbol to ≥!',
        },
        {
          id: 'opt-b',
          text: 'x ≥ -4',
          isCorrect: true,
          explanation: 'Masterful! Step 1: -2x ≤ 8. Step 2: Divide by -2 and FLIP the symbol → x ≥ -4!',
        },
        {
          id: 'opt-c',
          text: 'x ≥ 4',
          isCorrect: false,
          explanation: '8 divided by -2 is -4, not +4.',
        },
        {
          id: 'opt-d',
          text: 'x > -4',
          isCorrect: false,
          explanation: 'The original sign was ≤, so the flipped sign must be ≥ (includes equal to).',
        },
      ],
      hint: 'First subtract 8 from both sides (16 - 8 = 8). Then divide by -2 and don’t forget to FLIP the sign!',
    },
  },
];

export const GLOSSARY_TERMS = [
  {
    term: 'Linear Inequality',
    definition: 'A mathematical statement involving a linear expression and an inequality symbol (<, ≤, >, ≥) expressing an ordering relationship.',
  },
  {
    term: 'Variable',
    definition: 'A letter representing an unknown quantity or a range of values (most commonly x).',
  },
  {
    term: 'Boundary Point (Critical Value)',
    definition: 'The specific number where the expression changes from satisfying the inequality to not satisfying it.',
  },
  {
    term: 'Open Circle (○)',
    definition: 'A hollow dot on a number line indicating the boundary point is NOT included in the solution set (used for < and >).',
  },
  {
    term: 'Closed Dot (●)',
    definition: 'A solid filled dot on a number line indicating the boundary point IS included in the solution set (used for ≤ and ≥).',
  },
  {
    term: 'Sign Reversal Rule',
    definition: 'The principle that multiplying or dividing both sides of an inequality by a negative number inverts the direction of the inequality sign.',
  },
  {
    term: 'Solution Set',
    definition: 'The set of all real numbers that make the inequality a true statement when substituted for the variable.',
  },
];
