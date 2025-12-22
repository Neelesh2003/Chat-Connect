export interface MessageResponse {
  id: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  message: string; // content
  createdAt: string;
  isImage: boolean;
}

export interface SendMessageRequest {
  receiverId: number;
  message: string;
}

export interface SendGroupMessageRequest {
  message: string;
}

export interface CreateGroupRequest {
  name: string;
  members?: number[];
}

export interface GroupResponse {
  id: number;
  name: string;
  createdBy: number;
  createdAt: string;
}

export interface AddMembersRequest {
  members: number[];
}

export interface User {
  id: number;
  username: string;
  isOnline?: boolean;
  isOffline?:boolean;
}