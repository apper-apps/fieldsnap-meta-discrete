import photosData from '@/services/mockData/photos.json'

class PhotoService {
  constructor() {
    this.photos = [...photosData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.photos]
  }

  async getById(id) {
    await this.delay(200)
    const photo = this.photos.find(p => p.Id === id)
    if (!photo) {
      throw new Error('Photo not found')
    }
    return { ...photo }
  }

async create(photoData) {
    await this.delay(500)
    
    // Handle image blob data
    let imageUrl = photoData.url
    if (photoData.imageBlob) {
      // In a real app, this would upload to a server
      // For now, we'll use the blob URL
      imageUrl = photoData.url
    }
    
    const newPhoto = {
      ...photoData,
      Id: Math.max(...this.photos.map(p => p.Id)) + 1,
      url: imageUrl,
      timestamp: new Date().toISOString(),
      uploadedBy: 'John Doe',
      annotations: [],
      tags: []
    }
    
    // Remove blob reference before storing
    delete newPhoto.imageBlob
    
    this.photos.push(newPhoto)
    return { ...newPhoto }
  }

  async update(id, photoData) {
    await this.delay(350)
    const index = this.photos.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Photo not found')
    }
    this.photos[index] = {
      ...this.photos[index],
      ...photoData
    }
    return { ...this.photos[index] }
  }

  async delete(id) {
    await this.delay(300)
    const index = this.photos.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Photo not found')
    }
    this.photos.splice(index, 1)
    return true
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const photoService = new PhotoService()