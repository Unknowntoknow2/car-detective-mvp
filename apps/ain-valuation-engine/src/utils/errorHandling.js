// Standardized error handling utilities
import logger from './logger';
/**
 * Centralized error handling utility class providing standardized error
 * creation, logging, and management across the application.
 *
 * This class ensures consistent error handling patterns and provides
 * structured logging for debugging and monitoring purposes.
 */
export class ErrorHandler {
    /**
     * Creates a standardized AppError object with consistent structure.
     *
     * @param {string} code - Unique error code for categorization
     * @param {string} message - Human-readable error description
     * @param {Record<string, unknown>} [details] - Additional context data
     * @param {Error} [originalError] - The original error that caused this AppError
     * @param {string} [context] - Context or operation where error occurred
     * @returns {AppError} Standardized error object
     *
     * @example
     * ```typescript
     * const error = ErrorHandler.createError(
     *   'API_ERROR',
     *   'Failed to fetch user data',
     *   { userId: 123, endpoint: '/api/users' },
     *   originalError,
     *   'UserService.getUser'
     * );
     * ```
     */
    static createError(code, message, details, originalError, context) {
        return {
            code,
            message,
            details,
            originalError,
            timestamp: new Date(),
            context,
        };
    }
    /**
     * Logs an AppError using the Winston logger with structured formatting.
     *
     * Provides consistent log formatting across the application and ensures
     * all error details are captured for debugging and monitoring.
     *
     * @param {AppError} error - The AppError to log
     *
     * @example
     * ```typescript
     * const error = ErrorHandler.createError('DB_ERROR', 'Connection failed');
     * ErrorHandler.logError(error);
     * ```
     */
    static logError(error) {
        logger.error(`[${error.timestamp.toISOString()}] ${error.code}: ${error.message}`, {
            details: error.details,
            context: error.context,
            originalError: error.originalError?.stack,
        });
    }
    /**
     * Converts unknown error types into standardized AppError objects.
     *
     * Handles various error types (Error objects, strings, etc.) and creates
     * a consistent AppError structure for further processing.
     *
     * @param {unknown} error - The error to convert (any type)
     * @param {string} context - Context where the error occurred
     * @returns {AppError} Standardized AppError object
     *
     * @example
     * ```typescript
     * try {
     *   await riskyOperation();
     * } catch (error) {
     *   const appError = ErrorHandler.handleApiError(error, 'UserAPI.create');
     *   ErrorHandler.logError(appError);
     * }
     * ```
     */
    static handleApiError(error, context) {
        if (error instanceof Error) {
            const appError = this.createError('API_ERROR', error.message, undefined, error, context);
            this.logError(appError);
            return appError;
        }
        const appError = this.createError('UNKNOWN_ERROR', 'An unknown error occurred', { originalError: error }, undefined, context);
        this.logError(appError);
        return appError;
    }
    static handleDatabaseError(error, operation) {
        if (error instanceof Error) {
            const appError = this.createError('DATABASE_ERROR', `Database operation failed: ${operation}`, { operation }, error, 'database');
            this.logError(appError);
            return appError;
        }
        const appError = this.createError('DATABASE_UNKNOWN_ERROR', `Unknown database error during: ${operation}`, { operation, originalError: error }, undefined, 'database');
        this.logError(appError);
        return appError;
    }
    static handleValidationError(field, value, rule) {
        const appError = this.createError('VALIDATION_ERROR', `Validation failed for field '${field}': ${rule}`, { field, value, rule }, undefined, 'validation');
        this.logError(appError);
        return appError;
    }
}
export class ResponseBuilder {
    static success(data, metadata) {
        return {
            success: true,
            data,
            metadata: {
                timestamp: new Date(),
                version: '1.0.0',
                ...metadata,
            },
        };
    }
    static error(error, metadata) {
        return {
            success: false,
            error,
            metadata: {
                timestamp: new Date(),
                version: '1.0.0',
                ...metadata,
            },
        };
    }
}
// Async wrapper for consistent error handling
export async function withErrorHandling(operation, context) {
    try {
        const result = await operation();
        return ResponseBuilder.success(result);
    }
    catch (error) {
        const appError = ErrorHandler.handleApiError(error, context);
        return ResponseBuilder.error(appError);
    }
}
