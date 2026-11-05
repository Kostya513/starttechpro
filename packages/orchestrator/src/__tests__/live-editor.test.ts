/**
 * Тесты для Live Editor
 *
 * Проверяют:
 * - createCommit: создание коммита
 * - compareCommits: сравнение версий
 * - getABTestRecommendation: рекомендации A/B тестов
 */

import { createCommit, compareCommits, getABTestRecommendation } from "./live-editor"
import type { EditCommit } from "./live-editor"

describe("LiveEditor", () => {
  describe("createCommit", () => {
    it("должен создавать коммит с корректными полями", () => {
      const commit = createCommit({
        projectId: "proj_123",
        title: "Тестовый коммит",
        description: "Описание изменений",
        files: [
          {
            path: "src/index.ts",
            type: "modify",
            diff: "--- a\n+++ b\n@@ -1 +1 @@\n-old\n+new",
            content: "new content",
          },
        ],
        ragContext: {
          userRequest: "Изменить файл",
          aiRationale: "Нужно обновить",
          relevantHistory: [],
        },
      })

      expect(commit.id).toBeDefined()
      expect(commit.projectId).toBe("proj_123")
      expect(commit.title).toBe("Тестовый коммит")
      expect(commit.status).toBe("draft")
      expect(commit.author).toBe("user")
      expect(commit.files).toHaveLength(1)
    })

    it("должен устанавливать автора по умолчанию", () => {
      const commit = createCommit({
        projectId: "proj_123",
        title: "Test",
        description: "",
        files: [],
        ragContext: { userRequest: "", aiRationale: "", relevantHistory: [] },
      })
      expect(commit.author).toBe("user")
    })

    it("должен принимать кастомного автора", () => {
      const commit = createCommit({
        projectId: "proj_123",
        title: "Test",
        description: "",
        files: [],
        ragContext: { userRequest: "", aiRationale: "", relevantHistory: [] },
        author: "ai-agent",
        agentName: "Разработчик",
      })
      expect(commit.author).toBe("ai-agent")
      expect(commit.agentName).toBe("Разработчик")
    })
  })

  describe("compareCommits", () => {
    const baseCommit: EditCommit = {
      id: "1",
      projectId: "proj_123",
      parentId: null,
      branch: "main",
      author: "user",
      timestamp: new Date().toISOString(),
      title: "Base",
      description: "",
      files: [
        { path: "a.ts", type: "create", diff: "", content: "a" },
        { path: "b.ts", type: "create", diff: "", content: "b" },
      ],
      ragContext: { userRequest: "", aiRationale: "", relevantHistory: [] },
      status: "merged",
    }

    it("должен находить добавленные файлы", () => {
      const newCommit: EditCommit = {
        ...baseCommit,
        id: "2",
        files: [
          ...baseCommit.files,
          { path: "c.ts", type: "create", diff: "", content: "c" },
        ],
      }

      const changes = compareCommits(baseCommit, newCommit)
      const added = changes.filter((c) => c.type === "added")
      expect(added).toHaveLength(1)
      expect(added[0].file).toBe("c.ts")
    })

    it("должен находить удалённые файлы", () => {
      const newCommit: EditCommit = {
        ...baseCommit,
        id: "2",
        files: baseCommit.files.slice(0, 1),
      }

      const changes = compareCommits(baseCommit, newCommit)
      const removed = changes.filter((c) => c.type === "removed")
      expect(removed).toHaveLength(1)
      expect(removed[0].file).toBe("b.ts")
    })

    it("должен находить изменённые файлы", () => {
      const newCommit: EditCommit = {
        ...baseCommit,
        id: "2",
        files: [
          { ...baseCommit.files[0], content: "modified" },
          baseCommit.files[1],
        ],
      }

      const changes = compareCommits(baseCommit, newCommit)
      const modified = changes.filter((c) => c.type === "modified")
      expect(modified).toHaveLength(1)
      expect(modified[0].file).toBe("a.ts")
    })
  })

  describe("getABTestRecommendation", () => {
    it("должен возвращать рекомендацию с победителем", () => {
      const rec = getABTestRecommendation("test_123")
      expect(rec.winner).toBe("variant-b")
      expect(rec.confidence).toBeGreaterThan(90)
      expect(rec.metrics.conversionRate).toBeDefined()
    })
  })
})