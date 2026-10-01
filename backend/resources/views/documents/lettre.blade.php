@extends('documents.layout')
@section('titre', 'LETTRE DE REMERCIEMENT')
@section('contenu')
  <p>Cher(e) {{ $e->utilisateur->prenom }} {{ $e->utilisateur->nom }},</p>
  <p>Au nom de toute l'équipe de <strong>NEW BRAIN FACTORY</strong>, nous vous remercions chaleureusement
     pour votre engagement et votre contribution durant votre passage au sein de notre entreprise.</p>
  <p>Nous vous souhaitons une pleine réussite dans vos projets futurs.</p>
@endsection