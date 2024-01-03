model User {
  id        String   @id @default(uuid())
  githubId  Int      @unique
  name      String
  login     String
  avatarUrl String
    relacionamento inverso ouseja um user pode ter varias memorias
  memories  Memory[]
}

model Memory {
  id        String   @id @default(uuid())
  coverUrl  String
  content   String
  isPublic  Boolean  @default(false)
  createdAt DateTime @default(now())

  toda memoria pertence a um usuario que é do tipo user
  user   User   @relation(fields: [userId], references: [id])
  refencia a com a tabela de usuarios
  userId String
}
