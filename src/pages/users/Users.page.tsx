import React from "react";
import {Card, Col, Container, Row} from "react-bootstrap";
import ContentMessage from "../../components/display/ContentMessage";
import EntryFormModal from "../../components/forms/EntryFormModal";
import DataTable from "../../components/display/DataTable";
import UserProvider, {UserContext, useUsers} from "./Users.context";
import {UserCols, UserRows} from "./Users.table";
import UsersForm from "./Users.form";
import {useAuth} from "../../components/auth/AuthContext";

export default function UsersPage() {
  // render
  return (
    <UserProvider>
      <UserContent/>
    </UserProvider>
  );
}

const UserContent = () => {
  // get data
  const {data : usersData, edit} = useUsers();
  const {user} = useAuth();
  // check user
  if (user?.role !== 'admin')
    return <p className='text-center text-muted'>403 - Forbidden</p>
  // check data
  if (!usersData)
    return <ContentMessage text={'Loading users'}/>;
  // render
  return (
    <Container>
      <Row>
        <Col className='mb-4'>
          <Card>
            <Card.Header>Users</Card.Header>
            <Card.Body>
              <DataTable
                tableConfig={UserCols}
                cardConfig={UserRows}
                data={usersData}
                onRowClick={(d) => edit(d.id)}
                onAdd={() => edit('')}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <EntryFormModal context={UserContext} name='user'>
        {(entry, update, handleSubmit) =>
          <UsersForm entry={entry} update={update} handleSubmit={handleSubmit}/>
        }
      </EntryFormModal>
    </Container>
  );
}





