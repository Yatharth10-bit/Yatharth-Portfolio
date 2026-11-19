try { document.documentElement.dataset.theme = localStorage.getItem('ys-theme') === 'light' ? 'light' : 'dark'; } catch { /* The default palette also works without storage. */ }

