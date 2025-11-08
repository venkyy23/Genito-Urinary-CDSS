
// FIX: Import React to use React.ReactNode
import type React from 'react';

export interface Patient {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | '';
}

export interface Option {
  text: string;
  nextStepId: string;
  className?: string;
}

export type StepType = 'demographics' | 'single-choice' | 'diagnosis' | 'info';

export interface Step {
  id: string;
  type: StepType;
  category?: 'Ask' | 'Look' | 'Inspect' | 'Measure' | 'Assess' | 'Diagnosis' | 'Info';
  prompt: string | React.ReactNode;
  options?: Option[];
  diagnosis?: string;
  details?: string | React.ReactNode;
  isReferral?: boolean;
}