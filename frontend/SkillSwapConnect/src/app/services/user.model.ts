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
  teachingMaterials?: TeachingMaterials;
}

export interface Message {
  id?: string;
  text: string;
  timestamp: string;
  senderId: string;
  chatId?: string;
}

export interface TeachingMaterials {
  notes: any[]; 
  videos: any[]; 
}
