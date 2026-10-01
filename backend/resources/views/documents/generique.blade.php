@extends('documents.layout')
@section('titre', strtoupper($type->libelle))
@section('contenu')
  <p>Employé : <strong>{{ $e->utilisateur->nom }} {{ $e->utilisateur->prenom }}</strong> (matricule {{ $e->matricule }})</p>
  <p>Département : {{ $e->departement->libelle ?? '—' }}</p>
@endsection