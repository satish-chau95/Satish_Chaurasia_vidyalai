import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';

const Table = styled.table(() => ({
  width: '100%',
  borderCollapse: 'collapse',

  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
    cursor: 'pointer',
  },

  td: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  },

  '.sort-icon': {
    verticalAlign: 'middle',
    marginLeft: '5px',
  },
}));

const columnFields = [
  { value: 'id', label: 'Id' },
  { value: 'name', label: 'Name', enableSearch: true },
  { value: 'email', label: 'Email', enableSearch: true },
  { value: 'username', label: 'Username' },
  { value: 'phone', label: 'Phone' },
  { value: 'website', label: 'Website' },
];

// Custom hook to fetch and manage user data
function useUserData() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [sortColumn, setSortColumn] = useState(columnFields[0].value);
  const [isAsc, setIsAsc] = useState(true);

  const fetchUsers = async () => {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');
    setUsers(data);
    setFilteredUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let updatedUsers = [...users];
    if (searchName) {
      updatedUsers = updatedUsers.filter((user) =>
        user.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    if (searchEmail) {
      updatedUsers = updatedUsers.filter((user) =>
        user.email.toLowerCase().includes(searchEmail.toLowerCase())
      );
    }
    updatedUsers.sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return isAsc ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return isAsc ? 1 : -1;
      return 0;
    });
    setFilteredUsers(updatedUsers);
  }, [searchName, searchEmail, sortColumn, isAsc, users]);

  return {
    filteredUsers,
    searchName,
    setSearchName,
    searchEmail,
    setSearchEmail,
    sortColumn,
    setSortColumn,
    isAsc,
    setIsAsc,
  };
}

const UserList = () => {
  const {
    filteredUsers,
    searchName,
    setSearchName,
    searchEmail,
    setSearchEmail,
    sortColumn,
    setSortColumn,
    isAsc,
    setIsAsc,
  } = useUserData();

  const handleSort = (column) => {
    if (column === sortColumn) {
      setIsAsc(!isAsc);
    } else {
      setSortColumn(column);
      setIsAsc(true);
    }
  };

  return (
    <>
      <div>
        <input
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
      </div>
      <Table>
        <thead>
          <tr>
            {columnFields.map((column) => (
              <th key={column.value} onClick={() => handleSort(column.value)}>
                {column.label}
                {column.value === sortColumn && (
                  <span className="sort-icon">{isAsc ? '▲' : '▼'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              {columnFields.map((column) => (
                <td key={column.value}>{user[column.value]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default UserList;