import {Col, Container, Row} from "react-bootstrap";

export default function AboutPage() {
  return (
    <Container>
      <Row className='justify-content-center align-content-center'>
        <Col className='text-center' lg={6}>
          <h1 className='display-1'>FINAPP v1.0</h1>
          <p>&copy; 2022-2023 <a href='mailto://jens.klimke@rwth-aachen.de'>Jens Klimke</a></p>
          <hr />
          <h2 className='display-2'>MIT License</h2>
          <section style={{textAlign: 'justify'}}>
            <p>Copyright 2023 Jens Klimke</p>
            <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
            <p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
            <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
          </section>
        </Col>
      </Row>
    </Container>
  )
}
