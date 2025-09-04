import { ValidationErrorResponse } from "@/lib/types/api_response";
import { ErrorResponse } from "@/lib/types/error_type";


export default class ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;

    constructor(statusCode: number, data: T, message: string = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export class ApiError extends Error {
    statusCode: number;
    validationErrors: ErrorResponse[];

    constructor(statusCode: number, validationErrors: ErrorResponse[] = [], message: string = 'Validation failed') {
        super(message);
        this.statusCode = statusCode;
        this.validationErrors = validationErrors;
        this.name = 'ApiError'; // Set the error name to be ApiError
    }
}

// Type guard function to check if the response is of type ValidationErrorResponse
export function isValidationErrorResponse<T>(response: ValidationErrorResponse | ApiResponse<T>): response is ValidationErrorResponse {
    if ('data' in response && Array.isArray(response.data) && response.data.every(
        (item) => item.hasOwnProperty('key') && item.hasOwnProperty('message')
    )) {
        // If validation errors are present, throw a custom ApiError
        throw new ApiError(
            response.statusCode,
            response.data.map((error) => ({ key: error.key, message: error.message } as unknown as ErrorResponse)), // Map ValidationError to ErrorResponse
            'Validation failed'
        );
    }

    return false;
}