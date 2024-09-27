<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Anor
 * 
 * @property int $id
 * @property string $nomResponsable
 * @property string $adresseResponsable
 * @property string $cinResponsable
 * @property string $contactResponsable
 * @property int|null $compteId
 * 
 * @property Compte|null $compte
 * @property Collection|Registrecomptoir[] $registrecomptoirs
 *
 * @package App\Models
 */
class Anor extends Model
{
	protected $table = 'anor';
	public $timestamps = false;

	protected $casts = [
		'compteId' => 'int'
	];

	protected $fillable = [
		'nomResponsable',
		'adresseResponsable',
		'cinResponsable',
		'contactResponsable',
		'compteId'
	];

	public function compte()
	{
		return $this->belongsTo(Compte::class, 'compteId');
	}

	public function registrecomptoirs()
	{
		return $this->hasMany(Registrecomptoir::class, 'anorId');
	}
}
