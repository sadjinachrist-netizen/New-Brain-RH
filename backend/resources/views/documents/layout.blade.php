<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #1f2937; }
    .entete { text-align: center; border-bottom: 2px solid #1E3A8A; padding-bottom: 10px; margin-bottom: 24px; }
    .entete h1 { color: #1E3A8A; margin: 0; font-size: 20px; }
    .entete p { margin: 2px 0; font-size: 11px; color: #6b7280; }
    .titre { text-align: center; font-size: 16px; font-weight: bold; text-decoration: underline; margin: 24px 0; }
    .contenu { line-height: 1.7; }
    table.infos { width: 100%; border-collapse: collapse; margin: 16px 0; }
    table.infos td { padding: 6px 8px; border: 1px solid #e5e7eb; }
    table.infos td.label { background: #f9fafb; font-weight: bold; width: 40%; }
    .signature { margin-top: 60px; text-align: right; }
  </style>
</head>
<body>
  <div class="entete">
    <h1>NEW BRAIN FACTORY</h1>
    <p>Agbalépédo — Tél : 93 29 22 48 — newbrain02@gmail.com</p>
  </div>
  <div class="titre">@yield('titre')</div>
  <div class="contenu">@yield('contenu')</div>
  <div class="signature">
    <p>Fait à Lomé, le {{ now()->format('d/m/Y') }}</p>
    <p>La Direction</p>
  </div>
</body>
</html>