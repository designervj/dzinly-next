import React from 'react'
import CreatePorjectButton from './createProject/CreatePorjectButton'
import GetAllProjects from './GetAllProjects'
import ProjectTable from './ProjectTable'

const ProjectHome = () => {
  return (
    <>
      <CreatePorjectButton/>
  
  <ProjectTable/>
    </>

  )
}

export default ProjectHome