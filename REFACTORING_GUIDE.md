# LeanForesight Refactoring Guide

> **JavaScript-only policy:** This repository uses **.js/.jsx** exclusively. Do not add TypeScript files or type annotations. If you adapt any examples below, remove type syntax and keep the implementation in JavaScript.

## Table of Contents
1. [Overview](#overview)
2. [Current State Analysis](#current-state-analysis)
3. [Software Principles](#software-principles)
4. [Component-Level Refactoring](#component-level-refactoring)
5. [Page-Level Refactoring](#page-level-refactoring)
6. [Service Layer Refactoring](#service-layer-refactoring)
7. [Testability Improvements](#testability-improvements)
8. [Implementation Roadmap](#implementation-roadmap)

---

## Overview

This document provides a comprehensive guide for refactoring the LeanForesight application following industry-standard software engineering principles. The refactoring focuses on:

- **SOLID Principles** - Ensuring maintainable and extensible code
- **Separation of Concerns** - Clear boundaries between UI, business logic, and data
- **Testability** - Making components and services easily testable
- **Maintainability** - Reducing technical debt and improving code quality

---

## Current State Analysis

### Identified Issues

#### 1. **Dashboard.tsx (382 lines)**
- ❌ Violates Single Responsibility Principle
- ❌ Mixes UI rendering with business logic
- ❌ Direct service calls create tight coupling
- ❌ Complex state management in single component
- ❌ Difficult to test individual features

#### 2. **Layout.tsx (153 lines)**
- ❌ Handles both desktop and mobile navigation in one component
- ❌ Navigation logic mixed with UI rendering
- ❌ No separation of concerns for menu state

#### 3. **ProjectList.tsx (129 lines)**
- ❌ Modal creation logic embedded in component
- ❌ Direct storage service calls
- ❌ Form handling mixed with list display

#### 4. **Auth.tsx**
- ❌ Mock authentication logic in component
- ❌ No abstraction for authentication service
- ❌ Hardcoded delay simulation

#### 5. **Services**
- ❌ No interface definitions
- ❌ Direct API calls without abstraction layer
- ❌ Error handling not centralized
- ❌ No dependency injection capability

---

## Software Principles

### SOLID Principles

#### **S - Single Responsibility Principle (SRP)**
Each class, function, or component should have one reason to change.

**Current Violations:**
- `Dashboard.tsx` handles: routing, state management, API calls, UI rendering, form handling
- `Layout.tsx` handles: navigation, responsive design, authentication state

**Refactored Approach:**
```
Dashboard/
├── Dashboard.tsx (orchestration only)
├── hooks/
│   ├── useProjectData.ts (data fetching)
│   ├── useProjectActions.ts (CRUD operations)
│   └── useScenarioGeneration.ts (AI service calls)
├── components/
│   ├── StepIndicator.tsx
│   ├── TopicInput.tsx
│   ├── ScenarioDisplay.tsx
│   ├── GoalInput.tsx
│   ├── StrategyDisplay.tsx
│   └── ValidationResults.tsx
└── utils/
    ├── projectValidators.ts
    └── formatters.ts
```

#### **O - Open/Closed Principle (OCP)**
Software entities should be open for extension but closed for modification.

**Application:**
```typescript
// Define interfaces for extensibility
interface AIService {
  generateScenarios(topic: string): Promise<Scenario[]>;
  generateStrategy(topic: string, goal: string, scenarios: Scenario[]): Promise<StrategyResult>;
}

// Multiple implementations can coexist
class GeminiService implements AIService { }
class OpenRouterService implements AIService { }
class MockAIService implements AIService { }

// Factory pattern for service selection
class AIServiceFactory {
  static create(provider: 'gemini' | 'openrouter'): AIService {
    switch (provider) {
      case 'gemini': return new GeminiService();
      case 'openrouter': return new OpenRouterService();
    }
  }
}
```

#### **L - Liskov Substitution Principle (LSP)**
Derived classes should be substitutable for their base classes.

**Application:**
```typescript
// Base storage interface
interface StorageService {
  getProjects(userId: string): Project[];
  getProject(id: string): Project | undefined;
  createProject(userId: string, name: string): Project;
  updateProject(project: Project): void;
  deleteProject(id: string): void;
}

// Any implementation can be swapped without breaking code
class LocalStorageService implements StorageService { }
class IndexedDBService implements StorageService { }
class APIService implements StorageService { }
```

#### **I - Interface Segregation Principle (ISP)**
Clients shouldn't depend on interfaces they don't use.

**Application:**
```typescript
// Split large interfaces into focused ones
interface ProjectReader {
  getProject(id: string): Project | undefined;
  getProjects(userId: string): Project[];
}

interface ProjectWriter {
  createProject(userId: string, name: string): Project;
  updateProject(project: Project): void;
  deleteProject(id: string): void;
}

// Components only depend on what they need
function ProjectList({ storage }: { storage: ProjectReader }) { }
function ProjectEditor({ storage }: { storage: ProjectWriter }) { }
```

#### **D - Dependency Inversion Principle (DIP)**
Depend on abstractions, not concretions.

**Application:**
```typescript
// Instead of direct service calls
// ❌ Bad
const scenarios = await generateScenarios(topic);

// Use dependency injection
// ✅ Good
interface ScenarioGenerator {
  generate(topic: string): Promise<Scenario[]>;
}

function ScenarioForm({ generator }: { generator: ScenarioGenerator }) {
  const handleGenerate = async () => {
    const scenarios = await generator.generate(topic);
  };
}
```

### Additional Principles

#### **Separation of Concerns (SoC)**
Divide the application into distinct sections with minimal overlap.

**Layers:**
```
┌─────────────────────────────────────┐
│   Presentation Layer (Components)   │  ← UI only, no business logic
├─────────────────────────────────────┤
│   Business Logic Layer (Hooks)      │  ← State management, orchestration
├─────────────────────────────────────┤
│   Service Layer (Services)          │  ← External API calls, data access
├─────────────────────────────────────┤
│   Data Layer (Storage/Types)        │  ← Data persistence, type definitions
└─────────────────────────────────────┘
```

#### **Don't Repeat Yourself (DRY)**
Extract common logic into reusable utilities and hooks.

#### **Keep It Simple, Stupid (KISS)**
Avoid unnecessary complexity. Simple solutions are better.

#### **You Aren't Gonna Need It (YAGNI)**
Don't implement features until they're actually needed.

---

## Component-Level Refactoring

### 1. Create Custom Hooks for Business Logic

#### **useProjectData.ts**
```typescript
// hooks/useProjectData.ts
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project } from '../types';
import { storageService } from '../services/storageService';

export function useProjectData() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/projects');
      return;
    }

    const storedProject = storageService.getProject(id);
    if (storedProject) {
      setProject(storedProject);
    } else {
      navigate('/projects');
    }
    setLoading(false);
  }, [id, navigate]);

  const updateProject = (updates: Partial<Project>) => {
    if (!project) return;
    const updated = { ...project, ...updates, updatedAt: Date.now() };
    setProject(updated);
    storageService.updateProject(updated);
  };

  const updateProjectData = (dataUpdates: Partial<Project['data']>) => {
    if (!project) return;
    const updatedData = { ...project.data, ...dataUpdates };
    updateProject({ data: updatedData });
  };

  return {
    project,
    loading,
    updateProject,
    updateProjectData,
  };
}
```

#### **useScenarioGeneration.ts**
```typescript
// hooks/useScenarioGeneration.ts
import { useState } from 'react';
import { Scenario, StrategyResult } from '../types';
import { AIService } from '../services/AIService';

export function useScenarioGeneration(aiService: AIService) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateScenarios = async (topic: string): Promise<Scenario[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const scenarios = await aiService.generateScenarios(topic);
      return scenarios;
    } catch (err) {
      setError('Failed to generate scenarios. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateStrategy = async (
    topic: string,
    goal: string,
    scenarios: Scenario[]
  ): Promise<StrategyResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const strategy = await aiService.generateStrategy(topic, goal, scenarios);
      return strategy;
    } catch (err) {
      setError('Failed to generate strategy. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateScenarios,
    generateStrategy,
  };
}
```

### 2. Extract UI Components

#### **StepIndicator.tsx**
```typescript
// components/StepIndicator.tsx
import React from 'react';

interface Step {
  number: number;
  title: string;
  status: 'completed' | 'current' | 'pending';
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold
              ${step.status === 'completed' ? 'bg-green-500 text-white' : ''}
              ${step.status === 'current' ? 'bg-foresight-sprint text-white' : ''}
              ${step.status === 'pending' ? 'bg-slate-200 text-slate-500' : ''}
            `}>
              {step.status === 'completed' ? '✓' : step.number}
            </div>
            <span className={`text-xs mt-2 ${step.status === 'current' ? 'font-semibold' : ''}`}>
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-2 bg-slate-200" />
          )}
        </div>
      ))}
    </div>
  );
}
```

#### **TopicInput.tsx**
```typescript
// components/TopicInput.tsx
import React from 'react';

interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function TopicInput({ value, onChange, onSubmit, disabled, loading }: TopicInputProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 sm:p-10 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          1. Strategic Question
        </h2>
        <p className="text-sm sm:text-base text-slate-500">
          What is the core uncertainty or strategic development question for your product or company?
        </p>
      </div>
      
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Topic / Question
      </label>
      
      <textarea
        className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-3 sm:p-4 focus:ring-2 focus:ring-foresight-sprint focus:outline-none min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
        placeholder="e.g., How will Artificial Intelligence impact our digital marketing agency's business model over the next 5 years?"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      
      <button
        disabled={loading || disabled || !value.trim()}
        onClick={onSubmit}
        className="mt-4 w-full bg-gradient-to-r from-foresight-ram to-foresight-sprint text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Generating...' : 'Generate Scenarios'}
      </button>
    </div>
  );
}
```

#### **ScenarioDisplay.tsx**
```typescript
// components/ScenarioDisplay.tsx
import React from 'react';
import { Scenario, ScenarioType } from '../types';
import { IconTarget, IconBrain } from './Icons';

interface ScenarioDisplayProps {
  scenarios: Scenario[];
  onSelect: (scenario: Scenario) => void;
  selectedScenario?: Scenario;
}

const getScenarioColor = (type: ScenarioType): string => {
  switch (type) {
    case ScenarioType.BEST_CASE:
      return 'bg-green-50 border-green-200 text-green-800';
    case ScenarioType.WORST_CASE:
      return 'bg-red-50 border-red-200 text-red-800';
    case ScenarioType.PREFERRED:
      return 'bg-blue-50 border-blue-200 text-blue-800';
    case ScenarioType.PLAUSIBLE:
      return 'bg-slate-50 border-slate-200 text-slate-800';
  }
};

export function ScenarioDisplay({ scenarios, onSelect, selectedScenario }: ScenarioDisplayProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          2. Review Scenarios
        </h2>
        <p className="text-sm sm:text-base text-slate-500">
          Review the generated scenarios and select the most plausible baseline.
        </p>
      </div>

      <div className="grid gap-4">
        {scenarios.map((scenario, index) => (
          <div
            key={index}
            onClick={() => onSelect(scenario)}
            className={`
              p-6 rounded-xl border-2 cursor-pointer transition-all
              ${getScenarioColor(scenario.type)}
              ${selectedScenario === scenario ? 'ring-2 ring-foresight-sprint' : ''}
            `}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {scenario.type === ScenarioType.PLAUSIBLE ? (
                  <IconBrain className="w-6 h-6" />
                ) : (
                  <IconTarget className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    {scenario.type}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{scenario.title}</h3>
                <p className="text-sm opacity-90 mb-3">{scenario.description}</p>
                <div className="flex flex-wrap gap-2">
                  {scenario.indicators.map((indicator, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-full bg-white/50"
                    >
                      {indicator}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. Refactor Layout Component

#### **Navigation.tsx**
```typescript
// components/Navigation.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  isAuthenticated: boolean;
  isLanding: boolean;
  onLogout?: () => void;
  onLoginClick?: () => void;
}

export function Navigation({ isAuthenticated, isLanding, onLogout, onLoginClick }: NavigationProps) {
  const location = useLocation();

  return (
    <nav className="hidden sm:flex items-center gap-6 lg:gap-8">
      {!isLanding && (
        <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          Home
        </Link>
      )}
      
      {isAuthenticated && (
        <Link
          to="/projects"
          className={`text-sm font-medium transition-colors ${
            isLanding ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Projects
        </Link>
      )}

      {isAuthenticated ? (
        <button
          onClick={onLogout}
          className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
        >
          Sign Out
        </button>
      ) : (
        <button
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
            isLanding
              ? 'bg-white text-slate-950 hover:bg-slate-200'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
          onClick={onLoginClick}
        >
          Get Started
        </button>
      )}
    </nav>
  );
}
```

#### **MobileMenu.tsx**
```typescript
// components/MobileMenu.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  isLanding: boolean;
  onClose: () => void;
  onLogout?: () => void;
  onLoginClick?: () => void;
}

export function MobileMenu({ isOpen, isAuthenticated, isLanding, onClose, onLogout, onLoginClick }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className={`sm:hidden border-t ${isLanding ? 'bg-slate-950/95 border-white/10' : 'bg-white border-slate-200'}`}>
      <nav className="flex flex-col px-4 py-4 space-y-3">
        {!isLanding && (
          <Link
            to="/"
            className={`py-2 text-base font-medium ${isLanding ? 'text-slate-300' : 'text-slate-600'}`}
            onClick={onClose}
          >
            Home
          </Link>
        )}
        
        {isAuthenticated && (
          <Link
            to="/projects"
            className={`py-2 text-base font-medium ${isLanding ? 'text-slate-300' : 'text-slate-600'}`}
            onClick={onClose}
          >
            Projects
          </Link>
        )}

        {isAuthenticated ? (
          <button
            onClick={() => {
              onLogout?.();
              onClose();
            }}
            className="py-2 text-base font-medium text-red-500 text-left"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => {
              onLoginClick?.();
              onClose();
            }}
            className={`py-2 text-base font-medium ${isLanding ? 'text-white' : 'text-slate-900'}`}
          >
            Get Started
          </button>
        )}
      </nav>
    </div>
  );
}
```

#### **Refactored Layout.tsx**
```typescript
// components/Layout.tsx
import React, { useState } from 'react';
import { IconBrain } from './Icons';
import { Link } from 'react-router-dom';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
  isAuthenticated: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, onLogout, isAuthenticated }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLanding = location.pathname === '/';

  const handleLoginClick = () => {
    window.location.hash = '#auth';
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header
        isLanding={isLanding}
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
        onLoginClick={handleLoginClick}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
      <MobileMenu
        isOpen={mobileMenuOpen}
        isAuthenticated={isAuthenticated}
        isLanding={isLanding}
        onLogout={onLogout}
        onLoginClick={handleLoginClick}
        onClose={() => setMobileMenuOpen(false)}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
};

// Extract Header as separate component
function Header({ isLanding, isAuthenticated, onLogout, onLoginClick, mobileMenuOpen, onMobileMenuToggle }: any) {
  return (
    <header className={`fixed top-0 w-full z-50 border-b transition-colors duration-300 ${
      isLanding 
        ? 'bg-slate-950/80 border-white/10 text-white backdrop-blur-md' 
        : 'bg-white/90 border-slate-200 text-slate-900 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <Logo isLanding={isLanding} />
        <Navigation
          isAuthenticated={isAuthenticated}
          isLanding={isLanding}
          onLogout={onLogout}
          onLoginClick={onLoginClick}
        />
        <MobileMenuButton
          isLanding={isLanding}
          isOpen={mobileMenuOpen}
          onToggle={onMobileMenuToggle}
        />
      </div>
    </header>
  );
}
```

---

## Page-Level Refactoring

### 1. Dashboard Refactoring

#### **Refactored Dashboard.tsx**
```typescript
// pages/Dashboard.tsx
import React from 'react';
import { useProjectData } from '../hooks/useProjectData';
import { useScenarioGeneration } from '../hooks/useScenarioGeneration';
import { AIServiceFactory } from '../services/AIServiceFactory';
import { StepIndicator } from '../components/StepIndicator';
import { TopicInput } from '../components/TopicInput';
import { ScenarioDisplay } from '../components/ScenarioDisplay';
import { GoalInput } from '../components/GoalInput';
import { StrategyDisplay } from '../components/StrategyDisplay';
import { ValidationResults } from '../components/ValidationResults';
import { IconLoader } from '../components/Icons';

const aiService = AIServiceFactory.create('gemini');

export const Dashboard: React.FC = () => {
  const { project, loading, updateProject, updateProjectData } = useProjectData();
  const { loading: aiLoading, generateScenarios, generateStrategy } = useScenarioGeneration(aiService);

  if (loading || !project) {
    return <LoadingState />;
  }

  const steps = [
    { number: 1, title: 'Topic', status: project.currentStep > 1 ? 'completed' : 'current' },
    { number: 2, title: 'Scenarios', status: getStepStatus(project.currentStep, 2) },
    { number: 3, title: 'Goal', status: getStepStatus(project.currentStep, 3) },
    { number: 4, title: 'Strategy', status: getStepStatus(project.currentStep, 4) },
    { number: 5, title: 'Validate', status: getStepStatus(project.currentStep, 5) },
  ];

  const handleGenerateScenarios = async () => {
    if (!project.data.topic) return;
    const scenarios = await generateScenarios(project.data.topic);
    if (scenarios) {
      updateProjectData({ scenarios });
      updateProject({ currentStep: 2 });
    }
  };

  const handleSelectScenario = (scenario: any) => {
    updateProjectData({ selectedScenario: scenario });
    updateProject({ currentStep: 3 });
  };

  const handleGenerateStrategy = async () => {
    if (!project.data.goal || !project.data.scenarios) return;
    const strategy = await generateStrategy(
      project.data.topic,
      project.data.goal,
      project.data.scenarios
    );
    if (strategy) {
      updateProjectData({ strategy });
      updateProject({ currentStep: 4 });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <StepIndicator steps={steps} currentStep={project.currentStep} />
        
        {project.currentStep === 1 && (
          <TopicInput
            value={project.data.topic}
            onChange={(value) => updateProjectData({ topic: value })}
            onSubmit={handleGenerateScenarios}
            loading={aiLoading}
          />
        )}
        
        {project.currentStep === 2 && (
          <ScenarioDisplay
            scenarios={project.data.scenarios}
            onSelect={handleSelectScenario}
          />
        )}
        
        {project.currentStep === 3 && (
          <GoalInput
            value={project.data.goal}
            onChange={(value) => updateProjectData({ goal: value })}
            onSubmit={handleGenerateStrategy}
            loading={aiLoading}
          />
        )}
        
        {project.currentStep === 4 && project.data.strategy && (
          <StrategyDisplay strategy={project.data.strategy} />
        )}
        
        {project.currentStep === 5 && (
          <ValidationResults project={project} />
        )}
      </div>
    </div>
  );
};

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <IconLoader className="w-8 h-8 text-slate-400" />
    </div>
  );
}

function getStepStatus(currentStep: number, stepNumber: number): 'completed' | 'current' | 'pending' {
  if (currentStep > stepNumber) return 'completed';
  if (currentStep === stepNumber) return 'current';
  return 'pending';
}
```

### 2. ProjectList Refactoring

#### **CreateProjectModal.tsx**
```typescript
// components/CreateProjectModal.tsx
import React from 'react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function CreateProjectModal({ isOpen, onClose, onCreate }: CreateProjectModalProps) {
  const [name, setName] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim());
      setName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Create New Project</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Project Name
            </label>
            <input
              autoFocus
              type="text"
              className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-foresight-sprint focus:outline-none"
              placeholder="e.g. Q3 Strategic Plan"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

#### **ProjectCard.tsx**
```typescript
// components/ProjectCard.tsx
import React from 'react';
import { Project } from '../types';
import { IconFolder, IconTarget, IconArrowRight } from './Icons';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const formatDate = (ts: number) => new Date(ts).toLocaleDateString();

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-6 border border-slate-200 hover:border-foresight-sprint hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-foresight-sprint group-hover:text-white transition-colors">
          <IconFolder className="w-6 h-6" />
        </div>
        <span className="text-xs text-slate-400">{formatDate(project.updatedAt)}</span>
      </div>
      
      <h3 className="font-semibold text-lg text-slate-900 mb-2">{project.name}</h3>
      
      {project.data.topic && (
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{project.data.topic}</p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <IconTarget className="w-4 h-4" />
          <span>Step {project.currentStep} of 5</span>
        </div>
        <IconArrowRight className="w-5 h-5 text-slate-300 group-hover:text-foresight-sprint transition-colors" />
      </div>
    </div>
  );
}
```

#### **Refactored ProjectList.tsx**
```typescript
// pages/ProjectList.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { User } from '../types';
import { IconPlus } from '../components/Icons';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { ProjectCard } from '../components/ProjectCard';
import { EmptyState } from '../components/EmptyState';

interface ProjectListProps {
  user: User;
}

export const ProjectList: React.FC<ProjectListProps> = ({ user }) => {
  const [projects, setProjects] = React.useState(storageService.getProjects(user.id));
  const [isCreating, setIsCreating] = React.useState(false);
  const navigate = useNavigate();

  const handleCreateProject = (name: string) => {
    const project = storageService.createProject(user.id, name);
    setIsCreating(false);
    navigate(`/project/${project.id}`);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader onCreateClick={() => setIsCreating(true)} />
      
      <CreateProjectModal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onCreate={handleCreateProject}
      />
      
      {projects.length === 0 ? (
        <EmptyState onCreateClick={() => setIsCreating(true)} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

function PageHeader({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Your Projects</h1>
        <p className="text-slate-500 mt-1">Manage your strategic foresight scenarios.</p>
      </div>
      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-shadow shadow-md hover:shadow-lg"
      >
        <IconPlus className="w-5 h-5" /> New Project
      </button>
    </div>
  );
}
```

### 3. Auth Refactoring

#### **AuthService.ts**
```typescript
// services/AuthService.ts
import { User } from '../types';

export interface AuthService {
  login(email: string, name: string): Promise<User>;
  logout(): void;
  getCurrentUser(): User | null;
  isAuthenticated(): boolean;
}

export class MockAuthService implements AuthService {
  async login(email: string, name: string): Promise<User> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user: User = {
      id: btoa(email),
      email,
      name
    };
    
    localStorage.setItem('lf_user', JSON.stringify(user));
    return user;
  }

  logout(): void {
    localStorage.removeItem('lf_user');
  }

  getCurrentUser(): User | null {
    const stored = localStorage.getItem('lf_user');
    return stored ? JSON.parse(stored) : null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export const authService = new MockAuthService();
```

#### **Refactored Auth.tsx**
```typescript
// pages/Auth.tsx
import React from 'react';
import { authService } from '../services/AuthService';
import { User } from '../types';
import { IconBrain, IconGoogle, IconLoader } from '../components/Icons';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await authService.login('demo@leanforesight.com', 'Demo User');
      onLogin(user);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthCard isLoading={isLoading} onLogin={handleGoogleLogin} />
    </div>
  );
};

function AuthCard({ isLoading, onLogin }: { isLoading: boolean; onLogin: () => void }) {
  return (
    <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-slate-100 text-center">
      <Logo />
      <WelcomeMessage />
      <GoogleButton isLoading={isLoading} onClick={onLogin} />
      <TermsNotice />
    </div>
  );
}

function Logo() {
  return (
    <div className="mx-auto h-20 w-20 bg-gradient-to-br from-foresight-ram to-foresight-sprint rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg transform -rotate-3">
      <IconBrain className="w-12 h-12" />
    </div>
  );
}

function WelcomeMessage() {
  return (
    <>
      <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
        Welcome to LeanForesight
      </h2>
      <p className="text-slate-500 mb-10 max-w-sm mx-auto">
        Sign in to start your scenario planning and strategic foresight journey.
      </p>
    </>
  );
}

function GoogleButton({ isLoading, onClick }: { isLoading: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-semibold py-4 px-6 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group"
    >
      {isLoading ? (
        <IconLoader className="w-6 h-6 text-slate-400" />
      ) : (
        <>
          <IconGoogle className="w-6 h-6" />
          <span className="text-lg">Continue with Google</span>
        </>
      )}
    </button>
  );
}

function TermsNotice() {
  return (
    <p className="mt-8 text-xs text-slate-400">
      By continuing, you agree to our Terms of Service and Privacy Policy.
    </p>
  );
}
```

---

## Service Layer Refactoring

### 1. Define Service Interfaces

#### **AIService.ts**
```typescript
// services/AIService.ts
import { Scenario, StrategyResult } from '../types';

export interface AIService {
  generateScenarios(topic: string): Promise<Scenario[]>;
  generateStrategy(
    topic: string,
    goal: string,
    scenarios: Scenario[]
  ): Promise<StrategyResult>;
}

export interface AIServiceConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
}
```

#### **StorageService.ts**
```typescript
// services/StorageService.ts
import { Project, User } from '../types';

export interface StorageService {
  // User operations
  getCurrentUser(): User | null;
  
  // Project operations
  getProjects(userId: string): Project[];
  getProject(id: string): Project | undefined;
  createProject(userId: string, name: string): Project;
  updateProject(project: Project): void;
  deleteProject(id: string): void;
}
```

### 2. Implement Service Factory

#### **AIServiceFactory.ts**
```typescript
// services/AIServiceFactory.ts
import { AIService } from './AIService';
import { GeminiService } from './GeminiService';
import { OpenRouterService } from './OpenRouterService';
import { MockAIService } from './MockAIService';

export type AIProvider = 'gemini' | 'openrouter' | 'mock';

export class AIServiceFactory {
  private static instance: AIService | null = null;

  static create(provider: AIProvider = 'gemini'): AIService {
    switch (provider) {
      case 'gemini':
        return new GeminiService();
      case 'openrouter':
        return new OpenRouterService();
      case 'mock':
        return new MockAIService();
      default:
        throw new Error(`Unknown AI provider: ${provider}`);
    }
  }

  static setInstance(service: AIService) {
    this.instance = service;
  }

  static getInstance(): AIService {
    if (!this.instance) {
      this.instance = this.create('gemini');
    }
    return this.instance;
  }
}
```

### 3. Refactor Existing Services

#### **GeminiService.ts (Refactored)**
```typescript
// services/GeminiService.ts
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Scenario, StrategyResult } from "../types";
import { AIService, AIServiceConfig } from "./AIService";

export class GeminiService implements AIService {
  private ai: GoogleGenAI;
  private model: string;
  private temperature: number;

  constructor(config?: Partial<AIServiceConfig>) {
    const apiKey = config?.apiKey || process.env.API_KEY || '';
    this.ai = new GoogleGenAI({ apiKey });
    this.model = config?.model || 'gemini-2.5-flash';
    this.temperature = config?.temperature || 0.7;
  }

  async generateScenarios(topic: string): Promise<Scenario[]> {
    const schema = this.buildScenarioSchema();
    const prompt = this.buildScenarioPrompt(topic);

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: this.temperature,
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");
      return JSON.parse(text) as Scenario[];
    } catch (error) {
      console.error("Gemini Scenario Gen Error:", error);
      throw new Error("Failed to generate scenarios");
    }
  }

  async generateStrategy(
    topic: string,
    goal: string,
    scenarios: Scenario[]
  ): Promise<StrategyResult> {
    const schema = this.buildStrategySchema();
    const prompt = this.buildStrategyPrompt(topic, goal, scenarios);

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: this.temperature,
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");
      return JSON.parse(text) as StrategyResult;
    } catch (error) {
      console.error("Gemini Strategy Gen Error:", error);
      throw new Error("Failed to generate strategy");
    }
  }

  private buildScenarioSchema(): Schema {
    return {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          indicators: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['type', 'title', 'description', 'indicators']
      }
    };
  }

  private buildScenarioPrompt(topic: string): string {
    return `
      Act as a professional futurist using the Foresight Scenario Sprint methodology.
      The user is asking the following strategic question: "${topic}".
      
      Generate 4 distinct future scenarios for a timeframe of 5 years from now:
      1. Best Case: Everything goes perfectly.
      2. Worst Case: Everything goes wrong.
      3. Preferred: The ideal but realistic outcome the user likely wants.
      4. Plausible: The most likely outcome based on current trends (the baseline).
    `;
  }

  private buildStrategySchema(): Schema {
    return {
      type: Type.OBJECT,
      properties: {
        persona: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            role: { type: Type.STRING },
            description: { type: Type.STRING },
            painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            goals: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['name', 'role', 'description']
        },
        recommendations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              timeframe: { type: Type.STRING },
              impact: { type: Type.STRING }
            },
            required: ['title', 'description', 'timeframe', 'impact']
          }
        },
        riskMitigation: { type: Type.STRING }
      },
      required: ['persona', 'recommendations', 'riskMitigation']
    };
  }

  private buildStrategyPrompt(topic: string, goal: string, scenarios: Scenario[]): string {
    return `
      Context: We are doing a Foresight Strategy integration.
      Topic: "${topic}"
      Goal: "${goal}"
      Scenarios: ${JSON.stringify(scenarios)}
      
      Generate a comprehensive strategy including persona, recommendations, and risk mitigation.
    `;
  }
}
```

#### **LocalStorageService.ts (Refactored)**
```typescript
// services/LocalStorageService.ts
import { Project, User } from '../types';
import { StorageService } from './StorageService';

const KEYS = {
  USER: 'lf_user',
  PROJECTS: 'lf_projects'
} as const;

export class LocalStorageService implements StorageService {
  private getStoredProjects(): Project[] {
    const stored = localStorage.getItem(KEYS.PROJECTS);
    return stored ? JSON.parse(stored) : [];
  }

  private setStoredProjects(projects: Project[]): void {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
  }

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  }

  getProjects(userId: string): Project[] {
    const projects = this.getStoredProjects();
    return projects
      .filter(p => p.userId === userId)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  getProject(id: string): Project | undefined {
    const projects = this.getStoredProjects();
    return projects.find(p => p.id === id);
  }

  createProject(userId: string, name: string): Project {
    const projects = this.getStoredProjects();
    
    const newProject: Project = {
      id: crypto.randomUUID(),
      userId,
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      currentStep: 1,
      data: {
        topic: '',
        goal: '',
        scenarios: [],
        strategy: null
      }
    };

    projects.push(newProject);
    this.setStoredProjects(projects);
    return newProject;
  }

  updateProject(project: Project): void {
    const projects = this.getStoredProjects();
    const index = projects.findIndex(p => p.id === project.id);
    
    if (index !== -1) {
      projects[index] = { ...project, updatedAt: Date.now() };
      this.setStoredProjects(projects);
    }
  }

  deleteProject(id: string): void {
    const projects = this.getStoredProjects();
    const filtered = projects.filter(p => p.id !== id);
    this.setStoredProjects(filtered);
  }
}

export const storageService = new LocalStorageService();
```

---

## Testability Improvements

### 1. Component Testing Strategy

#### **Testing TopicInput Component**
```typescript
// components/TopicInput.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TopicInput } from './TopicInput';

describe('TopicInput', () => {
  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input with placeholder', () => {
    render(
      <TopicInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );
    
    expect(screen.getByPlaceholderText(/Artificial Intelligence/i)).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    render(
      <TopicInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test topic' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('Test topic');
  });

  it('disables button when value is empty', () => {
    render(
      <TopicInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );
    
    const button = screen.getByRole('button', { name: /Generate Scenarios/i });
    expect(button).toBeDisabled();
  });

  it('calls onSubmit when button is clicked', () => {
    render(
      <TopicInput
        value="Test topic"
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );
    
    const button = screen.getByRole('button', { name: /Generate Scenarios/i });
    fireEvent.click(button);
    
    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
```

#### **Testing useProjectData Hook**
```typescript
// hooks/useProjectData.test.ts
import { renderHook, act } from '@testing-library/react';
import { useProjectData } from './useProjectData';
import { storageService } from '../services/storageService';

jest.mock('../services/storageService');
jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: 'test-id' }),
  useNavigate: () => jest.fn(),
}));

describe('useProjectData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads project on mount', () => {
    const mockProject = { id: 'test-id', name: 'Test Project' };
    (storageService.getProject as jest.Mock).mockReturnValue(mockProject);

    const { result } = renderHook(() => useProjectData());

    expect(result.current.project).toEqual(mockProject);
    expect(storageService.getProject).toHaveBeenCalledWith('test-id');
  });

  it('updates project data', () => {
    const mockProject = {
      id: 'test-id',
      name: 'Test Project',
      data: { topic: '', goal: '', scenarios: [], strategy: null }
    };
    (storageService.getProject as jest.Mock).mockReturnValue(mockProject);

    const { result } = renderHook(() => useProjectData());

    act(() => {
      result.current.updateProjectData({ topic: 'New topic' });
    });

    expect(result.current.project?.data.topic).toBe('New topic');
    expect(storageService.updateProject).toHaveBeenCalled();
  });
});
```

### 2. Service Testing Strategy

#### **Testing GeminiService**
```typescript
// services/GeminiService.test.ts
import { GeminiService } from './GeminiService';
import { ScenarioType } from '../types';

// Mock GoogleGenAI
jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn(),
    },
  })),
  Type: {
    ARRAY: 'ARRAY',
    OBJECT: 'OBJECT',
    STRING: 'STRING',
  },
}));

describe('GeminiService', () => {
  let service: GeminiService;
  let mockGenerateContent: jest.Mock;

  beforeEach(() => {
    const { GoogleGenAI } = require('@google/genai');
    const mockAI = new GoogleGenAI({ apiKey: 'test-key' });
    mockGenerateContent = mockAI.models.generateContent as jest.Mock;
    service = new GeminiService({ apiKey: 'test-key' });
  });

  it('generates scenarios successfully', async () => {
    const mockScenarios = [
      {
        type: ScenarioType.BEST_CASE,
        title: 'Best Case',
        description: 'Everything goes well',
        indicators: ['indicator1', 'indicator2']
      },
    ];

    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify(mockScenarios)
    });

    const result = await service.generateScenarios('Test topic');

    expect(result).toEqual(mockScenarios);
    expect(mockGenerateContent).toHaveBeenCalled();
  });

  it('throws error when no response', async () => {
    mockGenerateContent.mockResolvedValue({ text: null });

    await expect(service.generateScenarios('Test topic')).rejects.toThrow();
  });
});
```

### 3. Integration Testing Strategy

#### **Testing Dashboard Flow**
```typescript
// pages/Dashboard.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { storageService } from '../services/storageService';
import { AIServiceFactory } from '../services/AIServiceFactory';

jest.mock('../services/storageService');
jest.mock('../services/AIServiceFactory');

describe('Dashboard Integration', () => {
  const mockProject = {
    id: 'test-id',
    userId: 'user-1',
    name: 'Test Project',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    currentStep: 1,
    data: {
      topic: '',
      goal: '',
      scenarios: [],
      strategy: null
    }
  };

  beforeEach(() => {
    (storageService.getProject as jest.Mock).mockReturnValue(mockProject);
    (AIServiceFactory.getInstance as jest.Mock).mockReturnValue({
      generateScenarios: jest.fn().mockResolvedValue([]),
      generateStrategy: jest.fn().mockResolvedValue({}),
    });
  });

  it('renders step 1 when project is on step 1', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Strategic Question/i)).toBeInTheDocument();
    });
  });

  it('completes scenario generation flow', async () => {
    const mockScenarios = [
      { type: ScenarioType.BEST_CASE, title: 'Best', description: 'Desc', indicators: [] }
    ];
    
    (AIServiceFactory.getInstance as jest.Mock).mockReturnValue({
      generateScenarios: jest.fn().mockResolvedValue(mockScenarios),
      generateStrategy: jest.fn().mockResolvedValue({}),
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Type topic
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test topic' } });

    // Click generate
    const button = screen.getByRole('button', { name: /Generate Scenarios/i });
    fireEvent.click(button);

    // Wait for scenarios to appear
    await waitFor(() => {
      expect(screen.getByText(/Review Scenarios/i)).toBeInTheDocument();
    });
  });
});
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Define service interfaces
- [ ] Create service factory pattern
- [ ] Set up testing infrastructure
- [ ] Create base custom hooks

### Phase 2: Service Layer (Week 2)
- [ ] Refactor GeminiService to implement interface
- [ ] Refactor OpenRouterService to implement interface
- [ ] Create MockAIService for testing
- [ ] Refactor StorageService to implement interface
- [ ] Create AuthService

### Phase 3: Component Extraction (Week 3)
- [ ] Extract StepIndicator component
- [ ] Extract TopicInput component
- [ ] Extract ScenarioDisplay component
- [ ] Extract GoalInput component
- [ ] Extract StrategyDisplay component
- [ ] Extract ValidationResults component
- [ ] Extract CreateProjectModal component
- [ ] Extract ProjectCard component
- [ ] Extract Navigation component
- [ ] Extract MobileMenu component

### Phase 4: Custom Hooks (Week 4)
- [ ] Create useProjectData hook
- [ ] Create useScenarioGeneration hook
- [ ] Create useAuth hook
- [ ] Create useProjectList hook
- [ ] Create useModal hook

### Phase 5: Page Refactoring (Week 5)
- [ ] Refactor Dashboard page
- [ ] Refactor ProjectList page
- [ ] Refactor Auth page
- [ ] Refactor Landing page

### Phase 6: Testing (Week 6)
- [ ] Write unit tests for components
- [ ] Write unit tests for hooks
- [ ] Write unit tests for services
- [ ] Write integration tests for pages
- [ ] Set up test coverage reporting

### Phase 7: Documentation & Cleanup (Week 7)
- [ ] Update component documentation
- [ ] Create architecture diagrams
- [ ] Write contribution guidelines
- [ ] Remove deprecated code
- [ ] Performance optimization

---

## Best Practices Checklist

### Component Design
- [ ] Components are less than 200 lines
- [ ] Components have single responsibility
- [ ] Components use TypeScript interfaces for props
- [ ] Components are pure functions when possible
- [ ] Components don't directly call services

### Hook Design
- [ ] Hooks start with 'use'
- [ ] Hooks have clear return types
- [ ] Hooks handle error states
- [ ] Hooks are reusable across components
- [ ] Hooks don't cause unnecessary re-renders

### Service Design
- [ ] Services implement interfaces
- [ ] Services are testable with mocks
- [ ] Services handle errors gracefully
- [ ] Services have clear method signatures
- [ ] Services don't depend on UI libraries

### Testing
- [ ] Unit tests for all components
- [ ] Unit tests for all hooks
- [ ] Unit tests for all services
- [ ] Integration tests for critical flows
- [ ] Test coverage above 80%

---

## Metrics for Success

### Code Quality
- Reduce average component size from 200+ lines to <100 lines
- Reduce Dashboard.tsx from 382 lines to <150 lines
- Achieve 80%+ test coverage
- Reduce cyclomatic complexity

### Maintainability
- Clear separation of concerns
- Easy to add new AI providers
- Easy to add new storage backends
- Easy to test in isolation

### Developer Experience
- Clear type definitions
- Comprehensive documentation
- Easy to onboard new developers
- Fast feedback loops

---

## Conclusion

This refactoring guide provides a comprehensive approach to improving the LeanForesight application's codebase. By following SOLID principles, implementing proper separation of concerns, and focusing on testability, we can create a maintainable and extensible application that will scale well as features are added.

The key takeaways are:
1. **Extract business logic into custom hooks**
2. **Create small, focused components**
3. **Define interfaces for services**
4. **Use dependency injection for testability**
5. **Write comprehensive tests**

Following this guide will result in a codebase that is easier to understand, test, and maintain.
