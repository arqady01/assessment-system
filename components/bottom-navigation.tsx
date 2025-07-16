"use client"

import { BookOpen, FileText, FolderOpen, User } from "lucide-react"
import { motion } from "framer-motion"

interface BottomNavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function BottomNavigation({ activeTab, setActiveTab }: BottomNavigationProps) {
  const tabs = [
    { id: "practice", icon: BookOpen, label: "做题", color: "blue" },
    { id: "standards", icon: FileText, label: "操作规范", color: "emerald" },
    { id: "cases", icon: FolderOpen, label: "案例库", color: "blue" },
    { id: "profile", icon: User, label: "我的", color: "emerald" }
  ]

  const getColorClasses = (color: string, isActive: boolean) => {
    if (color === "blue") {
      return isActive
        ? "text-blue-500 bg-blue-50"
        : "text-gray-400 hover:text-blue-400"
    }
    return isActive
      ? "text-emerald-500 bg-emerald-50"
      : "text-gray-400 hover:text-emerald-400"
  }

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 z-20 shadow-lg"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-white to-emerald-50/30" />


      {/* Navigation Items */}
      <div className="flex items-center justify-around px-2 py-3 relative z-10">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-16 h-16 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Active Indicator - Top Bar */}
              {isActive && (
                <motion.div
                  className={`absolute -top-3 left-1/6 transform -translate-x-1/2 w-8 h-1 rounded-full ${
                    tab.color === "blue" ? "bg-blue-500" : "bg-emerald-500"
                  }`}
                  layoutId="activeIndicator"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              {/* Background Circle for Active State */}
              {isActive && (
                <motion.div
                  className={`absolute inset-0 rounde-3xl ${
                    tab.color === "blue" ? "bg-blue-50" : "bg-emerald-50"
                  }`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}

              {/* Icon Container */}
              <motion.div
                className="relative z-10 mb-1"
                animate={{
                  scale: isActive ? 1.1 : 1
                }}
                transition={{
                  type: "spring", stiffness: 300, damping: 20
                }}
              >
                <Icon className={`h-6 w-6 transition-colors duration-300 ${
                  isActive
                    ? (tab.color === "blue" ? "text-blue-600" : "text-emerald-600")
                    : "text-gray-400"
                }`} />
              </motion.div>

              {/* Label */}
              <motion.span
                className={`text-xs font-medium relative z-10 transition-colors duration-300 ${
                  isActive
                    ? (tab.color === "blue" ? "text-blue-600" : "text-emerald-600")
                    : "text-gray-400"
                }`}
                animate={{
                  opacity: isActive ? 1 : 0.8,
                  y: isActive ? 0 : 1
                }}
                transition={{ duration: 0.2 }}
              >
                {tab.label}
              </motion.span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

