
import express from 'express'
import bodyParser from 'body-parser'
import router from './routes/api'
import db from './utils/database'
import docs from './docs/route'
import cors from 'cors'
import { NowRequest, NowResponse } from '@vercel/node'
import response from './utils/response'

// Prepare app
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use('/api', router)
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Server is running',
  })
})
docs(app)

// Run DB connection once and reuse
let isDBConnected = false
async function ensureDBConnection() {
  if (!isDBConnected) {
    await db()
    isDBConnected = true
  }
}

// ✅ Export for Vercel
export default async function handler(req: NowRequest, res: NowResponse) {
  try {
    await ensureDBConnection()

    return new Promise<void>((resolve, reject) => {
      app(req, res, (err: any) => {
        if (err) {
          console.error(err)
          response.error(res, err, "Internal Server Error")
          return reject(err)
        }
        return resolve()
      })
    })
  } catch (error) {
    console.error("Top-level handler error:", error)
    response.error(res, error, "Internal Server Error")
  }
}

export { app }

