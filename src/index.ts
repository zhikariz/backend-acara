import express from 'express'
import bodyParser from 'body-parser'
import router from './routes/api'
import db from './utils/database'
import docs from './docs/route'
import cors from 'cors'
import serverless from '@vendia/serverless-express'

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
    data: null,
  });
});

app.use('/api', router)
docs(app)

const init = async () => {
  try {
    const result = await db()
    console.log("Database Status : ", result)
  } catch (error) {
    console.error("Database connection error:", error)
  }
}

// Initialize DB connection before exporting the handler
init()

// Export handler for Vercel
export default serverless({ app })

export { app } // <-- Add this for local dev
