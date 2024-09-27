<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Region
 * 
 * @property int $id
 * @property string $nomRegion
 * @property int|null $provinceId
 * 
 * @property Province|null $province
 * @property Collection|District[] $districts
 *
 * @package App\Models
 */
class Region extends Model
{
	protected $table = 'region';
	public $timestamps = false;

	protected $casts = [
		'provinceId' => 'int'
	];

	protected $fillable = [
		'nomRegion',
		'provinceId'
	];

	public function province()
	{
		return $this->belongsTo(Province::class, 'provinceId');
	}

	public function districts()
	{
		return $this->hasMany(District::class, 'regionId');
	}
}
