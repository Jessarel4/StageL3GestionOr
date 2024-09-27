<?php

namespace App\Http\Controllers;

use App\Models\Collecteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CollecteurControleur extends Controller
{
    public function listeCollecteur(){
        $data = Collecteur::all();
        return response()->json($data);
    }

    //
    public function ajouter_collecteur(Request $request){
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
            // 'file2' => 'required|file|mimes:jpeg,png,jpg,pdf',
            'stockCollecteur' => 'required|numeric',
            'communeId' => 'required|exists:commune,id',
        ]);
        // Gérer l'upload de l'image
        if ($request->hasFile('file')) {
            $image = $request->file('file');
            $imageName = time().'_'.$image->getClientOriginalName();
            $image->move(public_path('uploads/collecteur/img'), $imageName);
            $validated['photo'] = '/uploads/collecteur/img/' . $imageName;
        }

        // Gérer l'upload du fichier
        if ($request->hasFile('file2')) {
            $file = $request->file('file2');
            $fileName = time().'_'.$file->getClientOriginalName();
            $file->move(public_path('uploads/collecteur/attestation'), $fileName);
            
            // Vérifier le type de fichier
            $fileType = $file->getClientMimeType();
            if (strstr($fileType, 'image/')) {
                $validated['attestation'] = '/uploads/collecteur/attestation/' . $fileName;
            } elseif (strstr($fileType, 'pdf')) {
                $validated['attestation'] = '/uploads/collecteur/attestation/' . $fileName;
            }
        }


        Collecteur::create([
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
            'attestation' => $validated['attestation'],
            'stockCollecteur' => $validated['stockCollecteur'],
            'communeId' => $validated['communeId'],
        ]);
        return response()->json(['message' => 'Orpailleur ajouté avec succès!'], 201);
    } 
    //
    public function supression_Collecteur($id)
    {
        try {
            $collecteur = Collecteur::find($id);
            if ($collecteur) {
                $collecteur->delete();
                // Supprimer la photo si elle existe
                if ($collecteur->photo) {
                    $photoPath = public_path($collecteur->photo);
                    if (file_exists($photoPath)) {
                        unlink($photoPath);
                    }
                }
                if ($collecteur->attestation) {
                    $attestationPath = public_path($collecteur->attestation);
                    if (file_exists($attestationPath)) {
                        unlink($attestationPath);
                    }
                }
                return response()->json(['success' => true, 'message' => 'collecteur supprimé avec succès'],202);
            } else {
                return response()->json(['success' => false, 'message' => 'collecteur non trouvé'], 404);
            }
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la suppression'], 500);
        }
    } 
    //modifie_Collecteur
    public function modifie_Collecteur(Request $request,$id)
    {
        try {
            //code...
            $collecteur = Collecteur::find($id);
            if ($collecteur) {
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
                    'stockCollecteur' => 'required|numeric',
                    'communeId' => 'required|exists:commune,id',
                ]);
                // Gérer l'upload de l'image
                if ($request->hasFile('file')) {
                    if ($collecteur->photo) {
                        $photoPath = public_path($collecteur->photo);
                        if (file_exists($photoPath)) {
                            unlink($photoPath);
                        }
                    }
                    $image = $request->file('file');
                    $imageName = time().'_'.$image->getClientOriginalName();
                    $image->move(public_path('uploads/collecteur/img'), $imageName);
                    $collecteur->photo = '/uploads/collecteur/img/' . $imageName;
                }
                if ($request->hasFile('file2')) {
                    if ($collecteur->attestation) {
                        $attestationPath = public_path($collecteur->attestation);
                        if (file_exists($attestationPath)) {
                            unlink($attestationPath);
                        }
                    }
                    $file = $request->file('file2');
                    $fileName = time().'_'.$file->getClientOriginalName();
                    $file->move(public_path('uploads/collecteur/attestation'), $fileName);
                    $collecteur->attestation = '/uploads/collecteur/attestation/' . $fileName;
                }
                // dd($validated);
                $collecteur->numeroIdentification = $validated['numeroIdentification'];
                $collecteur->nom = $validated['nom'];
                $collecteur->prenom = $validated['prenom'];
                $collecteur->adresse = $validated['adresse'];
                $collecteur->sexe = $validated['sexe'];
                $collecteur->cin = $validated['cin'];
                $collecteur->dateCin = $validated['dateCin'];
                $collecteur->lieuCin = $validated['lieuCin'];
                $collecteur->lieuOctroit = $validated['lieuOctroit'];
                $collecteur->dateOctroit = $validated['dateOctroit'];
                $collecteur->validateAnnee = $validated['validateAnnee'];
                $collecteur->stockCollecteur = $validated['stockCollecteur'];
                $collecteur->communeId = $validated['communeId'];
                $collecteur->save();

                return response()->json(['success' => true, 'message' => 'Collecteur mis à jour avec succès !'],202);
            } else {
                return response()->json(['success' => false, 'message' => 'Collecteur non trouvé'], 404);
            }
        } catch (\Throwable $th) {
            //throw $th;
            Log::error('Erreur lors de la mise à jour du Collecteur : ' . $th->getMessage(), [
                'exception' => $th,
            ]);

        }
    }  
}
