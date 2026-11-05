import { z } from "zod"

/**
 * Типы агентов в экосистеме StartTechPro
 */

export enum AgentRole {
  ANALYST = "analyst",
  ARCHITECT = "architect",
  DESIGNER = "designer",
  COPYWRITER = "copywriter",
  DEVELOPER = "developer",
  QA = "qa",
  PUBLISHER = "publisher",
}

export enum AgentStatus {
  IDLE = "idle",
  WORKING = "working",
  REVIEW = "review",
  DONE = "done",
  ERROR = "error",
}

export enum LLMProvider {
  OPENAI = "openai",
  GROQ = "groq",
  YANDEXGPT = "yandexgpt",
  ANTHROPIC = "anthropic",
}

export interface AgentConfig {
  role: AgentRole
  name: string
  description: string
  model: string
  provider: LLMProvider
  systemPrompt: string
  temperature: number
  maxTokens: number
}

export interface AgentState {
  role: AgentRole
  status: AgentStatus
  output?: string
  error?: string
  startedAt?: string
  completedAt?: string
}

export interface ChainStep {
  agent: AgentRole
  input: string
  output?: string
  status: AgentStatus
}

export interface ProductionChain {
  id: string
  name: string
  projectId: string
  steps: ChainStep[]
  status: AgentStatus
  createdAt: string
  updatedAt: string
}

export interface ProjectContext {
  id: string
  name: string
  description: string
  requirements: string
  targetAudience: string
  budget: string
  timeline: string
  techStack: string[]
}

export const AgentConfigSchema = z.object({
  role: z.nativeEnum(AgentRole),
  name: z.string(),
  description: z.string(),
  model: z.string(),
  provider: z.nativeEnum(LLMProvider),
  systemPrompt: z.string(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().positive().default(4096),
})

export const ProjectContextSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  requirements: z.string(),
  targetAudience: z.string(),
  budget: z.string(),
  timeline: z.string(),
  techStack: z.array(z.string()),
})

export const ChainStepSchema = z.object({
  agent: z.nativeEnum(AgentRole),
  input: z.string(),
  output: z.string().optional(),
  status: z.nativeEnum(AgentStatus),
})