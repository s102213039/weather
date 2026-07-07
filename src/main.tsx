import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const base = import.meta.env.BASE_URL
document.documentElement.style.setProperty(
  '--cloud-pattern',
  `url(${base}assets/cloud/jumbotron_pattern.png)`,
)
document.documentElement.style.setProperty(
  '--cloud-l1',
  `url(${base}assets/cloud/jumbotron_cloud_pattern_l1.png)`,
)
document.documentElement.style.setProperty(
  '--cloud-l2',
  `url(${base}assets/cloud/jumbotron_cloud_pattern_l2.png)`,
)
document.documentElement.style.setProperty(
  '--cloud-band',
  `url(${base}assets/cloud/jumbotron_cloud.png)`,
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
