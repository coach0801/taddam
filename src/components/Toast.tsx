'use client'
import { createContext, useContext, useState, useCallback } from 'react'
import { Check, X, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const remove = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl shadow-xl text-sm font-medium pointer-events-auto
              ${toast.type === 'success' ? 'bg-success-600 text-white' :
                toast.type === 'error' ? 'bg-red-600 text-white' :
                'bg-brand-700 text-white'}`}
            style={{ animation: 'toastIn 0.25s ease-out' }}
          >
            <span className="flex-shrink-0">
              {toast.type === 'success' ? <Check size={15} /> :
               toast.type === 'error' ? <X size={15} /> :
               <Info size={15} />}
            </span>
            <span>{toast.message}</span>
            <button
              onClick={() => remove(toast.id)}
              className="ml-1 opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
