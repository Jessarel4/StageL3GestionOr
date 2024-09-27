<?php

namespace App\Http\Controllers;

use App\Models\Orpailleur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OrpailleurController extends Controller
{
    //
    public function listeOrpailleur(){
        $data = Orpailleur::all();
        return response()->json($data);
    }
    //
    public function listeOrpailleurIdnom(){
        $orpailleur = Orpailleur::all();

        $data = $orpailleur->map(function  ($orpailleur){
            return [
                'value' => $orpailleur->id,
                'label' => $orpailleur->nom." ".$orpailleur->prenom,
            ];
        });
        return response()->json($data);
    }
    
    //
    public function ajouter_orpailleur(Request $request){
        $validated = $request->validate([
            'numeroIdentification' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'adresse' => 'required|string|max:255',
            'sexe' => 'required|string|in:Homme,Femme',
            'cin' => 'required|string|max:255',
            'dateCin' => 'required|date',
            'lieuCin' => 'required|string|max:255',
            'lieuOctroit' => 'required|string|max:255',
            'dateOctroit' => 'required|date',
            'validateAnnee' => 'required|string|max:4',
            'file' => 'required|image|max:2048',
            'stockOrpailleur' => 'required|numeric',
            'communeId' => 'required|exists:commune,id',
        ]);
        // Gérer l'upload de l'image
        if ($request->hasFile('file')) {
            $image = $request->file('file');
            $imageName = time().'_'.$image->getClientOriginalName();
            $image->move(public_path('uploads/orpailleurs'), $imageName);
            $validated['photo'] = '/uploads/orpailleurs/' . $imageName;
        }

        Orpailleur::create([
            'numeroIdentification' => $validated['numeroIdentification'],
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'],
            'adresse' => $validated['adresse'],
            'sexe' => $validated['sexe'],
            'cin' => $validated['cin'],
            'dateCin' => $validated['dateCin'],
            'lieuCin' => $validated['lieuCin'],
            'lieuOctroit' => $validated['lieuOctroit'],
            'dateOctroit' => $validated['dateOctroit'],
            'validateAnnee' => $validated['validateAnnee'],
            'photo' => $validated['photo'],
            'stockOrpailleur' => $validated['stockOrpailleur'],
            'communeId' => $validated['communeId'],
        ]);
        return response()->json(['message' => 'Orpailleur ajouté avec succès!'], 201);
    }
    //
    public function supression_Orpailleur($id)
    {
        try {
            $orpailleur = Orpailleur::find($id);
            if ($orpailleur) {
                $orpailleur->delete();
                // Supprimer la photo si elle existe
                if ($orpailleur->photo) {
                    $photoPath = public_path($orpailleur->photo);
                    if (file_exists($photoPath)) {
                        unlink($photoPath);
                    }
                }
                return response()->json(['success' => true, 'message' => 'orpailleur supprimé avec succès'],202);
            } else {
                return response()->json(['success' => false, 'message' => 'orpailleur non trouvé'], 404);
            }
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la suppression'], 500);
        }
    }
    //modifie_Orpailleur
    public function modifie_Orpailleur(Request $request,$id)
    {
        try {
            //code...
            $orpailleur = Orpailleur::find($id);
            if ($orpailleur) {
                $validated = $request->validate([
                    'numeroIdentification' => 'required|string|max:255',
                    'nom' => 'required|string|max:255',
                    'prenom' => 'required|string|max:255',
                    'adresse' => 'required|string|max:255',
                    'sexe' => 'required|string|in:Homme,Femme',
                    'cin' => 'required|string|max:255',
                    'dateCin' => 'required|date',
                    'lieuCin' => 'required|string|max:255',
                    'lieuOctroit' => 'required|string|max:255',
                    'dateOctroit' => 'required|date',
                    'validateAnnee' => 'required|string|max:4',
                    // 'file' => 'required|image|max:2048',
                    'stockOrpailleur' => 'required|numeric',
                    'communeId' => 'required|exists:commune,id',
                ]);
                // Gérer l'upload de l'image
                if ($request->hasFile('file')) {
                    if ($orpailleur->photo) {
                        $photoPath = public_path($orpailleur->photo);
                        if (file_exists($photoPath)) {
                            unlink($photoPath);
                        }
                    }
                    $image = $request->file('file');
                    $imageName = time().'_'.$image->getClientOriginalName();
                    $image->move(public_path('uploads/orpailleurs'), $imageName);
                    $orpailleur->photo = '/uploads/orpailleurs/' . $imageName;
                }
                // dd($validated);
                $orpailleur->numeroIdentification = $validated['numeroIdentification'];
                $orpailleur->nom = $validated['nom'];
                $orpailleur->prenom = $validated['prenom'];
                $orpailleur->adresse = $validated['adresse'];
                $orpailleur->sexe = $validated['sexe'];
                $orpailleur->cin = $validated['cin'];
                $orpailleur->dateCin = $validated['dateCin'];
                $orpailleur->lieuCin = $validated['lieuCin'];
                $orpailleur->lieuOctroit = $validated['lieuOctroit'];
                $orpailleur->dateOctroit = $validated['dateOctroit'];
                $orpailleur->validateAnnee = $validated['validateAnnee'];
                $orpailleur->stockOrpailleur = $validated['stockOrpailleur'];
                $orpailleur->communeId = $validated['communeId'];
                $orpailleur->save();

                return response()->json(['success' => true, 'message' => 'orpailleur mis à jour avec succès !'],202);
            } else {
                return response()->json(['success' => false, 'message' => 'orpailleur non trouvé'], 404);
            }
        } catch (\Throwable $th) {
            //throw $th;
            Log::error('Erreur lors de la mise à jour de l\'orpailleur : ' . $th->getMessage(), [
                'exception' => $th,
            ]);

        }
    }

}
