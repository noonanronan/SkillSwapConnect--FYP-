// user.model.ts

export interface Interest {
    subject: string;
    type: string;
  }
  
  export interface User {
    bio: string;
    displayName: string;
    interests?: Interest[];
    role: string;
  }
  