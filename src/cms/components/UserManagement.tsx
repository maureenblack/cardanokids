/**
 * User Management Component
 * 
 * This component provides an interface for administrators to manage users,
 * including educators, parents, and children on the Cardano Kids platform.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../../auth/AuthContext';

// User type definition
interface User {
  id: string;
  username: string;
  email: string;
  accountType: 'parent' | 'teacher' | 'child' | 'admin';
  ageGroup?: 'young' | 'middle' | 'older';
  parentId?: string;
  createdAt: Date;
}

/**
 * User Management Component
 */
const UserManagement: React.FC = () => {
  const { currentUser } = useAuth();
  
  // State for user data
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for table pagination
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  
  // State for filtering
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>('all');
  
  // State for user dialog
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Load users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, fetch users from API
        // For now, use mock data
        const mockUsers: User[] = [
          {
            id: '1',
            username: 'admin1',
            email: 'admin@cardanokids.com',
            accountType: 'admin',
            createdAt: new Date('2023-01-01')
          },
          {
            id: '2',
            username: 'teacher1',
            email: 'teacher1@cardanokids.com',
            accountType: 'teacher',
            createdAt: new Date('2023-01-15')
          },
          {
            id: '3',
            username: 'parent1',
            email: 'parent1@example.com',
            accountType: 'parent',
            createdAt: new Date('2023-02-01')
          },
          {
            id: '4',
            username: 'child1',
            email: '',
            accountType: 'child',
            ageGroup: 'young',
            parentId: '3',
            createdAt: new Date('2023-02-05')
          },
          {
            id: '5',
            username: 'teacher2',
            email: 'teacher2@cardanokids.com',
            accountType: 'teacher',
            createdAt: new Date('2023-03-10')
          },
          {
            id: '6',
            username: 'parent2',
            email: 'parent2@example.com',
            accountType: 'parent',
            createdAt: new Date('2023-04-01')
          },
          {
            id: '7',
            username: 'child2',
            email: '',
            accountType: 'child',
            ageGroup: 'middle',
            parentId: '6',
            createdAt: new Date('2023-04-05')
          },
          {
            id: '8',
            username: 'child3',
            email: '',
            accountType: 'child',
            ageGroup: 'older',
            parentId: '3',
            createdAt: new Date('2023-04-10')
          }
        ];
        
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
        setLoading(false);
      } catch (err) {
        setError('Failed to load users. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Apply filters when filter states change
  useEffect(() => {
    let filtered = [...users];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }
    
    // Apply account type filter
    if (accountTypeFilter !== 'all') {
      filtered = filtered.filter(user => user.accountType === accountTypeFilter);
    }
    
    setFilteredUsers(filtered);
    setPage(0); // Reset to first page when filters change
  }, [users, searchTerm, accountTypeFilter]);
  
  // Handle search term change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Handle account type filter change
  const handleAccountTypeFilterChange = (event: SelectChangeEvent) => {
    setAccountTypeFilter(event.target.value);
  };
  
  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Open add user dialog
  const handleAddUser = () => {
    setDialogMode('add');
    setSelectedUser(null);
    setDialogOpen(true);
  };
  
  // Open edit user dialog
  const handleEditUser = (user: User) => {
    setDialogMode('edit');
    setSelectedUser(user);
    setDialogOpen(true);
  };
  
  // Close user dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  // Get account type chip color
  const getAccountTypeColor = (accountType: string) => {
    switch (accountType) {
      case 'admin':
        return 'error';
      case 'teacher':
        return 'primary';
      case 'parent':
        return 'success';
      case 'child':
        return 'info';
      default:
        return 'default';
    }
  };
  
  // Get age group label
  const getAgeGroupLabel = (ageGroup?: string) => {
    switch (ageGroup) {
      case 'young':
        return 'Young (6-8)';
      case 'middle':
        return 'Middle (9-11)';
      case 'older':
        return 'Older (12-14)';
      default:
        return 'N/A';
    }
  };
  
  if (loading && users.length === 0) {
    return <Typography>Loading users...</Typography>;
  }
  
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">User Management</Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleAddUser}
        >
          Add User
        </Button>
      </Box>
      
      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Account Type</InputLabel>
          <Select
            value={accountTypeFilter}
            label="Account Type"
            onChange={handleAccountTypeFilterChange}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
            <MenuItem value="parent">Parent</MenuItem>
            <MenuItem value="child">Child</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Users Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Account Type</TableCell>
                <TableCell>Age Group</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No users found matching the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.accountType} 
                          color={getAccountTypeColor(user.accountType) as any}
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{getAgeGroupLabel(user.ageGroup)}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          title="Edit" 
                          onClick={() => handleEditUser(user)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          title="Delete" 
                          disabled={currentUser ? user.id === currentUser.id : false}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* User Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New User' : 'Edit User'}
        </DialogTitle>
        <DialogContent>
          {/* Dialog content would go here */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This is a placeholder for the user form. In a real implementation, this would include fields for username, email, password, account type, etc.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained">
            {dialogMode === 'add' ? 'Add User' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
