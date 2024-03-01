export interface Interest {
    subject: string;
    type: string;
  }
  
  export interface User {
    uid?: string; 
    bio: string;
    displayName: string;
    interests?: Interest[]; 
    role: string;
    photoURL?: string; 
  }
  
  