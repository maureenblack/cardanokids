/**
 * Content List Component
 * 
 * This component displays a list of educational content with filtering and sorting options.
 */

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { EducationalContent, ContentType, ContentLevel, VerificationStatus } from '../models';
import { contentService } from '../services/contentService';
import { AgeGroup } from '../../auth/types';

/**
 * Content List Component
 */
const ContentList: React.FC = () => {
  const [contents, setContents] = useState<EducationalContent[]>([]);
  const [filteredContents, setFilteredContents] = useState<EducationalContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Load content on component mount
  useEffect(() => {
    const fetchContents = async () => {
      try {
        setLoading(true);
        const allContents = await contentService.getAllContent();
        setContents(allContents);
        setFilteredContents(allContents);
        setLoading(false);
      } catch (err) {
        setError('Failed to load content. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchContents();
  }, []);
  
  // Apply filters when filter states change
  useEffect(() => {
    let filtered = [...contents];
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(content => content.metadata.type === typeFilter);
    }
    
    // Apply level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(content => content.metadata.level === levelFilter);
    }
    
    // Apply age group filter
    if (ageGroupFilter !== 'all') {
      filtered = filtered.filter(content => 
        content.metadata.targetAgeGroups.includes(ageGroupFilter as AgeGroup)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(content => 
        content.verificationStatus === statusFilter
      );
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(content => 
        content.metadata.title.toLowerCase().includes(term) ||
        content.metadata.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredContents(filtered);
  }, [contents, typeFilter, levelFilter, ageGroupFilter, statusFilter, searchTerm]);
  
  // Handle filter changes
  const handleTypeFilterChange = (event: SelectChangeEvent) => {
    setTypeFilter(event.target.value);
  };
  
  const handleLevelFilterChange = (event: SelectChangeEvent) => {
    setLevelFilter(event.target.value);
  };
  
  const handleAgeGroupFilterChange = (event: SelectChangeEvent) => {
    setAgeGroupFilter(event.target.value);
  };
  
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Get status chip color based on verification status
  const getStatusChipColor = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.DRAFT:
        return 'default';
      case VerificationStatus.PENDING:
        return 'warning';
      case VerificationStatus.VERIFIED:
        return 'success';
      case VerificationStatus.PUBLISHED:
        return 'primary';
      case VerificationStatus.REJECTED:
        return 'error';
      default:
        return 'default';
    }
  };
  
  if (loading) {
    return <Typography>Loading content...</Typography>;
  }
  
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Educational Content</Typography>
      
      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ minWidth: 200 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Content Type</InputLabel>
          <Select
            value={typeFilter}
            label="Content Type"
            onChange={handleTypeFilterChange}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value={ContentType.LESSON}>Lesson</MenuItem>
            <MenuItem value={ContentType.VIDEO}>Video</MenuItem>
            <MenuItem value={ContentType.QUIZ}>Quiz</MenuItem>
            <MenuItem value={ContentType.SIMULATION}>Simulation</MenuItem>
            <MenuItem value={ContentType.GAME}>Game</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Content Level</InputLabel>
          <Select
            value={levelFilter}
            label="Content Level"
            onChange={handleLevelFilterChange}
          >
            <MenuItem value="all">All Levels</MenuItem>
            <MenuItem value={ContentLevel.BEGINNER}>Beginner</MenuItem>
            <MenuItem value={ContentLevel.INTERMEDIATE}>Intermediate</MenuItem>
            <MenuItem value={ContentLevel.ADVANCED}>Advanced</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Age Group</InputLabel>
          <Select
            value={ageGroupFilter}
            label="Age Group"
            onChange={handleAgeGroupFilterChange}
          >
            <MenuItem value="all">All Ages</MenuItem>
            <MenuItem value={AgeGroup.YOUNG}>Young (6-8)</MenuItem>
            <MenuItem value={AgeGroup.MIDDLE}>Middle (9-11)</MenuItem>
            <MenuItem value={AgeGroup.OLDER}>Older (12-14)</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={handleStatusFilterChange}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value={VerificationStatus.DRAFT}>Draft</MenuItem>
            <MenuItem value={VerificationStatus.PENDING}>Pending</MenuItem>
            <MenuItem value={VerificationStatus.VERIFIED}>Verified</MenuItem>
            <MenuItem value={VerificationStatus.PUBLISHED}>Published</MenuItem>
            <MenuItem value={VerificationStatus.REJECTED}>Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Content Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Age Groups</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No content found matching the current filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredContents.map((content) => (
                <TableRow key={content.id}>
                  <TableCell>{content.metadata.title}</TableCell>
                  <TableCell>{content.metadata.type}</TableCell>
                  <TableCell>{content.metadata.level}</TableCell>
                  <TableCell>
                    {content.metadata.targetAgeGroups.map((ageGroup) => (
                      <Chip 
                        key={ageGroup} 
                        label={ageGroup} 
                        size="small" 
                        sx={{ mr: 0.5 }} 
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={content.verificationStatus} 
                      color={getStatusChipColor(content.verificationStatus) as any}
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" title="View">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Edit">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Delete">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ContentList;
