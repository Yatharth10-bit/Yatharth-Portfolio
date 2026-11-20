try {
  document.documentElement.dataset.theme = localStorage.getItem('ys-theme') === 'dark' ? 'dark' : 'light';
} catch { document.documentElement.dataset.theme = 'light'; }
