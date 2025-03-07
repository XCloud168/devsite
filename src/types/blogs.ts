export interface Author {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface Blog {
  id: number;
  title: string | null;
  content: string | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string | null;
  status: string | null;
  author: Author | null;
}
