<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DomaineController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\TypeEntretienController;
use App\Http\Controllers\Api\TypeMediaController;
use App\Http\Controllers\Api\TypeNotificationController;
use App\Http\Controllers\Api\OffreController;
use App\Http\Controllers\Api\PostulationController;
use App\Http\Controllers\Api\CandidatureController;
use App\Http\Controllers\Api\EntretienController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\UtilisateurController;
use App\Http\Controllers\Api\CandidatAuthController;
use App\Http\Controllers\Api\DepartementController;
use App\Http\Controllers\Api\PosteController;
use App\Http\Controllers\Api\TypeContratController;
use App\Http\Controllers\Api\TypeDocumentRhController;
use App\Http\Controllers\Api\EmployeController;
use App\Http\Controllers\Api\ContratController;
use App\Http\Controllers\Api\EvaluationController;
use App\Http\Controllers\Api\DocumentRhController;
use App\Http\Controllers\Api\EspaceController;
use App\Http\Controllers\Api\EmployeAuthController;
use App\Http\Controllers\Api\TypeAbsenceController;
use App\Http\Controllers\Api\DemandeAbsenceController;

/* ---------- Routes PUBLIQUES ---------- */
Route::post('/login', [AuthController::class, 'login']);

Route::post('/employe/login', [EmployeAuthController::class, 'login']);

// Postulation (côté candidat, sans connexion)
Route::get('/postuler/{lien}', [PostulationController::class, 'show']);
// Auth candidat (compte candidat)
Route::post('/candidat/register', [CandidatAuthController::class, 'register']);
Route::post('/candidat/login', [CandidatAuthController::class, 'login']);

/* ---------- Routes PROTÉGÉES (RH / DG connectés) ---------- */
Route::middleware(['auth:sanctum', 'ability:rh'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Données de référence
    Route::apiResource('domaines', DomaineController::class);
    Route::apiResource('documents', DocumentController::class);
    Route::apiResource('questions', QuestionController::class);
    Route::apiResource('types-entretiens', TypeEntretienController::class);
    Route::apiResource('types-medias', TypeMediaController::class);
    Route::apiResource('types-notifications', TypeNotificationController::class);

    Route::post('/employes/{employe}/documents-rh', [DocumentRhController::class, 'store']);
    Route::delete('/documents-rh/{documentRh}', [DocumentRhController::class, 'destroy']);

        // Références Gestion du personnel
    Route::apiResource('departements', DepartementController::class);
    Route::apiResource('postes', PosteController::class);
    Route::apiResource('type-contrats', TypeContratController::class);
    Route::apiResource('type-documents-rh', TypeDocumentRhController::class);

    Route::post('/employes/{employe}/contrats', [ContratController::class, 'store']);
    Route::delete('/contrats/{contrat}', [ContratController::class, 'destroy']);

    Route::post('/employes/{employe}/evaluations', [EvaluationController::class, 'store']);
    Route::delete('/evaluations/{evaluation}', [EvaluationController::class, 'destroy']);
        // Gestion du personnel — fiches employés
    Route::apiResource('employes', EmployeController::class);
    Route::patch('/employes/{employe}/depart', [EmployeController::class, 'depart']);

    Route::patch('/employes/{employe}/acces', [EmployeController::class, 'definirAcces']);

    // Offres
    Route::apiResource('offres', OffreController::class);

    // Candidatures
    Route::get('/offres/{offre}/candidatures', [CandidatureController::class, 'index']);
    Route::patch('/offres/{offre}/candidatures/{candidat}', [CandidatureController::class, 'update']);

    // Entretiens & classement
    Route::get('/offres/{offre}/entretiens', [EntretienController::class, 'index']);
    Route::post('/offres/{offre}/entretiens', [EntretienController::class, 'store']);
    Route::get('/offres/{offre}/classement', [EntretienController::class, 'classement']);

    Route::get('/candidatures', [CandidatureController::class, 'all']);

    Route::get('/dashboard/recrutement', [DashboardController::class, 'recrutement']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/offres/{offre}/candidatures/{candidat}/email',
    [CandidatureController::class, 'envoyerEmail']);
    Route::apiResource('utilisateurs', UtilisateurController::class)->only(['index', 'store', 'destroy']);

    Route::apiResource('type-absences', TypeAbsenceController::class);
    Route::get('/demandes-absence', [DemandeAbsenceController::class, 'index']);
    Route::patch('/demandes-absence/{demandeAbsence}', [DemandeAbsenceController::class, 'traiter']);
});

/* ---------- Routes PROTÉGÉES (candidat connecté) ---------- */
Route::middleware(['auth:sanctum', 'ability:candidat'])->group(function () {
    Route::get('/candidat/me', [CandidatAuthController::class, 'me']);
    Route::post('/candidat/logout', [CandidatAuthController::class, 'logout']);
    Route::post('/candidat/postuler/{lien}', [PostulationController::class, 'postuler']);
    Route::get('/candidat/mes-candidatures', [CandidatAuthController::class, 'mesCandidatures']);
    // (plus tard : postuler + mes candidatures)
}); 

// Liste publique des offres ouvertes
Route::get('/offres-publiques', [OffreController::class, 'publiques']);

/* ---------- Routes PROTÉGÉES (employé connecté) ---------- */
Route::middleware(['auth:sanctum', 'ability:employe'])->group(function () {
    Route::get('/employe/me', [EmployeAuthController::class, 'me']);
    Route::post('/employe/logout', [EmployeAuthController::class, 'logout']);
    Route::get('/espace/moi', [EspaceController::class, 'moi']);

    Route::get('/espace/demandes-absence', [EspaceController::class, 'mesDemandes']);
    Route::post('/espace/demandes-absence', [EspaceController::class, 'soumettreDemande']);

    Route::get('/espace/type-absences', [EspaceController::class, 'typesAbsence']);
});