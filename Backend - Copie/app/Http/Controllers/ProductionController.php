<?php

namespace App\Http\Controllers;

use App\Models\Orpailleur;
use App\Models\Production;
use Illuminate\Http\Request;

class ProductionController extends Controller
{
    //
    public function ajouter_Production(Request $request)
    {
        try {
            //code...
            $validated = $request->validate([
                'quantite' => 'required|numeric',
                'dateProduction' => 'required|date',
                'orpailleurId' => 'required|exists:orpailleurs,id', // Assure-toi que l'idOrpailleur existe dans la table orpailleurs
            ]);

                


            // Créer une nouvelle production
            $production = new Production();
            $production->quantite = $validated['quantite'];
            $production->dateProduction = $validated['dateProduction'];
            $production->orpailleurId = $validated['orpailleurId']; // Assure-toi que la clé étrangère est correctement nommée
            
            $orpailleur = Orpailleur::find($validated['orpailleurId']);
            $orpailleurStoc = $orpailleur->stockOrpailleur;
            $orpailleur->stockOrpailleur = $orpailleurStoc + $validated['quantite'];
            $orpailleur->save();
            
            $production->save();

            return response()->json(['message' => 'Production ajoutée avec succès!'], 201);
        } catch (\Throwable $th) {
            //throw $th;
        }
        // Valider les données envoyées
    }
    public function listeProduction($orpailleurId){
        $data = Production::where('orpailleurId', $orpailleurId)->get();
        return response()->json($data);
    }

    public function modifie_Production(Request $request,$id)
    {
        try {
            //code...
            $production = Production::find($id);
            if ($production) {
                # code...
                $validated = $request->validate([
                    'quantite' => 'required|numeric',
                    'dateProduction' => 'required|date',
                    'orpailleurId' => 'required|exists:orpailleurs,id', // Assure-toi que l'idOrpailleur existe dans la table orpailleurs
                ]);
                $productionavant = $production->quantite;
                $production->quantite = $validated['quantite'];
                $production->dateProduction = $validated['dateProduction'];
                $production->orpailleurId = $validated['orpailleurId']; // Assure-toi que la clé étrangère est correctement nommée
                $orpailleur = Orpailleur::find($validated['orpailleurId']);
                $orpailleurStoc = $orpailleur->stockOrpailleur;
                $orpailleur->stockOrpailleur = $orpailleurStoc -( $productionavant - $validated['quantite']);
                $orpailleur->save();
                $production->save();

                return response()->json(['message' => 'Production mise a jour avec succès!'], 201);

            }else {
                return response()->json(['success' => false, 'message' => 'Production non trouvé'], 404);
            }
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['success' => false, 'message' => 'Erreur lors de la Modification'], 500);

        }
    }
    public function supression_Production($id)
    {
        try {
            //code...
            $production = Production::find($id);
            if ($production) {
                # code...
                $orpailleur = Orpailleur::find($production->orpailleurId);
                $orpailleurStoc = $orpailleur->stockOrpailleur;
                $orpailleur->stockOrpailleur = $orpailleurStoc - $production->quantite;
                $orpailleur->save();
                $production->delete();
                return response()->json(['message' => 'Production Suprimer avec succès!'], 202);

            }else {
                return response()->json(['success' => false, 'message' => 'Production non trouvé'], 404);
            }
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['success' => false, 'message' => 'Erreur lors de la Supression'], 500);

        }
    }
}
