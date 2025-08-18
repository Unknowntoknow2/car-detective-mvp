# app/routes/inventory.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import asyncpg
from typing import List, Optional

router = APIRouter(prefix="/inventory", tags=["inventory"])

class InventoryItem(BaseModel):
    id: str
    name: str
    category: str
    role: str
    tier: str
    status: str
    owner: str
    last_verified_utc: str
    weight_in_valuation: Optional[str] = None

async def get_conn():
    return await asyncpg.connect(os.environ["DATABASE_URL"])

@router.get("/", response_model=List[InventoryItem])
async def list_inventory(status: Optional[str] = None, tier: Optional[str] = None):
    q = "select id, name, category, role, tier, status, owner, last_verified_utc, coalesce(weight_in_valuation,'N/A') as weight_in_valuation from tech_inventory"
    filters = []
    args = []
    if status:
        filters.append("status = $1")
        args.append(status)
    if tier:
        filters.append(f"tier = ${len(args)+1}")
        args.append(tier)
    if filters:
        q += " where " + " and ".join(filters)
    q += " order by name"
    conn = await get_conn()
    rows = await conn.fetch(q, *args)
    await conn.close()
    return [InventoryItem(**dict(r)) for r in rows]
