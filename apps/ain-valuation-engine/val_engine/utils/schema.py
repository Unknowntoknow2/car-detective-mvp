from pydantic import BaseModel, Field, validator
from typing import Optional, Literal

ConditionLiteral = Literal["poor","fair","good","very_good","excellent"]
TitleLiteral = Literal["clean","salvage","rebuilt","flood","lemon","theft","lien","junk","unknown"]

from datetime import date

class VehicleDataForValuation(BaseModel):
    vin: str
    mileage: int = Field(ge=0, le=600_000)
    zip: str = Field(min_length=5, max_length=10)
    condition: ConditionLiteral
    mode: Literal["buy","sell"] = "sell"

    # Optional enrichments
    title_status: Optional[TitleLiteral] = "unknown"
    accidents: Optional[int] = Field(default=None, ge=0)
    owners: Optional[int] = Field(default=None, ge=0)
    fuel_type: Optional[str] = None  # fallback to VIN decode
    in_service_date: Optional[date] = None
    warranty_basic_months: Optional[int] = 36
    warranty_powertrain_months: Optional[int] = 60
    warranty_basic_miles: Optional[int] = 36000
    warranty_powertrain_miles: Optional[int] = 60000

    @validator("zip")
    def _zip_digits(cls, v):
        d = "".join(ch for ch in v if ch.isdigit())
        if len(d) < 5:
            raise ValueError("zip must contain at least 5 digits")
        return d[:5]

def normalize_condition_to_score(c: ConditionLiteral) -> int:
    order = {"poor":1, "fair":2, "good":3, "very_good":4, "excellent":5}
    return order[c]

def normalize_title(ts: Optional[str]) -> TitleLiteral:
    if not ts: return "unknown"
    s = ts.strip().lower()
    if "clean" in s: return "clean"
    if "salvage" in s: return "salvage"
    if "rebuilt" in s or "rebuild" in s: return "rebuilt"
    if "flood" in s: return "flood"
    if "lemon" in s: return "lemon"
    if "theft" in s: return "theft"
    if "lien" in s: return "lien"
    if "junk" in s: return "junk"
    return "unknown"
