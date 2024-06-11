import { useState } from 'react';
// Estilos
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
// Componentes
import Formulario from '../Form/Form';
import HistoryTableSms from '../History/HistorySmsSingle';
// Query
import { smsticket } from '../Query/querysms'; // Assuming `smsticket` fetches data

export function FirstScreen() {
  // Declaro estados
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [showForm, setShowForm] = useState(false);
  // Filtro el textarea para darle formato INC*******
  function validateINC(value) {
    const regex = /^INC\d{7}$/;
    return regex.test(value);
  }
  // Funcion para habilitar el boton en caso de que cumpla con el formato
  function handleInputChange(event) {
    setName(event.target.value);
    const isValid = validateINC(event.target.value);
    document.getElementById('button').disabled = !isValid;
  }
  // Funcion para que si el resultado del GET es true, me devuelva unos estados u otros
  async function handleButtonClick() {
    try {
      const result = await smsticket(name);
      // Handle successful data fetching
      if (result) {
        setStatus("allow");
        setShowForm(true);
      } else {
        // Handle 404 error
        setStatus("404");
      }
    } catch (error) {

    }

    document.getElementById('busqueda').style.visibility = 'hidden';
  }

  return (
    <Form className='Formulario'>
      <Row className='Buscador'>
        <Col id='busqueda'>
          <Form.Label>Nº INC</Form.Label>
          <Form.Control
            id='ticket'
            type="text"
            placeholder="INC0000000"
            value={name}
            onChange={handleInputChange}
          />
          <Button
            id='button'
            disabled={!validateINC(name)}
            onClick={handleButtonClick}
            className='FirstPageButton'
            variant="secondary"
            type='button'
          >
            Cargar
          </Button>
        </Col>

      </Row>
      {status === "allow" && showForm && (    // Si existe la INC me muestra formulario y tabla
        <Row>
          <div className='PrincipalForm'>
            <Formulario name={name} />
            <HistoryTableSms name={name} />
          </div>
        </Row>
      )}
      {status === "404" && (  // Si no existe la INC me muestra solo el formulario
        <Row>
          <div className='PrincipalForm'>
            <Formulario name={name} />
          </div>
        </Row>
      )}

    </Form>
  );
}
