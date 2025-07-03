import projectsData from '@/services/mockData/projects.json'

class ProjectService {
  constructor() {
    this.projects = [...projectsData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.projects]
  }

  async getById(id) {
    await this.delay(200)
    const project = this.projects.find(p => p.Id === id)
    if (!project) {
      throw new Error('Project not found')
    }
    return { ...project }
  }

  async create(projectData) {
    await this.delay(400)
    const newProject = {
      ...projectData,
      Id: Math.max(...this.projects.map(p => p.Id)) + 1,
      startDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      photoCount: 0,
      teamMembers: []
    }
    this.projects.push(newProject)
    return { ...newProject }
  }

  async update(id, projectData) {
    await this.delay(350)
    const index = this.projects.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Project not found')
    }
    this.projects[index] = {
      ...this.projects[index],
      ...projectData,
      lastUpdated: new Date().toISOString()
    }
    return { ...this.projects[index] }
  }

  async delete(id) {
    await this.delay(300)
    const index = this.projects.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Project not found')
    }
    this.projects.splice(index, 1)
    return true
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const projectService = new ProjectService()