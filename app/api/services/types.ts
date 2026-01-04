export interface ServiceApiResponse {
  data: Array<{
    id: string;
    logo: string;
    bannerImg: string;
    title: string;
    heading: string;
    shortdescription: string;
    description: string;
    features: string[];
    type: 'MOVING' | 'STORAGE';
    createdAt: string;
    updatedAt: string;
  }>;
  message: string;
  status: number;
}