export type TicketType = {
  orderIndex: number
  id: string
  ticketListId: string
  title: string
  description: string
  assignedDevelopers: {
    id: string
    githubUsername: string
    name: string
    avatarURL: string
  }[]
  createdAt: Date
  editedAt: Date
}

export type TicketListType = {
  orderIndex: number
  id: string
  title: string
  tickets: TicketType[]
}

export type EditTicketListType = {
  id: string
  title: string
}