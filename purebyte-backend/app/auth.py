import jwt
from fastapi import Header, HTTPException
from app.config import JWT_SECRET, JWT_ALGORITHM


def get_current_user(authorization: str = Header(None)) -> dict:
    """
    Expects: Authorization: Bearer <token>
    The token must be the SAME JWT your Node.js login/register endpoints
    issue (same secret + algorithm), so a user who logs in through your
    existing auth flow can call this Python service without logging in again.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Adjust this key to match whatever field your Node JWT payload uses
    # (e.g. "id", "_id", "userId", "sub").
    user_id = payload.get("id") or payload.get("_id") or payload.get("userId") or payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token missing user id")

    return {"id": str(user_id), "raw": payload}
