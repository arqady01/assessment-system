"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import PracticeScreen from "@/components/practice-screen"
import StandardsScreen from "@/components/standards-screen"
import CaseLibraryScreen from "@/components/case-library-screen"
import ProfileScreen from "@/components/profile-screen"
import BottomNavigation from "@/components/bottom-navigation"
import LoadingScreen from "@/components/loading-screen"

export default function Home() {
  const [activeTab, setActiveTab] = useState("practice")
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  // 如果用户未登录，这里不需要重定向，因为中间件会处理
  console.log('Current user:', user)

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  }

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  }

  const backgroundVariants = {
    initial: { scale: 1.1, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1.2, ease: "easeOut" }
    }
  }

  return (
    <main className="flex flex-col h-screen w-full max-w-full mx-auto overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-800 relative">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-indigo-100/20 to-purple-100/30"
        variants={backgroundVariants}
        initial="initial"
        animate="animate"
      />

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-xl"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-40 right-10 w-24 h-24 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-xl"
        animate={{
          y: [0, 15, 0],
          x: [0, -15, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-24 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {activeTab === "practice" && <PracticeScreen />}
            {activeTab === "standards" && <StandardsScreen />}
            {activeTab === "cases" && <CaseLibraryScreen />}
            {activeTab === "profile" && <ProfileScreen />}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  )
}

