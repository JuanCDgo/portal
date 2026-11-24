import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

function runCmd(cmd) {
  const start = Date.now();
  try {
    const out = execSync(cmd, { cwd: ROOT, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { ok: true, durationMs: Date.now() - start, output: out.trim() };
  } catch (err) {
    return {
      ok: false,
      durationMs: Date.now() - start,
      output: ((err.stdout || '') + '\n' + (err.stderr || '')).trim(),
      status: err.status ?? 1,
    };
  }
}

function scanSecrets(dir, findings = []) {
  if (!fs.existsSync(dir)) return findings;
  const patterns = [
    { name: 'Private Key Block', regex: /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/ },
    { name: 'Google API Key hardcodeada', regex: /AIza[0-9A-Za-z\-_]{35}/ },
    { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/ },
    { name: 'Token / Secret literal sospechoso', regex: /(api[_-]?key|secret|password|token)\s*[:=]\s*['"][A-Za-z0-9_\-]{20,}['"]/i },
  ];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', 'release', '.git', 'qa-torture'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanSecrets(full, findings);
    } else if (/\.(ts|tsx|js|jsx|mjs|cjs|json|html)$/.test(entry.name)) {
      const content = fs.readFileSync(full, 'utf-8');
      const lines = content.split(/\r?\n/);
      lines.forEach((line, idx) => {
        for (const p of patterns) {
          if (p.regex.test(line)) {
            findings.push({
              file: path.relative(ROOT, full),
              line: idx + 1,
              type: p.name,
            });
          }
        }
      });
    }
  }
  return findings;
}

export function runStaticAudit() {
  const results = {
    layer: 'Capa 1 — Salud Estática, Build y Seguridad',
    checks: [],
    passed: true,
  };

  if (fs.existsSync(path.join(ROOT, 'tsconfig.json'))) {
    const tsc = runCmd('npx tsc --noEmit');
    results.checks.push({
      name: 'TypeScript (tsc --noEmit)',
      ok: tsc.ok,
      durationMs: tsc.durationMs,
      details: tsc.ok ? 'Sin errores de tipado.' : tsc.output.slice(0, 1500),
    });
    if (!tsc.ok) results.passed = false;
  }

  const build = runCmd('npm run build');
  results.checks.push({
    name: 'Build de producción (npm run build)',
    ok: build.ok,
    durationMs: build.durationMs,
    details: build.ok ? 'Compilado correctamente.' : build.output.slice(0, 1500),
  });
  if (!build.ok) results.passed = false;

  const auditRaw = runCmd('npm audit --omit=dev --json');
  let auditOk = true;
  let auditDetails = 'Sin vulnerabilidades críticas/altas en dependencias de producción.';
  try {
    const parsed = JSON.parse(auditRaw.output || '{}');
    const vuln = parsed?.metadata?.vulnerabilities || {};
    const high = vuln.high || 0;
    const critical = vuln.critical || 0;
    const moderate = vuln.moderate || 0;
    if (high > 0 || critical > 0) {
      auditOk = false;
      auditDetails = `Vulnerabilidades en producción: ${critical} críticas, ${high} altas, ${moderate} moderadas.`;
    } else if (moderate > 0) {
      auditDetails = `0 críticas, 0 altas (${moderate} moderadas).`;
    }
  } catch {
    auditDetails = 'No se pudo parsear salida JSON de npm audit.';
  }
  results.checks.push({
    name: 'Auditoría de dependencias (npm audit --omit=dev)',
    ok: auditOk,
    durationMs: auditRaw.durationMs,
    details: auditDetails,
  });
  if (!auditOk) results.passed = false;

  const secrets = [
    ...scanSecrets(path.join(ROOT, 'src')),
    ...scanSecrets(path.join(ROOT, 'electron')),
  ];
  const secretsOk = secrets.length === 0;
  results.checks.push({
    name: 'Escaneo de secretos hardcodeados (src/ y electron/)',
    ok: secretsOk,
    durationMs: 0,
    details: secretsOk
      ? 'No se detectaron credenciales hardcodeadas.'
      : secrets.map((s) => `${s.file}:${s.line} (${s.type})`).join('\n'),
  });
  if (!secretsOk) results.passed = false;

  return results;
}
