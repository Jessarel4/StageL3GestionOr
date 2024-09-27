<?php

namespace App\Http\Controllers;

use App\Models\Collecteur;
use App\Models\Comptoir;
use App\Models\Orpailleur;
use App\Models\Production;
use App\Models\Registrecollecteur;
use App\Models\Registreorpailleur;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    //
    public function index()
    {
        $orpailleurTransactions = Registreorpailleur::with('orpailleur', 'collecteur')->get()->map(function ($transaction) {
            return [
                'id' => $transaction->id,
                'date' => $transaction->date,
                'type' => 'vente',
                'quantite' => $transaction->quantite,
                'prix' => $transaction->prix,
                'orpailleurId' => $transaction->orpailleurId,
                'collecteurId' => $transaction->collecteurId,
                'orpailleurNom' => $transaction->orpailleur->nom,  // Nom de l'orpailleur
                'orpailleurPrenom' => $transaction->orpailleur->prenom,
                'collecteurNom' => $transaction->collecteur->nom, // Nom du collecteur
                'collecteurPrenom' => $transaction->collecteur->prenom,
            ];
        });

        $collecteurTransactions = Registrecollecteur::with('collecteur', 'comptoir')->get()->map(function ($transaction) {
            return [
                'id' => $transaction->id,
                'date' => $transaction->date,
                'type' => 'vente',
                'quantite' => $transaction->quantite,
                'prix' => $transaction->prix,
                'collecteurId' => $transaction->collecteurId,
                'comptoirId' => $transaction->comptoirId,
                'collecteurNom' => $transaction->collecteur->nom, // Nom du c
                'collecteurPrenom' => $transaction->collecteur->prenom,
                'comptoirNomSociete' => $transaction->comptoir->nomSociete,
            ];
        });
        $productionTransactions = Production::with('orpailleur')->get()->map(function ($transaction) {
            return [
                'id' => $transaction->id,
                'date' => $transaction->dateProduction, // Assurez-vous d'utiliser la bonne date
                'type' => 'extraction', // Vous pouvez changer le type si nécessaire
                'quantite' => $transaction->quantite,
                'orpailleurId' => $transaction->orpailleurId,
                'orpailleurNom' => $transaction->orpailleur->nom,  // Nom de l'orpailleur
                'orpailleurPrenom' => $transaction->orpailleur->prenom,
            ];
        });

        // return response()->json($orpailleurTransactions->merge($collecteurTransactions));
        // Fusionner toutes les transactions
        $allTransactions = $orpailleurTransactions->merge($collecteurTransactions)->merge($productionTransactions);

        return response()->json($allTransactions);
    }
    public function getStatistics()
    {
        // Nombre total d'orpailleurs, collecteurs, et comptoirs
        $totalOrpailleurs = Orpailleur::count();
        $totalCollecteurs = Collecteur::count();
        $totalComptoirs = Comptoir::count();

        // Quantité totale d'or extrait, vendu, et stocké
        $totalOrExtrait = Production::sum('quantite');
        $totalOrVenduOrpailleur = Registreorpailleur::sum('quantite');
        $totalOrVenduCollecteur = Registrecollecteur::sum('quantite');

        // Regrouper les statistiques
        $statistics = [
            'nombreOrpailleurs' => $totalOrpailleurs,
            'nombreCollecteurs' => $totalCollecteurs,
            'nombreComptoirs' => $totalComptoirs,
            'quantiteTotalExtrait' => $totalOrExtrait + 0,
            'quantiteTotalVendu' => $totalOrVenduOrpailleur + $totalOrVenduCollecteur,
            // Vous pouvez ajouter d'autres statistiques ici si nécessaire
        ];

        return response()->json($statistics);
    }
    public function statistiquerecent()
    {
        // Récupérer les transactions des orpailleurs avec les relations nécessaires
        $orpailleurTransactions = Registreorpailleur::with('orpailleur', 'collecteur')->get()->map(function ($transaction) {
            return [
                'id' => $transaction->id,
                'date' => $transaction->date,
                'type' => 'vente',
                'quantite' => $transaction->quantite,
                'prix' => $transaction->prix,
                'orpailleurId' => $transaction->orpailleurId,
                'collecteurId' => $transaction->collecteurId,
                'orpailleurNom' => $transaction->orpailleur->nom,  // Nom de l'orpailleur
                'orpailleurPrenom' => $transaction->orpailleur->prenom,
                'collecteurNom' => $transaction->collecteur->nom, // Nom du collecteur
                'collecteurPrenom' => $transaction->collecteur->prenom,
            ];
        });

        // Récupérer les transactions des collecteurs avec les relations nécessaires
        $collecteurTransactions = Registrecollecteur::with('collecteur', 'comptoir')->get()->map(function ($transaction) {
            return [
                'id' => $transaction->id,
                'date' => $transaction->date,
                'type' => 'vente',
                'quantite' => $transaction->quantite,
                'prix' => $transaction->prix,
                'collecteurId' => $transaction->collecteurId,
                'comptoirId' => $transaction->comptoirId,
                'collecteurNom' => $transaction->collecteur->nom, // Nom du collecteur
                'collecteurPrenom' => $transaction->collecteur->prenom,
                'comptoirNomSociete' => $transaction->comptoir->nomSociete,
            ];
        });

        // Récupérer les transactions de production avec les relations nécessaires
        $productionTransactions = Production::with('orpailleur')->get()->map(function ($transaction) {
            return [
                'id' => $transaction->id,
                'date' => $transaction->dateProduction, // Assurez-vous d'utiliser la bonne date
                'type' => 'extraction', // Vous pouvez changer le type si nécessaire
                'quantite' => $transaction->quantite,
                'orpailleurId' => $transaction->orpailleurId,
                'orpailleurNom' => $transaction->orpailleur->nom,  // Nom de l'orpailleur
                'orpailleurPrenom' => $transaction->orpailleur->prenom,
            ];
        });

        // Fusionner toutes les transactions
        $allTransactions = $orpailleurTransactions
                            ->merge($collecteurTransactions)
                            ->merge($productionTransactions);

        // Trier par date de manière décroissante et limiter à 10 transactions
        $recentTransactions = $allTransactions
                                ->sortByDesc('date')
                                ->take(10);

        // Retourner la réponse en JSON
        return response()->json($recentTransactions);
    }



}
