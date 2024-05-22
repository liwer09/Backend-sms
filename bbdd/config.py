#Importamos SQLAlchemy para controlar la BBDD
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

#Accedemos a la BBDD
DATABASE_URL = "postgresql://user:pass@IP/BBDD"
engine = create_engine(DATABASE_URL)

#Creamos la sesion 
Session = sessionmaker(bind=engine, autoflush=False, autocommit=False)

#Declaramos la base de datos
Base = declarative_base()