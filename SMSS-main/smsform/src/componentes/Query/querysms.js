import axios from "axios";


const getsms = async () => {
  try{
    const response = await axios.get('https://localhost/sms/');
    return response.data;
  } catch(error) {

  };
};

const smsticket = async (name) => {
  try{
    const response = await axios.get(`https://localhost/sms/` + name);
    return response.data;
  } catch(error) {

  };
};

const sendsms = async (value) => {
  try {
    const response = await axios.post(`https://localhost/sms/send?inc=${value[0]}&message=${value[4]}&group_name=${value[1]}&resolutor_group=${value[2]}&status=${value[3]}`);
    const status = response.status;
    const data = response.data;
    return {status, data};
  } catch (error) {

  }
};

export {getsms, smsticket, sendsms};