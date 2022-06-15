export interface Certification {
  id?: string
  name: string
}

export interface Certificate {
  id?: string
  certification: Certification
  firstName: string
  lastName: string
  createdAt: string
}
