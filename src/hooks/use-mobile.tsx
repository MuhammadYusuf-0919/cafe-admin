
import * as React from "react"

export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => {
      setMatches(mql.matches)
    }
    
    mql.addEventListener("change", onChange)
    setMatches(mql.matches)
    
    return () => mql.removeEventListener("change", onChange)
  }, [query])

  return !!matches
}

// Add specific media query hooks for different device sizes
export function useIsMobile() {
  return useMediaQuery("(max-width: 640px)")
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 641px) and (max-width: 1024px)")
}

export function useIsMobileOrTablet() {
  return useMediaQuery("(max-width: 1024px)")
}