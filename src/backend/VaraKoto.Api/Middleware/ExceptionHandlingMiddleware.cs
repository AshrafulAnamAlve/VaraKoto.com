using System.Net;
using System.Text.Json;

namespace VaraKoto.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred while processing request {Path}", context.Request.Path);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json; charset=utf-8";

        var (statusCode, messageBn, messageEn) = exception switch
        {
            ArgumentException argEx => (
                HttpStatusCode.BadRequest,
                string.IsNullOrWhiteSpace(argEx.Message) ? "প্রদত্ত তথ্যে ভুল রয়েছে।" : argEx.Message,
                argEx.Message
            ),
            InvalidOperationException invEx => (
                HttpStatusCode.BadRequest,
                invEx.Message,
                invEx.Message
            ),
            KeyNotFoundException keyEx => (
                HttpStatusCode.NotFound,
                "অনুরোধকৃত তথ্যটি খুঁজে পাওয়া যায়নি।",
                keyEx.Message
            ),
            UnauthorizedAccessException unauthEx => (
                HttpStatusCode.Unauthorized,
                "অনুমতি নেই। অনুগ্রহ করে লগইন করুন।",
                unauthEx.Message
            ),
            _ => (
                HttpStatusCode.InternalServerError,
                "সার্ভারে একটি অপ্রত্যাশিত সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।",
                "An unexpected server error occurred. Please try again later."
            )
        };

        context.Response.StatusCode = (int)statusCode;

        var errorResponse = new
        {
            statusCode = (int)statusCode,
            error = statusCode.ToString(),
            messageBn,
            messageEn,
            traceId = context.TraceIdentifier,
            timestampUtc = DateTime.UtcNow
        };

        var json = JsonSerializer.Serialize(errorResponse);
        await context.Response.WriteAsync(json);
    }
}
