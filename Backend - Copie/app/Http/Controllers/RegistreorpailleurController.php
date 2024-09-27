<?php

namespace App\Http\Controllers;

use App\Models\Collecteur;
use App\Models\Orpailleur;
use App\Models\Registreorpailleur;
use Illuminate\Http\Request;

class RegistreorpailleurController extends Controller
{
    //
    public function listeRegistreOrpailleur($collecteurId){
        $data = Registreorpailleur::where('collecteurId', $collecteurId)
        ->with('orpailleur')
        ->get();
        return response()->json($data);
    }

    //
    public function ajouter_Registreorpailleur(Request $request)
    {
        try {
            //code...
            $validated = $request->validate([
                'quantite' => 'required|numeric',
                'date' => 'required|date',
                'prix' => 'required|numeric',
                'orpailleurId' => 'required|exists:orpailleurs,id', // Assure-toi que l'idOrpailleur existe dans la table orpailleurs
                'collecteurId' => 'required|exists:collecteurs,id',
                'agenceId' => 'required|exists:agence,id',
            ]);

            


            // Créer une nouvelle production
            $registreorpailleur = new Registreorpailleur();
            $registreorpailleur->quantite = $validated['quantite'];
            $registreorpailleur->date = $validated['date'];
            $registreorpailleur->prix = $validated['prix'];
            $registreorpailleur->orpailleurId = $validated['orpailleurId']; // Assure-toi que la clé étrangère est correctement nommée
            $registreorpailleur->collecteurId = $validated['collecteurId']; // Assure-toi que la clé étrangère est correctement nommée
            $registreorpailleur->agenceId = $validated['agenceId']; // Assure-toi que la clé étrangère est correctement nommée
            
            $orpailleur = Orpailleur::find($validated['orpailleurId']);
            $collecteur = Collecteur::find($validated['collecteurId']);

            $orpailleurStoc = $orpailleur->stockOrpailleur;
            $collecteurStoc = $collecteur->stockCollecteur;

            $orpailleur->stockOrpailleur = $orpailleurStoc - $validated['quantite'];
            if ($orpailleur->stockOrpailleur < 0) {
                # code...
                return response()->json(['success' => false, 'message' => "Stock de l'orpailleur insuffisant. Stock restant : $orpailleurStoc"], 400);
            }
            $collecteur->stockCollecteur = $collecteurStoc + $validated['quantite'];



            $orpailleur->save();
            $collecteur->save();
            $registreorpailleur->save();
            return response()->json(['success' => true, 'message' => 'Transaction ajoutée avec succès !'], 201);
        
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => 'Transaction non valide : ' . $th->getMessage()], 400);
            //throw $th;
        }
        // Valider les données envoyées
    }
    //
    public function modifie_Registreorpailleur(Request $request,$id)
    {
        try {
            //code...
            
            $registreorpailleur = Registreorpailleur::find($id);
            if ($registreorpailleur) {
                # code...
                $validated = $request->validate([
                    'quantite' => 'required|numeric',
                    'date' => 'required|date',
                    'prix' => 'required|numeric',
                    'orpailleurId' => 'required|exists:orpailleurs,id', // Assure-toi que l'idOrpailleur existe dans la table orpailleurs
                    'collecteurId' => 'required|exists:collecteurs,id',
                    'agenceId' => 'required|exists:agence,id',
                ]);
                // Créer une nouvelle productiontaloa 
                $quantiteReegitretaloa = $registreorpailleur->quantite;
                $quantiteReegitrevao = $validated['quantite'];

                $quantitereste = $quantiteReegitrevao - $quantiteReegitretaloa;

                $registreorpailleur->quantite = $validated['quantite'];
                $registreorpailleur->date = $validated['date'];
                $registreorpailleur->prix = $validated['prix'];
                $registreorpailleur->orpailleurId = $validated['orpailleurId']; // Assure-toi que la clé étrangère est correctement nommée
                $registreorpailleur->collecteurId = $validated['collecteurId']; // Assure-toi que la clé étrangère est correctement nommée
                $registreorpailleur->agenceId = $validated['agenceId']; // Assure-toi que la clé étrangère est correctement nommée

                $orpailleur = Orpailleur::find($validated['orpailleurId']);
                $collecteur = Collecteur::find($validated['collecteurId']);

                $orpailleurStoc = $orpailleur->stockOrpailleur;
                $collecteurStoc = $collecteur->stockCollecteur;

                $orpailleur->stockOrpailleur = $orpailleurStoc - $quantitereste;
                $collecteur->stockCollecteur = $collecteurStoc + $quantitereste;



                $orpailleur->save();
                $collecteur->save();
                $registreorpailleur->save();
                return response()->json(['success' => true, 'message' => 'Transaction modifie avec succès !'],202);
            }else{
                return response()->json(['success' => false, 'message' => 'Transaction Non valide!'],400);

            }
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => 'Transaction Non valide!'],400);
            //throw $th;
        }
        // Valider les données envoyées
    }
    //
    public function supression_Registreorpailleur(Request $request,$id)
    {
        try {
            //code...
            
            $registreorpailleur = Registreorpailleur::find($id);
            if ($registreorpailleur) {
                # code...
                // Assure-toi que la clé étrangère est correctement nommée
                $registreorpailleur->delete();
                return response()->json(['success' => true, 'message' => 'Transaction Efface avec succès !'],202);
            }else{
                return response()->json(['success' => false, 'message' => 'Transaction Non valide!'],400);

            }
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => 'Transaction Non valide!'],400);
            //throw $th;
        }
        // Valider les données envoyées
    }

}
