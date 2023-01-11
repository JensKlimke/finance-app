import {Container} from "react-bootstrap";
import {ReactNode} from "react";

export default function LoadingScreen({children} : {children: ReactNode}) {
  return (
    <Container className='pt-5'>
      {children}
    </Container>
  );
}
