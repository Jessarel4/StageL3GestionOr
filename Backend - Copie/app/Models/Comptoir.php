<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Comptoir
 * 
 * @property int $id
 * @property string $nomSociete
 * @property string $adresse
 * @property string $nifStat
 * @property Carbon $dateOuverture
 * @property string $directeur
 * @property string $validation
 * @property int $stockComptoir
 * @property string $arrete
 * @property int|null $compteId
 * 
 * @property Compte|null $compte
 * @property Collection|Registrecollecteur[] $registrecollecteurs
 * @property Collection|Registrecomptoir[] $registrecomptoirs
 *
 * @package App\Models
 */
class Comptoir extends Model
{
	protected $table = 'comptoir';
	public $timestamps = false;

	protected $casts = [
		'dateOuverture' => 'datetime',
		'stockComptoir' => 'int',
		'compteId' => 'int'
	];

	protected $fillable = [
		'nomSociete',
		'adresse',
		'nifStat',
		'dateOuverture',
		'directeur',
		'validation',
		'stockComptoir',
		'arrete',
		'compteId'
	];

	public function compte()
	{
		return $this->belongsTo(Compte::class, 'compteId');
	}

	public function registrecollecteurs()
	{
		return $this->hasMany(Registrecollecteur::class, 'comptoirId');
	}

	public function registrecomptoirs()
	{
		return $this->hasMany(Registrecomptoir::class, 'comptoirId');
	}
}
