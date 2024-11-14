enum TeamVisibility {
  PUBLIC = 'PUBLIC'
}

interface Team {
  id: number;
  name: string;
  visibility: TeamVisibility;
  members: any;
  createdAt: string;
  updatedAt: string;
}
