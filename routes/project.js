const express = require('express');
const routerProject = express.Router();
const { handleCreateProject, handleGetProjects,handleSearchProjects } = require('../controllers/project');

// POST request to create a new project
routerProject.post('/create', handleCreateProject);
routerProject.get('/get', handleGetProjects);
routerProject.get('/search', handleSearchProjects);

module.exports = routerProject;
