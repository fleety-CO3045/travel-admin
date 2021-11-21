import Modal from '@/components/Shared/Modal'
import PaginationButton from '@/components/Shared/Pagination'
import Table from '@/components/Shared/Table'
import UserForm from '@/components/users/UserForm'
import Admin from '@/layouts/Admin'
import {
  deleteUser,
  mutateUsers,
  useUsers,
  useUsersPage,
} from '@/services/user'
import { useEffect, useState } from 'react'
import { useToggle } from 'react-use'

function UserModal({ isOpen, toggle, editUser }) {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <Modal.Body>
        <UserForm editUser={editUser} isAgency />
      </Modal.Body>
    </Modal>
  )
}

const Agencies = () => {
  const [page, setPage] = useState(0)
  const [isModalOpen, toggleModal] = useToggle(false)
  const [editUser, setEditUser] = useState(null)
  const LIMIT = 10
  const ROLE = 1
  const { totalPages, isLoading: isTotalPagesLoading } = useUsersPage(LIMIT)
  const { users, loading, error } = useUsers(page, LIMIT, ROLE)
  useEffect(() => {
    if (!isModalOpen) {
      setEditUser(null)
    }
    mutateUsers(page, LIMIT, ROLE)
  }, [isModalOpen])

  async function handleDelete(id) {
    if (window.confirm('Are you sure?')) {
      const response = await deleteUser(id)
      if (response.success) {
        mutateUsers(page, LIMIT, ROLE)
        alert('User deleted!')
      } else {
        alert(response.message)
      }
    }
  }

  async function handleEdit(user) {
    toggleModal()
    setEditUser(user)
  }
  if (loading || isTotalPagesLoading) return <div>Loading...</div>
  if (error) return <div>Error!</div>
  return (
    <>
      <h1 className="text-2xl font-bold">Users</h1>
      <div>
        <button className="btn btn-success" onClick={toggleModal}>
          Add
        </button>
      </div>
      <UserModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        editUser={editUser}
      />
      <Table>
        <Table.Head>
          <td>Name</td>
          <td>Email</td>
          <td>Avatar</td>
          <td>Blocked</td>
        </Table.Head>
        <Table.Body>
          {users &&
            users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <img src={user.avatar} alt={user.name} className="w-20" />
                </td>
                <td>
                  <div
                    className={`badge ${
                      parseInt(user.blocked) ? 'badge-error' : 'badge-success'
                    }`}
                  >
                    {parseInt(user.blocked) ? 'Yes' : 'No'}
                  </div>
                </td>
                <td>
                  <Table.EditButton onClick={() => handleEdit(user)} />
                </td>
                <td>
                  <Table.DeleteButton onClick={() => handleDelete(user.id)} />
                </td>
              </tr>
            ))}
        </Table.Body>
      </Table>
      <div>
        <PaginationButton
          currentPage={page}
          onPageChange={setPage}
          totalPages={totalPages}
        />
      </div>
    </>
  )
}

Agencies.layout = Admin

export default Agencies
