export interface Class {
  id?: string;
  name: string;
  description?: string;
  teacherIds?: string[];
  assistantIds?: string[];
  learnerIds?: string[];
  createdAt?: string;
  updatedAt?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
}
