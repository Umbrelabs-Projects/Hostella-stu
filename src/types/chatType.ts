
export type MessageType = "text" | "voice";
export type Sender = "student" | "admin";

export interface ChatMessageType {
  id: number;
  sender: Sender;
  content: string;
  timestamp: string;
  type: MessageType;
  audio?: Blob;
  hostelId?: number;
}
