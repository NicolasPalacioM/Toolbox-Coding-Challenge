import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchFileData } from "./actions/actions";
import Header from "./components/Header";
import "./App.css";
import Spinner from "./components/Spinner";

function App() {
  const [fileName, setFileName] = useState("");
  const fileData = useSelector((state) => state.fileData);
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFileData());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchFileData(fileName));
  };

  return (
    <>
      <Header />
      <Container className="my-4">
        <Row>
          <Col>
            <Form onSubmit={handleSubmit}>
              <Row className="align-items-center">
                <Col xs="auto">
                  <Form.Group controlId="fileName">
                    <Form.Control
                      type="text"
                      placeholder="Enter file name"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs="auto">
                  <Button
                    variant="primary"
                    type="submit"
                    className="custom-button"
                  >
                    Filter
                  </Button>
                </Col>
              </Row>
            </Form>
            {error && <p className="text-danger mt-2">{error}</p>}
          </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            {loading ? (
              <Spinner />
            ) : (
              <div className="table-responsive">
                <Table striped bordered hover className="mb-0">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Text</th>
                      <th>Number</th>
                      <th>Hex</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fileData.length > 0 &&
                      fileData.map((file) =>
                        file.lines.map((line, index) => (
                          <tr key={`${file.file}-${index}`}>
                            <td>{file.file}</td>
                            <td>{line.text}</td>
                            <td>{line.number}</td>
                            <td>{line.hex}</td>
                          </tr>
                        ))
                      )}
                  </tbody>
                </Table>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
