@extends('documents.layout')
@section('titre', 'ATTESTATION DE TRAVAIL')
@section('contenu')
  <p>La Direction de <strong>NEW BRAIN FACTORY</strong> atteste que :</p>
  <p><strong>{{ $e->utilisateur->nom }} {{ $e->utilisateur->prenom }}</strong> (matricule {{ $e->matricule }})
     est employé(e) au sein de notre entreprise au poste de
     <strong>{{ $e->contratActif->poste->libelle ?? '—' }}</strong>,
     département {{ $e->departement->libelle ?? '—' }},
     depuis le {{ \Carbon\Carbon::parse($e->date_embauche)->format('d/m/Y') }}.</p>
  <p>Cette attestation est délivrée pour servir et valoir ce que de droit.</p>
@endsection