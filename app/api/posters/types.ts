export interface ImageData {
  id: number;
  imageUrl: string;
  fileName: string;
  fileSize: number;
  uploadedBy: number;
  createdAt: Date | string; // Can accept both
  updatedAt: Date | string;
}
