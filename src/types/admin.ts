// Admin Types for Carousel Management

export interface CarouselSlot {
  position: number;
  youtubeId: string | null;
  updatedAt?: Date | string;
}

export interface CarouselUpdateRequest {
  slots: CarouselSlot[];
}

export interface AuthLoginRequest {
  pin: string;
}

export interface ApiResponse<T = unknown> {
  success?: boolean;
  error?: string;
  data?: T;
}
