// Estilos
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from './img/logo.png';
// Componente router - Navegacion
import { Link } from "react-router-dom";

export function NavbarPrimary() {

  return (
    <Navbar bg="dark" data-bs-theme="dark" className='Navegador bg-body-tertiary'>
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            width="80"
            height="25"
            className="d-inline-block align-top"
            alt=''
          />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="Opciones me-auto">
            <Nav.Link as={Link} to="/" >Enviar SMS</Nav.Link>
            <Nav.Link as={Link} to="/tablesms/sms">Historico de SMS</Nav.Link>
            <Nav.Link as={Link} to="/tableusers/users">Usuarios</Nav.Link>
            <Nav.Link as={Link} to="/tablegroups/groups">Grupos</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <Nav.Link href="#ruta">Cerrar Sesión</Nav.Link>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar >
  );
}
