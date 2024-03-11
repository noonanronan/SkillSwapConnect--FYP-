// models.ts
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

export interface Message {
  id?: string;
  text: string;
  timestamp: string;
  senderId: string;
  chatId?: string;
}
