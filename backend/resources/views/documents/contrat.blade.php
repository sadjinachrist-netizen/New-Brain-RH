@extends('documents.layout')
@section('titre', 'CONTRAT DE TRAVAIL')
@section('contenu')
  <p>Entre les soussignés :</p>
  <p><strong>NEW BRAIN FACTORY</strong>, « l'Employeur », et
     <strong>{{ $e->utilisateur->nom }} {{ $e->utilisateur->prenom }}</strong>, « l'Employé(e) ».</p>
  <table class="infos">
    <tr><td class="label">Matricule</td><td>{{ $e->matricule }}</td></tr>
    <tr><td class="label">Département</td><td>{{ $e->departement->libelle ?? '—' }}</td></tr>
    <tr><td class="label">Poste</td><td>{{ $e->contratActif->poste->libelle ?? '—' }}</td></tr>
    <tr><td class="label">Type de contrat</td><td>{{ $e->contratActif->typeContrat->libelle ?? '—' }}</td></tr>
    <tr><td class="label">Salaire mensuel</td><td>{{ number_format($e->contratActif->salaire ?? 0, 0, ',', ' ') }} FCFA</td></tr>
    <tr><td class="label">Date de début</td><td>{{ \Carbon\Carbon::parse($e->contratActif->date_debut)->format('d/m/Y') }}</td></tr>
  </table>
  <p>Le présent contrat est établi conformément aux dispositions légales en vigueur.</p>
@endsection