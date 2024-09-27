<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Production
 *
 * @property int $id
 * @property Carbon $dateProduction
 * @property int $quantite
 * @property int|null $orpailleurId
 *
 * @property Orpailleur|null $orpailleur
 *
 * @package App\Models
 */
class Production extends Model
{
	protected $table = 'production';
	public $timestamps = false;

	protected $casts = [
		'dateProduction' => 'datetime',
		'quantite' => 'int',
		'orpailleurId' => 'int'
	];

	protected $fillable = [
		'dateProduction',
		'quantite',
		'orpailleurId'
	];

	public function orpailleur()
	{
		return $this->belongsTo(Orpailleur::class, 'orpailleurId');
	}
}
