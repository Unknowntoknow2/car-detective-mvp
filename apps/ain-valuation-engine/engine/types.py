
from pydantic import BaseModel, Field, validator
from typing import Optional, List

class ValuationInput(BaseModel):
	year: int = Field(..., ge=1980, le=2100)
	make: str
	model: str
	trim: Optional[str] = None
	body_style: Optional[str] = None
	drivetrain: Optional[str] = None
	fuel_type: Optional[str] = None
	zip: str
	mileage: int = Field(..., ge=0, le=500000)
	age_years: float = Field(..., ge=0, le=50)
	comp_count: int = Field(..., ge=0, le=50)
	comp_mean: float
	comp_median: float
	condition_score: float = Field(..., ge=0, le=1)
	owners: int = Field(..., ge=0, le=10)
	accidents: int = Field(..., ge=0, le=10)
	title_brand_flags: int = Field(..., ge=0, le=10)
	options_count: int = Field(..., ge=0, le=100)
	region_bucket: Optional[str] = None
	completeness: float = Field(..., ge=0, le=1)

	@validator('make', 'model', 'zip')
	def not_empty(cls, v):
		if not v or not v.strip():
			raise ValueError('Field must not be empty')
		return v

class ValuationOutput(BaseModel):
	value: float
	range_low: float
	range_high: float
	confidence: float
	method: str
	model_version: Optional[str] = None
	top_factors: Optional[List[str]] = None
	explanation: Optional[str] = None
