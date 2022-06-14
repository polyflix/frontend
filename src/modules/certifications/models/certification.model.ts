export interface Certification {
  id?: string
  name: string
}

export interface Certificate {
  certification: Certification
  firstName: string
  lastName: string
  createdAt: string
}
