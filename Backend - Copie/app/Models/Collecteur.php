<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Collecteur
 * 
 * @property int $id
 * @property string $numeroIdentification
 * @property string $nom
 * @property string $prenom
 * @property string $adresse
 * @property string $sexe
 * @property string $cin
 * @property Carbon $dateCin
 * @property string $lieuCin
 * @property string $lieuOctroit
 * @property Carbon $dateOctroit
 * @property string $validateAnnee
 * @property string $photo
 * @property string $attestation
 * @property int $stockCollecteur
 * @property int|null $communeId
 * 
 * @property Commune|null $commune
 * @property Collection|Registrecollecteur[] $registrecollecteurs
 * @property Collection|Registreorpailleur[] $registreorpailleurs
 *
 * @package App\Models
 */
class Collecteur extends Model
{
	protected $table = 'collecteurs';
	public $timestamps = false;

	protected $casts = [
		'dateCin' => 'datetime',
		'dateOctroit' => 'datetime',
		'stockCollecteur' => 'int',
		'communeId' => 'int'
	];

	protected $fillable = [
		'numeroIdentification',
		'nom',
		'prenom',
		'adresse',
		'sexe',
		'cin',
		'dateCin',
		'lieuCin',
		'lieuOctroit',
		'dateOctroit',
		'validateAnnee',
		'photo',
		'attestation',
		'stockCollecteur',
		'communeId'
	];

	public function commune()
	{
		return $this->belongsTo(Commune::class, 'communeId');
	}

	public function registrecollecteurs()
	{
		return $this->hasMany(Registrecollecteur::class, 'collecteurId');
	}

	public function registreorpailleurs()
	{
		return $this->hasMany(Registreorpailleur::class, 'collecteurId');
	}
}
