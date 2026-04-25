import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import AnalyzePage from './pages/AnalyzePage'
import HistoryPage from './pages/HistoryPage'
import InsightsPage from './pages/InsightsPage'
import { usePurchases } from './hooks/usePurchases'

export default function App() {
  const [activeTab, setActiveTab] = useState('analyze')
  const { purchases, addPurchase, updateOutcome, clearAll } = usePurchases()

  return (
    <div style={styles.shell}>
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        purchases={purchases}
      />
      <div style={styles.main}>
        <Topbar activeTab={activeTab} onTabChange={setActiveTab} />
        <div style={styles.content}>
          {activeTab === 'analyze' && (
            <AnalyzePage purchases={purchases} onAdd={addPurchase} />
          )}
          {activeTab === 'history' && (
            <HistoryPage
              purchases={purchases}
              onUpdateOutcome={updateOutcome}
              onClearAll={clearAll}
            />
          )}
          {activeTab === 'insights' && (
            <InsightsPage purchases={purchases} />
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  shell: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    background: 'var(--bg)',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minWidth: 0,
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px 32px',
  },
}
