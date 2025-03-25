export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  access_token: string;
}

export interface Letter {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
}