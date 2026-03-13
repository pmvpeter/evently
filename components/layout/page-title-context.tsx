"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

type PageTitleContextType = {
  pageTitle: string | null
  setPageTitle: (title: string | null) => void
}

const PageTitleContext = createContext<PageTitleContextType>({
  pageTitle: null,
  setPageTitle: () => {},
})

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [pageTitle, setPageTitleState] = useState<string | null>(null)
  const setPageTitle = useCallback((title: string | null) => setPageTitleState(title), [])

  return (
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </PageTitleContext.Provider>
  )
}

export function usePageTitle() {
  return useContext(PageTitleContext)
}
