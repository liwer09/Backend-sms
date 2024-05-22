from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, Sequence
from datetime import datetime
from bbdd.config import Base


class Sms(Base):
    __tablename__ = 'sms'
    id = Column(Integer, Sequence('sms_id_seq') ,primary_key=True)
    inc = Column(String)
    group_id = Column(Integer, ForeignKey("groups.id"))
    datetime = Column(DateTime, default=datetime.now)
    status = Column(String)
    tech_group = Column(String)
    description = Column(String)
    
class Groups(Base):
    __tablename__ = 'groups'
    id = Column(Integer, Sequence('groups_id_seq'), primary_key=True)
    name = Column(String)

class Users(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True)
    name = Column(String)
    surname = Column(String)
    group_id = Column(Integer, ForeignKey("groups.id"))
    phone = Column(String)
