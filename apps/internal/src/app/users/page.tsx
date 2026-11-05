"use client"

export default function UsersPage() {
  const users = [
    { name: "Иван Петров", email: "ivan@example.com", plan: "Pro", projects: 3, status: "Активен", registered: "01.03.2025" },
    { name: "ООО ТехноПрогресс", email: "info@techpro.ru", plan: "Enterprise", projects: 5, status: "Активен", registered: "15.01.2025" },
    { name: "Анна Смирнова", email: "anna@example.com", plan: "Starter", projects: 1, status: "Активен", registered: "10.04.2025" },
    { name: "Сергей Козлов", email: "sergey@example.com", plan: "Pro", projects: 2, status: "Просрочка", registered: "20.02.2025" },
    { name: "Мария Иванова", email: "maria@example.com", plan: "Starter", projects: 1, status: "Активен", registered: "05.05.2025" },
    { name: "ООО Инновация", email: "info@innovation.ru", plan: "Enterprise", projects: 4, status: "Активен", registered: "01.12.2024" },
    { name: "Дмитрий Новиков", email: "dmitry@example.com", plan: "Pro", projects: 2, status: "Заблокирован", registered: "15.03.2025" },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Пользователи</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Поиск..."
            className="glass rounded-lg px-3 py-1.5 text-xs text-[#FAFAFA] placeholder:text-[#FAFAFA]/30 focus:outline-none focus:ring-1 focus:ring-[#7E2FE0]/50"
          />
          <button className="gradient-neon rounded-lg px-4 py-1.5 text-xs font-bold text-white neon-border transition-all hover:opacity-90">
            + Пригласить
          </button>
        </div>
      </div>

      <div className="glass rounded-xl neon-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#7E2FE0]/20">
                <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Имя</th>
                <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Email</th>
                <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Тариф</th>
                <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Проекты</th>
                <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Статус</th>
                <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Регистрация</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={i} className="border-b border-[#7E2FE0]/10 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-sm text-[#FAFAFA]">{user.name}</td>
                  <td className="px-4 py-3 text-xs text-[#FAFAFA]/60">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      user.plan === "Enterprise" ? "bg-[#D4AF37]/20 text-[#D4AF37]" :
                      user.plan === "Pro" ? "bg-[#7E2FE0]/20 text-[#7E2FE0]" :
                      "bg-[#3498db]/20 text-[#3498db]"
                    }`}>{user.plan}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#FAFAFA]/60">{user.projects}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      user.status === "Активен" ? "bg-[#40E0D0]/20 text-[#40E0D0]" :
                      user.status === "Просрочка" ? "bg-[#D4AF37]/20 text-[#D4AF37]" :
                      "bg-red-500/20 text-red-400"
                    }`}>{user.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#FAFAFA]/40">{user.registered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}