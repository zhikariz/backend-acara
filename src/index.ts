
import express from 'express'
import bodyParser from 'body-parser'
import router from './routes/api'
import db from './utils/database'
import docs from './docs/route'
import cors from 'cors'

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

export default async function handler(req: any, res: any) {
  try {
    await db()
    return app(req, res) // Pass request/response directly to Express
  } catch (err) {
    console.error("DB connection failed:", err)
    return res.status(500).json({ error: "Internal server error" })
  }
}

export { app }

