<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DocumentRh;
use App\Models\Employe;
use App\Models\TypeDocumentRh;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class DocumentRhController extends Controller
{
    // POST /api/employes/{employe}/documents-rh
    public function store(Request $request, Employe $employe)
    {
        $data = $request->validate([
            'type_document_rh_id' => 'required|exists:type_document_rhs,id',
        ]);

        $type = TypeDocumentRh::findOrFail($data['type_document_rh_id']);
        $employe->load('utilisateur', 'departement', 'contratActif.poste', 'contratActif.typeContrat');

        // Choix du gabarit selon le libellé du type
        $libelle = mb_strtolower($type->libelle);
        if (str_contains($libelle, 'contrat'))          $vue = 'documents.contrat';
        elseif (str_contains($libelle, 'attestation'))  $vue = 'documents.attestation';
        elseif (str_contains($libelle, 'lettre') || str_contains($libelle, 'remerciement')) $vue = 'documents.lettre';
        else                                             $vue = 'documents.generique';

        // Vérif infos obligatoires (contrat/attestation nécessitent un contrat actif)
        if (in_array($vue, ['documents.contrat', 'documents.attestation']) && ! $employe->contratActif) {
            return response()->json(['message' => "Informations manquantes : l'employé n'a pas de contrat actif (poste/salaire)."], 422);
        }

        $pdf = Pdf::loadView($vue, ['e' => $employe, 'type' => $type]);
        $fichier = 'documents_rh/' . Str::uuid() . '.pdf';
        Storage::disk('public')->put($fichier, $pdf->output());

        $doc = $employe->documentsRh()->create([
            'nom'                 => $type->libelle . ' — ' . $employe->utilisateur->nom . ' ' . $employe->utilisateur->prenom,
            'chemin_fichier'      => $fichier,
            'date_generation'     => now(),
            'type_document_rh_id' => $type->id,
        ]);

        return response()->json($doc->load('typeDocument'), 201);
    }

    // DELETE /api/documents-rh/{documentRh}
    public function destroy(DocumentRh $documentRh)
    {
        Storage::disk('public')->delete($documentRh->chemin_fichier);
        $documentRh->delete();
        return response()->json(['message' => 'Document supprimé']);
    }
}