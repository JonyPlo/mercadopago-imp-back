import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { MercadoPagoConfig, Preference } from 'mercadopago'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

//! El token que almacenamos en la constante 'client' es el access token del vendedor, no del comprador
const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN })

app.post('/create_preference', async (req, res) => {
  const body = {
    items: [
      {
        title: req.body.title,
        quantity: Number(req.body.quantity),
        unit_price: Number(req.body.price),
        currency_id: 'ARS',
      },
    ],
    back_urls: {
      success: 'http://localhost:5173/',
      failure: 'http://localhost:5173/',
      pending: 'http://localhost:5173/',
    },
    auto_return: 'approved',
  }

  try {
    const preference = await new Preference(client).create({ body })
    res.json({ redirectUrl: preference.init_point })
  } catch (error) {
    res.json(error)
  }
})

app.listen(port, () => {
  console.log('Servidor corriendo en el puerto:', port)
})
