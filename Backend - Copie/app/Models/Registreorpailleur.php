<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Registreorpailleur
 * 
 * @property int $id
 * @property Carbon $date
 * @property int $quantite
 * @property int $prix
 * @property string $lieu
 * @property int|null $orpailleurId
 * @property int|null $collecteurId
 * @property int|null $agenceId
 * 
 * @property Agence|null $agence
 * @property Collecteur|null $collecteur
 * @property Orpailleur|null $orpailleur
 *
 * @package App\Models
 */
class Registreorpailleur extends Model
{
	protected $table = 'registreorpailleur';
	public $timestamps = false;

	protected $casts = [
		'date' => 'datetime',
		'quantite' => 'int',
		'prix' => 'int',
		'orpailleurId' => 'int',
		'collecteurId' => 'int',
		'agenceId' => 'int'
	];

	protected $fillable = [
		'date',
		'quantite',
		'prix',
		'lieu',
		'orpailleurId',
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

	public function orpailleur()
	{
		return $this->belongsTo(Orpailleur::class, 'orpailleurId');
	}
}
