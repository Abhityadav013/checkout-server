export interface ValidationError {
    key: string;
    message: string;
  }
  
  // Define the response structure
  interface ApiResponses<T> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;
  }
  
  // Create the specific type for your error response
  export type ValidationErrorResponse = ApiResponses<ValidationError[]>;
  export type ApiResponse<T> = ApiResponses<T> 
  