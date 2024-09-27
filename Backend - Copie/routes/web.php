<?php

use App\Http\Controllers\AgenceController;
use Illuminate\Http\Request;
use App\Http\Controllers\CompteController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\OrpailleurController;
use App\Http\Controllers\CollecteurControleur;
use App\Http\Controllers\ComptoirController;
use App\Http\Controllers\ProductionController;
use App\Http\Controllers\RegistreorpailleurController;
use App\Http\Controllers\TransactionController;
// use App\Http\Controllers\WelcomController;
use App\Models\Collecteur;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
*/

// Route::get('/', function () {
//     return view('welcome');
// });
/*etudian debut */
/**token */
Route::get('/csrf-token', function () {
    return response()->json(['csrfToken' => csrf_token()]);
});
Route::options('/{any}', function () {
    return response()->json([]);
})->where('any', '.*');
/**token */
    // Route::get('/update-client/{id}', [EtudiantController::class,'update_etudiant'])->middleware('auth');



    Route::get('/listecompte',[CompteController::class,'listecompte']);
    Route::post('/api/ajoutcompte',[CompteController::class,'ajouter_compte']);
    Route::post('/api/connexion',[CompteController::class,'connexion']);
    Route::post('/api/mdpOublier',[CompteController::class,'mdpOublier']);
    Route::post('/api/modifiecompte/{id}',[CompteController::class,'modifie_compte']);
    Route::post('/supressioncompte/{id}',[CompteController::class,'supression_compte']);

    /**location comune */
    Route::get('/api/locations', [LocationController::class, 'index']);
    /**agence */
    Route::get('/api/listeAgence', [AgenceController::class, 'listeAgence']);


    /**Orpailleur */
    Route::post('/api/ajoutOrpailleur',[OrpailleurController::class,'ajouter_orpailleur']);
    Route::get('/api/listeOrpailleur',[OrpailleurController::class,'listeOrpailleur']);
    Route::get('/api/listeOrpailleurIdnom',[OrpailleurController::class,'listeOrpailleurIdnom']);
    Route::post('api/supressionOrpailleur/{id}',[OrpailleurController::class,'supression_Orpailleur']);
    Route::post('/api/modifieOrpailleur/{id}',[OrpailleurController::class,'modifie_Orpailleur']);
        /** Production orpailleur */
        Route::post('/api/ajoutProduction',[ProductionController::class,'ajouter_Production']);
        Route::get('/api/listeProduction/{orpailleurId}',[ProductionController::class,'listeProduction']);
        Route::post('/api/modifieProduction/{id}',[ProductionController::class,'modifie_Production']);
        Route::post('/api/supressionProduction/{id}',[ProductionController::class,'supression_Production']);

    /*Collecteur */
    Route::post('/api/ajoutCollecteur',[CollecteurControleur::class,'ajouter_collecteur']);
    Route::get('/api/listeCollecteur',[CollecteurControleur::class,'listeCollecteur']);
    Route::post('/api/modifieCollecteur/{id}',[CollecteurControleur::class,'modifie_Collecteur']);
    Route::post('api/supressionCollecteur/{id}',[CollecteurControleur::class,'supression_Collecteur']);
    
    /**Regitreorpailleur et collecteur */
    Route::get('/api/listeRegistreorpailleur/{collecteurId}',[RegistreorpailleurController::class,'listeRegistreOrpailleur']);
    // Route::get('/api/listeRegistreorpailleur',[RegistreorpailleurController::class,'listeRegistreOrpailleur']);
    Route::post('/api/ajoutRegistreorpailleur',[RegistreorpailleurController::class,'ajouter_RegistreOrpailleur']);
    Route::post('/api/modifieRegistreorpailleur/{id}',[RegistreorpailleurController::class,'modifie_Registreorpailleur']);
    Route::post('/api/supressionRegistreorpailleur/{id}',[RegistreorpailleurController::class,'supression_Registreorpailleur']);
    
    
    /**comptoire */
    Route::post('/api/ajoutComptoire',[ComptoirController::class,'ajouter_comptoir']);

    /**Transaction */
    Route::get('/api/transactions', [TransactionController::class, 'index']);

    /**Statistique */
    Route::get('/api/statistics', [TransactionController::class, 'getStatistics']);


    Route::get('api/ip', function (Request $request) {
        $ip = $request->ip();
        return response()->json(['ip' => $ip]);
    });
    Route::get('api/server-ip', function () {
        $host = getHostByName(getHostName());
        return response()->json(['server_ip' => $host]);
    });    
    