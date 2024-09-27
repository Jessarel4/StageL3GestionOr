<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class District
 * 
 * @property int $id
 * @property string $nomDistrict
 * @property int|null $regionId
 * 
 * @property Region|null $region
 * @property Collection|Commune[] $communes
 *
 * @package App\Models
 */
class District extends Model
{
	protected $table = 'district';
	public $timestamps = false;

	protected $casts = [
		'regionId' => 'int'
	];

	protected $fillable = [
		'nomDistrict',
		'regionId'
	];

	public function region()
	{
		return $this->belongsTo(Region::class, 'regionId');
	}

	public function communes()
	{
		return $this->hasMany(Commune::class, 'districtId');
	}
}
