// import React from 'react'

const Loading = () => {
  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-xl z-50 text-3xl text-white"
      style={{ zIndex: 9999 }}
      role="status"
      aria-live="polite"
    >
      <p className="animate-pulse">Loading...</p>
    </div>
  )
}

export default Loading
