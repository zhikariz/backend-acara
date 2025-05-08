// dev-server.ts
import { app } from './src/index'

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Dev server running on http://localhost:${PORT}`)
})
