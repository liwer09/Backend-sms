from fastapi import FastAPI, HTTPException, Depends
from bbdd.models import Groups, Sms, Users
from bbdd.config import engine, Session, Base
from sms.send_sms import SendSMS
import datetime
import json
import logging
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(module)s - %(funcName)s - %(message)s')
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)
logger = logging.getLogger('example_logger')
logger.addHandler(console_handler)
logger.setLevel(logging.INFO)


@app.on_event("startup")
def startup_event():
    # Esto asegura que las tablas se creen al iniciar la aplicación
    Base.metadata.create_all(bind=engine)

@app.get("/groups")
#See the groups
async def see_groups():
    db = Session()
    data = db.query(Groups).all()
    db.close()
    return(data)

@app.post("/groups")
async def Add_group(name : str):
    db = Session()
    group = Groups(name = name)
    try:
        db.add(group)
        db.commit()
        db.refresh(group)
        return(group)
    finally:
        db.close()

@app.get("/groups/{id}")
async def see_group(id : int):
    db = Session()
    group = db.query(Groups).filter(Groups.id == id).first()
    db.close()
    return(group)

@app.put("/groups/{id}")
async def Modify_group(id : int, name : str):
    db = Session()
    update = db.query(Groups).filter(Groups.id == id).first()
    if update:
        update.name = name
        db.commit()
        db.refresh(update)
        db.close()
        return(update)
    else:
        db.close()

@app.delete("/groups/{id}")
async def Delete_group(id : int):
    db = Session()
    to_delete = db.query(Groups).filter(Groups.id == id).first()
    if to_delete:
        db.delete(to_delete)
        db.commit()
        raise HTTPException(status_code=201, detail="Group is deleted.")
    else:
        raise HTTPException(status_code=404, detail="Group doesn't exist.")
    
@app.post("/users")
async def Create_user(name: str, surname: str, group_id: int, phone: str, id: str):
    db = Session()
    user = Users(name = name, surname = surname, group_id = group_id, phone = phone, id = id)
    try:
        db.add(user)
        db.commit()
        # db.refresh(user)
        db.close()
        return user
    except:
        db.close()
        raise HTTPException(status_code=404, detail="Data is not correctly formatted.")

@app.get("/users")
async def Get_users():
    db = Session()
    users = db.query(Users).all()
    return users
    raise HTTPException(status_code=200, detail=users)

@app.get("/users/{username}")
async def Get_user(username : str):
    db = Session()
    user = db.query(Users).filter(Users.id == username).first()
    if user:
        db.close()
        return user
    else:
        db.close()
        raise HTTPException(status_code=404, detail="The user doesn't exist.")
    
@app.put("/users/{id}")
async def Modify_user(id : str, name: str, surname: str, group_id: int, phone: str):
    db = Session()
    user = db.query(Users).filter(Users.id == id).first()
    if user:
        if len(name) > 2:
            user.name = name
        if len(surname) > 2:
            user.surname = surname
        if group_id > 0:
            user.group_id = group_id
        if len(phone) > 4:
            user.phone = phone
        db.commit()
        db.refresh(user)
        db.close()
        return user
    else:
        raise HTTPException(status_code=404, detail="The user doesn't exist.")
        
@app.delete("/users/{username}")
async def Delete_user(username : str):
    db = Session()
    user = db.query(Users).filter(Users.id == username).first()
    if user:
        db.delete(user)
        db.commit()
        db.close()
        raise HTTPException(status_code=200, detail="User deleted.")
    else:
        raise HTTPException(status_code=404, detail="User doesn't exist.")
    
@app.post("/sms/send")
async def send_sms(inc : str, message: str, group_name : str, resolutor_group: str, status: str):
    telefonos = ""
    body = f'{inc} - {status}\nGrupo asignado: {resolutor_group}\nPais afectado: {group_name}\nDescription: {message}'
    db = Session()
    if "," in group_name:
        array_group = group_name.split(",")
        for i in array_group:
            id_group = db.query(Groups).filter(Groups.name == i).first()
            phones = db.query(Users).filter(Users.group_id == id_group.id).all()
            for a in phones:
                telefonos = f"{a.phone}, {telefonos} "
    else:
        id_group = db.query(Groups).filter(Groups.name == group_name).first()
        phones = db.query(Users).filter(Users.group_id == id_group.id).all()
        for a in phones:
            telefonos = f"{a.phone}, {telefonos} "
    result = SendSMS(telefonos, body)
    if ("200" in str(result)):
        logger.info(f'{inc}: message sended, ID transaction: {result[1]}')
    else:
        logger.critical(f'{inc}: message not sended, request status code:{result[0]}, text returned in request: {result[1]}')
        raise HTTPException(status_code=404, detail=f"the sms can't sended. Response of server: {result[1]}")
    sms = Sms(inc = inc, group_id = id_group, status = status, tech_group = resolutor_group, description = message)
    try:
        db.add(sms)
        db.commit()
        db.refresh(sms)
        db.close()
        logger.info(f'{inc}: Updated sms sended in database')
        raise HTTPException(status_code=201, detail=sms)
    except:
        db.close()
        logger.warn(f'{inc}: Error to save sms sended in database')
        raise HTTPException(status_code=404, detail="Data is not correctly formatted.")
    
@app.get("/sms")
async def get_sms():
    db = Session()
    sms = db.query(Sms).all()
    db.close()
    return(sms)
    

@app.get("/sms/{inc}")
async def get_specifics_sms(inc : str):
    db = Session()
    sms = db.query(Sms).filter(Sms.inc == inc).all()
    if sms:
        db.close()
        return(sms)
    else:
        db.close()
        raise HTTPException(status_code=404, detail="The incident number doesn't exist with sended sms.")