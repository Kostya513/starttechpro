/**
 * Структурированное логирование для пакета orchestrator
 *
 * Уровни:
 * - info: стандартные операции (создание, деплой, списание)
 * - warn: предупреждения (низкий баланс, повторные попытки)
 * - error: ошибки (падение API, недоступность сервиса)
 * - debug: детальная отладочная информация
 */

export type LogLevel = "info" | "warn" | "error" | "debug"

export interface LogEntry {
  level: LogLevel
  module: string
  action: string
  message: string
  metadata?: Record<string, unknown>
  timestamp: string
}

/**
 * Структурированный логгер
 * В production: отправляет логи в Sentry / DataDog / ELK
 * В development: выводит в консоль с цветовой кодировкой
 */
export function log(level: LogLevel, module: string, action: string, message: string, metadata?: Record<string, unknown>): void {
  const entry: LogEntry = {
    level,
    module,
    action,
    message,
    metadata,
    timestamp: new Date().toISOString(),
  }

  // В production: отправка в Sentry / DataDog
  if (process.env.NODE_ENV === "production") {
    // TODO: интеграция с внешним логгером
    // Sentry.captureMessage(JSON.stringify(entry), level === "error" ? "error" : "info")
  }

  // В development: цветной вывод
  const prefix = `[${entry.timestamp}] [${level.toUpperCase()}] [${module}]`
  switch (level) {
    case "error":
      console.error(`${prefix} ${action}: ${message}`, metadata || "")
      break
    case "warn":
      console.warn(`${prefix} ${action}: ${message}`, metadata || "")
      break
    case "debug":
      console.debug(`${prefix} ${action}: ${message}`, metadata || "")
      break
    default:
      console.log(`${prefix} ${action}: ${message}`, metadata || "")
  }
}

// Удобные обёртки
export const logger = {
  info: (module: string, action: string, message: string, metadata?: Record<string, unknown>) =>
    log("info", module, action, message, metadata),
  warn: (module: string, action: string, message: string, metadata?: Record<string, unknown>) =>
    log("warn", module, action, message, metadata),
  error: (module: string, action: string, message: string, metadata?: Record<string, unknown>) =>
    log("error", module, action, message, metadata),
  debug: (module: string, action: string, message: string, metadata?: Record<string, unknown>) =>
    log("debug", module, action, message, metadata),
}