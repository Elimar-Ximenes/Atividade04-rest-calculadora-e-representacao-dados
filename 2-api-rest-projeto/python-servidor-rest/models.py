from pydantic import BaseModel

class FavoriteRequest(BaseModel):
    code: str
    comment: str | None = None  # comentário opcional

class UpdateFavoriteRequest(BaseModel):
    comment: str | None = None

class Country(BaseModel):
    name: str
    code: str
    region: str
    flag: str

class VoteResponse(BaseModel):
    country: str
    votes: int

class ErrorResponse(BaseModel):
    error: str
