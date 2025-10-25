from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    database_url: str = "sqlite:///./segmind.db"
    redis_url: str = "redis://localhost:6379"
    secret_key: str = "dev-secret-key"
    twilio_account_sid: Optional[str] = None
    twilio_auth_token: Optional[str] = None
    sendgrid_api_key: Optional[str] = None
    frontend_url: str = "http://localhost:3000"
    backend_url: str = "http://localhost:8000"

    class Config:
        env_file = ".env"

settings = Settings()