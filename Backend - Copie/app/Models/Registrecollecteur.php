<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Registrecollecteur
 * 
 * @property int $id
 * @property Carbon $date
 * @property int $quantite
 * @property int $prix
 * @property string $lieu
 * @property int|null $comptoirId
 * @property int|null $collecteurId
 * @property int|null $agenceId
 * 
 * @property Agence|null $agence
 * @property Collecteur|null $collecteur
 * @property Comptoir|null $comptoir
 *
 * @package App\Models
 */
class Registrecollecteur extends Model
{
	protected $table = 'registrecollecteur';
	public $timestamps = false;

	protected $casts = [
		'date' => 'datetime',
		'quantite' => 'int',
		'prix' => 'int',
		'comptoirId' => 'int',
		'collecteurId' => 'int',
		'agenceId' => 'int'
	];

	protected $fillable = [
		'date',
		'quantite',
		'prix',
		'lieu',
		'comptoirId',
		'collecteurId',
		'agenceId'
	];

	public function agence()
	{
		return $this->belongsTo(Agence::class, 'agenceId');
	}

	public function collecteur()
	{
		return $this->belongsTo(Collecteur::class, 'collecteurId');
	}

	public function comptoir()
	{
		return $this->belongsTo(Comptoir::class, 'comptoirId');
	}
}
