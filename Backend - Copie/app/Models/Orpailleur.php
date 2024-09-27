<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Orpailleur
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
 * @property int $stockOrpailleur
 * @property int|null $communeId
 * 
 * @property Commune|null $commune
 * @property Collection|Production[] $productions
 * @property Collection|Registreorpailleur[] $registreorpailleurs
 *
 * @package App\Models
 */
class Orpailleur extends Model
{
	protected $table = 'orpailleurs';
	public $timestamps = false;

	protected $casts = [
		'dateCin' => 'datetime',
		'dateOctroit' => 'datetime',
		'stockOrpailleur' => 'int',
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
		'stockOrpailleur',
		'communeId'
	];

	public function commune()
	{
		return $this->belongsTo(Commune::class, 'communeId');
	}

	public function productions()
	{
		return $this->hasMany(Production::class, 'orpailleurId');
	}

	public function registreorpailleurs()
	{
		return $this->hasMany(Registreorpailleur::class, 'orpailleurId');
	}
}
