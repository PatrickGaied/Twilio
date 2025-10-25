(function() {
  // This script runs immediately to prevent FOUC (Flash of Unstyled Content)
  try {
    var theme = localStorage.getItem('theme')
    var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (theme === 'dark' || (!theme && systemPrefersDark)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  } catch (e) {
    // If localStorage is not available, just use light mode
    console.warn('Theme script error:', e)
  }
})()