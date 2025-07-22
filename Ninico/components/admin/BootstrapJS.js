'use client'
import { useEffect } from 'react'

function BootstrapJS() {
  useEffect(() => {
    // Dynamically import Bootstrap JS only on client side
    const loadBootstrap = async () => {
      if (typeof window !== 'undefined') {
        await import('bootstrap/dist/js/bootstrap.bundle.min.js')
      }
    }
    loadBootstrap()
  }, [])

  return null
}

export default BootstrapJS
