export interface ServiceLocationsResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    createdBy: number;
    createdAt: string;
    updatedAt: string;
  }>;
}