// Estilos
import Col from 'react-bootstrap/Col';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { useSnackbar } from 'notistack';
// Componentes
import { SelectorGrupoNoti, SelectorGrupoAsign, SelectorState } from '../Selects/Selects';

//Query - POST
import { sendsms } from '../Query/querysms';

export default function Formulario(props) {
  // Declaro constantes de estado y alerta
  const [selectNotiGroup, setSelectNotiGroup] = useState({ value: "" });
  const [selectGroupAsign, setSelectGroupAsign] = useState("");
  const [selectState, setSelectState] = useState({ value: "" }); 
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(null);
  const { enqueueSnackbar } = useSnackbar()
  // Funcion para crear las alertas
  const showNotification = async (message, variant) => {
    enqueueSnackbar(message, { variant });
  };
  // Funcion de envios de SMS - Envio datos a la query de POST de sms
  const handleSendSMS = async () => {
    const values = [
      props.name,
      selectNotiGroup.value,
      selectGroupAsign,
      selectState.value,
      description
    ];

    try {
      const mensaje = await sendsms(values);
      setStatus(mensaje.status);
      if (status === 200) {
        showNotification("SMS enviado con éxito!", 'success');
      } else {
        showNotification("Error al enviar el SMS", 'error');
      }
    } catch (error) {
      showNotification("Error al enviar el SMS", 'error');
    }
  };

  // Componente frontend - Selectores, TextArea, Botones
  return (
    <Form className='SendSmsForm'>
      <h1 className='INC'>Nº {props.name}</h1>
      <Row className='Desplegable'>
        <Col>
          <Form.Label>Grupo de Notificación</Form.Label>
          <SelectorGrupoNoti id='GroupNoti' Seleccion={setSelectNotiGroup} />
        </Col>
        <Col>
          <Form.Label>Grupos Implicados</Form.Label>
          <SelectorGrupoAsign id='GroupAsign' Seleccion={setSelectGroupAsign} />
        </Col>
      </Row>
      <Row className='Desplegable'>
        <Col />
        <Col>
          <Form.Label>Estado</Form.Label>
          <SelectorState id='State' Seleccion={setSelectState} />
        </Col>
      </Row>
      <Row>
        <Col className='Descripcion'>
          <Form.Label>Descripción</Form.Label>
          <Form.Control as="textarea" rows={3} className="FormDesc" id='FormInfo' onChange={(e) => setDescription(e.target.value)}/>
        </Col>
      </Row>
      <Button className='Botones' variant="secondary" onClick={() => handleSendSMS()}>Enviar</Button>
      <Button className='Botones' type='restart' variant="secondary">Cancelar</Button>
    </Form>
  );
}
