/**
 * Brand.B — 360° Marketing Agency
 * Enterprise Node.js Production Server (Zero External Dependencies)
 * 
 * Positioning: "Build Your Brand, Grow Your Business, One Growth Partner"
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const ADMIN_KEY = process.env.ADMIN_KEY || 'brandb_admin_2026';
const MAX_PAYLOAD_SIZE = Number(process.env.MAX_PAYLOAD_SIZE || 150000); // 150KB

const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const AUDITS_FILE = path.join(DATA_DIR, 'audits.json');

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, '[]\n', 'utf8');
}
if (!fs.existsSync(AUDITS_FILE)) {
  fs.writeFileSync(AUDITS_FILE, '[]\n', 'utf8');
}

// MIME dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8'
};

// Response Helpers
function sendJson(res, statusCode, data) {
  const payload = JSON.stringify(data, null, 2);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(payload);
}

function sanitize(str, maxLen = 3000) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // strip potential HTML tags
    .trim()
    .slice(0, maxLen);
}

// Request Body Parser
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (Buffer.byteLength(raw, 'utf8') > MAX_PAYLOAD_SIZE) {
        req.destroy();
        reject({ status: 413, message: 'Payload size exceeds allowable limit.' });
      }
    });
    req.on('end', () => {
      try {
        const parsed = raw ? JSON.parse(raw) : {};
        resolve(parsed);
      } catch (err) {
        reject({ status: 400, message: 'Invalid JSON formatted body.' });
      }
    });
    req.on('error', err => reject({ status: 500, message: err.message }));
  });
}

// Storage Helpers
function readJsonArray(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

function appendRecord(filePath, record) {
  const items = readJsonArray(filePath);
  items.unshift(record);
  try {
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2) + '\n', 'utf8');
  } catch (err) {
    // If running in read-only environment like Vercel serverless, write to /tmp
    try {
      const tmpPath = path.join('/tmp', path.basename(filePath));
      const tmpItems = readJsonArray(tmpPath);
      tmpItems.unshift(record);
      fs.writeFileSync(tmpPath, JSON.stringify(tmpItems, null, 2) + '\n', 'utf8');
    } catch (e) {
      console.warn('[Storage Warning] Could not persist to disk in serverless environment:', e.message);
    }
  }
  return record;
}

// Authentication check for admin views
function isAuthorized(req, parsedUrl) {
  const authHeader = req.headers['authorization'] || '';
  const adminHeader = req.headers['x-admin-key'] || '';
  const queryKey = parsedUrl.searchParams.get('key') || '';

  if (queryKey === ADMIN_KEY || adminHeader === ADMIN_KEY) return true;
  if (authHeader.startsWith('Bearer ') && authHeader.slice(7) === ADMIN_KEY) return true;
  return false;
}

// Static File Server
function serveStaticFile(req, res) {
  const parsed = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let reqPath = decodeURIComponent(parsed.pathname);

  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  // Prevent path traversal outside PUBLIC_DIR
  const filePath = path.normalize(path.join(PUBLIC_DIR, reqPath));
  if (!filePath.startsWith(PUBLIC_DIR + path.sep) && filePath !== PUBLIC_DIR) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access Denied');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for clean client-side routing
      const fallback = path.join(PUBLIC_DIR, 'index.html');
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      });
      return fs.createReadStream(fallback).pipe(res);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isHtml = ext === '.html';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': isHtml ? 'no-cache' : 'public, max-age=86400, immutable',
      'X-Content-Type-Options': 'nosniff'
    });

    fs.createReadStream(filePath).pipe(res);
  });
}

// Primary Server Handler
const server = http.createServer(async (req, res) => {
  // Global Security Headers
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // CORS Headers for local development and file:// testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Key');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }


  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // Route 1: Health Check
  if (method === 'GET' && pathname === '/api/health') {
    return sendJson(res, 200, {
      status: 'operational',
      brand: 'Brand.B',
      tagline: 'Build Your Brand, Grow Your Business, One Growth Partner',
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    });
  }

  // Route 2: Public Stats
  if (method === 'GET' && pathname === '/api/stats') {
    const leads = readJsonArray(LEADS_FILE);
    const audits = readJsonArray(AUDITS_FILE);
    return sendJson(res, 200, {
      ok: true,
      data: {
        totalInquiries: leads.length,
        totalAuditRequests: audits.length,
        avgResponseTimeHours: 12,
        partnerRetentionRate: '98.4%'
      }
    });
  }

  // Route 3: Submit Lead Inquiry (POST /api/contact)
  if (method === 'POST' && pathname === '/api/contact') {
    try {
      const body = await parseJsonBody(req);

      // Honeypot spam trap
      if (body.lead_trap || body.website_fake) {
        return sendJson(res, 200, {
          ok: true,
          message: 'Thank you for contacting Brand.B. We will be in touch shortly.'
        });
      }

      const name = sanitize(body.name, 100);
      const email = sanitize(body.email, 120).toLowerCase();
      const phone = sanitize(body.phone, 40);
      const company = sanitize(body.company, 100);
      const service = sanitize(body.service, 100);
      const budget = sanitize(body.budget, 100);
      const message = sanitize(body.message, 3000);

      const errors = [];
      if (!name || name.length < 2) errors.push('Valid name is required.');
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email address is required.');
      if (!service) errors.push('Target service selection is required.');
      if (!message || message.length < 8) errors.push('Brief project description is required.');

      if (errors.length > 0) {
        return sendJson(res, 422, { ok: false, errors, message: errors.join(' ') });
      }

      const leadRecord = {
        id: 'LEAD-' + crypto.randomBytes(4).toString('hex').toUpperCase(),
        createdAt: new Date().toISOString(),
        name,
        email,
        phone: phone || 'Not provided',
        company: company || 'Not provided',
        service,
        budget: budget || 'Discuss during consultation',
        message,
        source: 'brand-b-website',
        clientIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
      };

      appendRecord(LEADS_FILE, leadRecord);
      console.log(`[Brand.B] New lead captured: ${leadRecord.id} (${leadRecord.name} - ${leadRecord.email})`);

      return sendJson(res, 201, {
        ok: true,
        id: leadRecord.id,
        message: 'Your inquiry has been logged with Brand.B. A growth strategist will reach out within 12 hours.'
      });
    } catch (err) {
      return sendJson(res, err.status || 500, { ok: false, message: err.message || 'Server error.' });
    }
  }

  // Route 4: Request Free 360° Brand Audit (POST /api/audit)
  if (method === 'POST' && pathname === '/api/audit') {
    try {
      const body = await parseJsonBody(req);

      // Honeypot spam trap
      if (body.company_tax_id) {
        return sendJson(res, 200, {
          ok: true,
          message: 'Thank you! Your audit has been requested.'
        });
      }

      const name = sanitize(body.name, 100);
      const email = sanitize(body.email, 120).toLowerCase();
      const phone = sanitize(body.phone, 40);
      const website = sanitize(body.website, 200);

      if (!name || !email || !phone || !website) {
        return sendJson(res, 422, {
          ok: false,
          message: 'All audit fields (name, email, phone, website/social) are required.'
        });
      }

      const auditRecord = {
        id: 'AUDIT-' + crypto.randomBytes(4).toString('hex').toUpperCase(),
        createdAt: new Date().toISOString(),
        name,
        email,
        phone,
        website,
        status: 'pending_review',
        clientIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
      };

      appendRecord(AUDITS_FILE, auditRecord);
      console.log(`[Brand.B] New audit requested: ${auditRecord.id} for ${website}`);

      return sendJson(res, 201, {
        ok: true,
        id: auditRecord.id,
        message: 'Your Free 360° Growth Audit has been prioritized. Our team will prepare the report shortly.'
      });
    } catch (err) {
      return sendJson(res, err.status || 500, { ok: false, message: err.message || 'Server error.' });
    }
  }

  // Route 5: View Leads (Admin Protected)
  if (method === 'GET' && pathname === '/api/leads') {
    if (!isAuthorized(req, parsedUrl)) {
      return sendJson(res, 401, {
        ok: false,
        message: 'Unauthorized. Provide valid admin key via ?key=brandb_admin_2026 or X-Admin-Key header.'
      });
    }

    const leads = readJsonArray(LEADS_FILE);
    return sendJson(res, 200, {
      ok: true,
      count: leads.length,
      leads
    });
  }

  // Route 6: View Audits (Admin Protected)
  if (method === 'GET' && pathname === '/api/audits') {
    if (!isAuthorized(req, parsedUrl)) {
      return sendJson(res, 401, {
        ok: false,
        message: 'Unauthorized. Provide valid admin key via ?key=brandb_admin_2026 or X-Admin-Key header.'
      });
    }

    const audits = readJsonArray(AUDITS_FILE);
    return sendJson(res, 200, {
      ok: true,
      count: audits.length,
      audits
    });
  }

  // Fallthrough: Serve Static Web Assets
  if (method === 'GET' || method === 'HEAD') {
    return serveStaticFile(req, res);
  }

  // 405 Method Not Allowed
  res.writeHead(405, { 'Allow': 'GET, POST, HEAD' });
  res.end('Method Not Allowed');
});

server.listen(PORT, HOST, () => {
  console.log('====================================================');
  console.log('  ⚡ BRAND.B — 360° MARKETING GROWTH ENGINE');
  console.log('  "Build Your Brand, Grow Your Business, One Growth Partner"');
  console.log('====================================================');
  console.log(`  > Server running at: http://${HOST}:${PORT}`);
  console.log(`  > Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`  > Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  > Admin Leads:  http://localhost:${PORT}/api/leads?key=${ADMIN_KEY}`);
  console.log('====================================================');
});

module.exports = server;
