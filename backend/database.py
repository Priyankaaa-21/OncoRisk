"""
Database configuration and SQLite SQLAlchemy models for OncoRisk.
Handles User authentication data, Assessment histories, and privacy deletions.
"""

import os
import json
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, "oncorisk.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    assessments = relationship("Assessment", back_populates="user", cascade="all, delete-orphan")


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    cancer_type = Column(String(50), nullable=False, index=True)
    risk_percentage = Column(Float, nullable=False)
    risk_category = Column(String(20), nullable=False)  # "Low", "Moderate", "High"
    confidence_level = Column(Float, nullable=False)
    algorithm_used = Column(String(50), nullable=False)

    # Serialized JSON blobs
    inputs_data = Column(Text, nullable=False)
    contributing_factors = Column(Text, nullable=False)
    recommendations = Column(Text, nullable=False)
    explanation_en = Column(Text, nullable=True)
    explanation_hi = Column(Text, nullable=True)

    has_consented = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="assessments")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)
