import teamData from '@/services/mockData/team.json'

class TeamService {
  constructor() {
    this.teamMembers = [...teamData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.teamMembers]
  }

  async getById(id) {
    await this.delay(200)
    const member = this.teamMembers.find(m => m.Id === id)
    if (!member) {
      throw new Error('Team member not found')
    }
    return { ...member }
  }

  async create(memberData) {
    await this.delay(400)
    const newMember = {
      ...memberData,
      Id: Math.max(...this.teamMembers.map(m => m.Id)) + 1,
      avatar: null,
      projects: []
    }
    this.teamMembers.push(newMember)
    return { ...newMember }
  }

  async update(id, memberData) {
    await this.delay(350)
    const index = this.teamMembers.findIndex(m => m.Id === id)
    if (index === -1) {
      throw new Error('Team member not found')
    }
    this.teamMembers[index] = {
      ...this.teamMembers[index],
      ...memberData
    }
    return { ...this.teamMembers[index] }
  }

  async delete(id) {
    await this.delay(300)
    const index = this.teamMembers.findIndex(m => m.Id === id)
    if (index === -1) {
      throw new Error('Team member not found')
    }
    this.teamMembers.splice(index, 1)
    return true
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const teamService = new TeamService()