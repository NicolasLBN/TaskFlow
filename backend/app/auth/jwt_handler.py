import jwt
from datetime import datetime, timedelta, timezone

# Secret key used to sign the JWT tokens
SECRET_KEY = "YOUR_SECRET_KEY"
# Algorithm used for encoding the JWT
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: timedelta = None):
    """
    Create a JWT access token with an expiration time.

    Args:
        data (dict): The payload data to encode in the token.
        expires_delta (timedelta, optional): The time duration until the token expires.
                                             Defaults to 15 minutes if not provided.

    Returns:
        str: The encoded JWT token as a string.
    """
    to_encode = data.copy()  # Copy the data to avoid mutating the original
    # Set the expiration time using a timezone-aware UTC datetime
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})  # Add expiration to the payload
    # Encode the token with the secret key and algorithm
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt