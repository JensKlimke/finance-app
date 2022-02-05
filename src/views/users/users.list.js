import {Button, Form, Table} from "semantic-ui-react";
import FormModal from "../../data/FormModal";
import {UserContext} from "./user.controller";
import {AuthContext} from "../../auth/Auth";


export function UserForm({object, onChange}) {

  const options = [
    {key: 'admin', value: 'admin', text: 'Admin'},
    {key: 'user', value: 'user', text: 'User'},
  ]

  // render
  return (
    <>
      <Form.Field>
        <label>Name</label>
        <Form.Input placeholder='Jane Doe' value={object.name} onChange={(e, {value}) => onChange('name', value)}/>
      </Form.Field>
      <Form.Field>
        <label>Email address</label>
        <Form.Input placeholder='jane.doe@provider.com' value={object.email} onChange={(e, {value}) => onChange('email', value)}/>
      </Form.Field>
      <AuthContext.Consumer>
        { ({user}) => (user.role === 'admin' && user.id !== object.id) && (
          <Form.Field>
            <label>Role</label>
            <Form.Select options={options} placeholder='Role' value={object.role} onChange={(e, {value}) => onChange('role', value)} />
          </Form.Field>
        ) }
      </AuthContext.Consumer>
    </>
  );

}

export function UserListHeader ({sorted, sort}) {

  return (
    <Table.Row>
      <Table.HeaderCell width={1} sorted={sorted['role']} onClick={() => sort('role')}>
        Role
      </Table.HeaderCell>
      <Table.HeaderCell sorted={sorted['name']} onClick={() => sort('name')}>
        Name
      </Table.HeaderCell>
      <Table.HeaderCell sorted={sorted['email']} onClick={() => sort('email')}>
        Email address
      </Table.HeaderCell>
      <Table.HeaderCell width={2} sorted={sorted['isEmailVerified']} onClick={() => sort('isEmailVerified')}>
        Email verified
      </Table.HeaderCell>
    </Table.Row>
  );

}

export function UsersListRow ({object: user}) {

  return (
    <Table.Row>
      <Table.Cell>{user.role === 'admin' ? 'A' : 'U'}</Table.Cell>
      <Table.Cell>
        <UserEditModal user={user}>
          <span style={{cursor: 'pointer'}}>{user.name}</span>
        </UserEditModal>
      </Table.Cell>
      <Table.Cell>{user.email}</Table.Cell>
      <Table.Cell>{user.isEmailVerified ? 'Yes' : 'No'}</Table.Cell>
    </Table.Row>
  );

}


export const UserEditModal = ({user, children}) =>
  <UserContext.Consumer>
    {(controller) => (
      controller && <FormModal trigger={children} object={user} controller={controller}/>
    )}
  </UserContext.Consumer>


export const UserNewModal = () =>
  <UserContext.Consumer>
    {(controller) => (
      controller && <FormModal trigger={<Button>Add new</Button>} controller={controller} />
    )}
  </UserContext.Consumer>


export const UserElements = () => (
  {
    header: UserListHeader,
    row: UsersListRow,
    create: UserNewModal,
    edit: UserEditModal,
    fields: UserForm,
  }
)
