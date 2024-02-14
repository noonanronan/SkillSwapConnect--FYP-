export interface Interest {
    subject: string;
    type: string;
  }
  
  export interface User {
    uid?: string; // Make uid optional as it might not be part of the object but used as a key in Firebase
    bio: string;
    displayName: string;
    interests?: Interest[]; // Assuming you have defined the Interest interface
    role: string;
    photoURL?: string; // Make photoURL optional
  }
  
  