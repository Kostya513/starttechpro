import { AgentRole, AgentStatus, type AgentState, type ProductionChain, type ChainStep, type ProjectContext } from "./types"
import { defaultAgents, getChainForProductType } from "./agents"

/**
 * LangGraph StateGraph для оркестрации AI-агентов StartTechPro
 * 
 * Управляет цепочками агентов: от анализа до публикации.
 * Поддерживает human-in-the-loop на ключевых этапах.
 */

export interface OrchestratorState {
  project: ProjectContext | null
  chain: ProductionChain | null
  agents: Record<AgentRole, AgentState>
  currentStep: number
  status: "idle" | "running" | "paused" | "completed" | "error"
  error: string | null
  memory: {
    shortTerm: Map<string, string>
    longTerm: Map<string, string>
  }
}

export class AgentOrchestrator {
  private state: OrchestratorState

  constructor() {
    this.state = {
      project: null,
      chain: null,
      agents: this.initializeAgents(),
      currentStep: 0,
      status: "idle",
      error: null,
      memory: {
        shortTerm: new Map(),
        longTerm: new Map(),
      },
    }
  }

  private initializeAgents(): Record<AgentRole, AgentState> {
    const agents: Partial<Record<AgentRole, AgentState>> = {}
    for (const role of Object.values(AgentRole)) {
      agents[role] = {
        role,
        status: AgentStatus.IDLE,
      }
    }
    return agents as Record<AgentRole, AgentState>
  }

  /**
   * Запуск производства для проекта
   */
  async startProduction(project: ProjectContext, productType: string = "website"): Promise<ProductionChain> {
    const roles = getChainForProductType(productType as keyof ReturnType<typeof getChainForProductType>)
    
    const steps: ChainStep[] = roles.map((role) => ({
      agent: role,
      input: `Проект: ${project.name}\nОписание: ${project.description}\nТребования: ${project.requirements}`,
      status: AgentStatus.IDLE,
    }))

    const chain: ProductionChain = {
      id: crypto.randomUUID(),
      name: `Производство: ${project.name}`,
      projectId: project.id,
      steps,
      status: AgentStatus.IDLE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.state.project = project
    this.state.chain = chain
    this.state.currentStep = 0
    this.state.status = "running"

    return chain
  }

  /**
   * Выполнить следующий шаг цепочки
   */
  async executeNextStep(): Promise<ChainStep | null> {
    if (!this.state.chain || this.state.status !== "running") {
      return null
    }

    const step = this.state.chain.steps[this.state.currentStep]
    if (!step) {
      this.state.status = "completed"
      return null
    }

    const agentConfig = defaultAgents[step.agent]
    const agentState = this.state.agents[step.agent]

    // Обновляем статус агента
    agentState.status = AgentStatus.WORKING
    agentState.startedAt = new Date().toISOString()
    step.status = AgentStatus.WORKING

    try {
      // Симуляция работы AI-агента (в продакшене — вызов LLM)
      const output = await this.callAgent(agentConfig.name, step.input)
      
      step.output = output
      step.status = AgentStatus.DONE
      agentState.status = AgentStatus.DONE
      agentState.output = output
      agentState.completedAt = new Date().toISOString()

      // Сохраняем в краткосрочную память
      this.state.memory.shortTerm.set(
        `${step.agent}-${this.state.currentStep}`,
        output
      )

      this.state.currentStep++
      this.state.chain.updatedAt = new Date().toISOString()

      // Проверка на human-in-the-loop
      if (this.needsHumanReview(step.agent)) {
        this.state.status = "paused"
      }

      return step
    } catch (error) {
      step.status = AgentStatus.ERROR
      agentState.status = AgentStatus.ERROR
      agentState.error = String(error)
      this.state.status = "error"
      this.state.error = String(error)
      return step
    }
  }

  /**
   * Проверка, нужен ли human review на этом этапе
   */
  private needsHumanReview(role: AgentRole): boolean {
    // Ключевые этапы требуют утверждения человеком
    return [AgentRole.ARCHITECT, AgentRole.DESIGNER].includes(role)
  }

  /**
   * Продолжить после human review
   */
  async resumeAfterReview(): Promise<void> {
    if (this.state.status === "paused") {
      this.state.status = "running"
    }
  }

  /**
   * Вызов AI-агента (заглушка для демонстрации)
   * В продакшене здесь будет вызов LangChain/LangGraph
   */
  private async callAgent(name: string, input: string): Promise<string> {
    // Имитация задержки AI-вызова
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    return `[${name}] обработал запрос:\n${input.slice(0, 100)}...\n\nРезультат: Анализ выполнен успешно.`
  }

  /**
   * Получить текущее состояние оркестратора
   */
  getState(): OrchestratorState {
    return { ...this.state }
  }

  /**
   * Сохранить в долгосрочную память (RAG)
   */
  async saveToLongTermMemory(key: string, value: string): Promise<void> {
    this.state.memory.longTerm.set(key, value)
    // В продакшене — сохранение в pgvector
  }

  /**
   * Поиск в долгосрочной памяти (RAG)
   */
  async searchLongTermMemory(query: string): Promise<string[]> {
    const results: string[] = []
    for (const [key, value] of this.state.memory.longTerm) {
      if (key.includes(query) || value.includes(query)) {
        results.push(value)
      }
    }
    return results
  }

  /**
   * Сброс оркестратора
   */
  reset(): void {
    this.state = {
      project: null,
      chain: null,
      agents: this.initializeAgents(),
      currentStep: 0,
      status: "idle",
      error: null,
      memory: {
        shortTerm: new Map(),
        longTerm: new Map(),
      },
    }
  }
}

// Синглтон для использования во всём приложении
export const orchestrator = new AgentOrchestrator()