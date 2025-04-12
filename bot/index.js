const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const cors = require('cors');
const puppeteer = require('puppeteer-core');


const app = express();
app.use(cors()); // <-- aqui já libera geral
app.use(express.json());

let qrCodeData = null;
let clientReady = false;

// Status constantes
const STATUS = {
    AUTHENTICATED: 'authenticated',
    QR: 'qr',
    WAITING: 'waiting',
    DISCONNECTED: 'disconnected',
};

// Criação do client WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: '/usr/bin/google-chrome',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors'  // Ignorar erros de certificado
        ],
    }
});

// Eventos do client
client.on('qr', (qr) => {
    console.log('[QR RECEIVED]');
    qrCodeData = qr;
    clientReady = false;
});

client.on('ready', () => {
    console.log('[Client is ready]');
    clientReady = true;
    qrCodeData = null; // QR não é mais necessário
});

client.on('authenticated', () => {
    console.log('[Client authenticated]');
    clientReady = false; // Ainda não está "ready", só autenticado
});

client.on('disconnected', () => {
    console.log('[Client disconnected]');
    clientReady = false;
    qrCodeData = null;
});

client.initialize();

// Endpoint para status + QR Code (unificado)
app.get('/qr', async (req, res) => {
    if (clientReady) {
        return res.status(200).json({ status: STATUS.AUTHENTICATED, qr: null });
    }

    if (qrCodeData) {
        const qrImage = await qrcode.toDataURL(qrCodeData);
        return res.status(200).json({ status: STATUS.QR, qr: qrImage });
    }

    return res.status(200).json({ status: STATUS.WAITING, qr: null });
});

// Endpoint simples de status
app.get('/status', (req, res) => {
    res.status(200).json({ connected: clientReady });
});

// Envio de mensagens
app.post('/send-message', async (req, res) => {
    const { message } = req.body;

    if (!clientReady) {
        return res.status(400).json({ error: 'Client not ready' });
    }

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const fixedNumber = '5522981013352@c.us'; // Número fixo
    console.log(message)
    try {
        console.log("[Sending message]", message)
        const sentMessage = await client.sendMessage(fixedNumber, message);
        res.status(200).json({ status: 'success', id: sentMessage.id._serialized });
    } catch (err) {
        console.error('[Send error]', err);
        res.status(500).json({ status: 'error', error: err.message });
    }
});

// Inicia o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
