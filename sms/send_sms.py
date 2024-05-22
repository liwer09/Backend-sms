import requests

from requests.packages.urllib3.exceptions import InsecureRequestWarning

def SendSMS(number, message):
    try:
        requests.packages.urllib3.disable_warnings(InsecureRequestWarning)
        parameters = [('to', f'{number}'),('text',f'{message}'), ('user',''),('pass','')]
        request = requests.get("https://sms.itsoft.es/RedBoxSwitch/cxfservices/httpapi/Send", params=parameters, verify=False)
        return(request.status_code, request.text)
    except:
        return("404","request can't sended")
    