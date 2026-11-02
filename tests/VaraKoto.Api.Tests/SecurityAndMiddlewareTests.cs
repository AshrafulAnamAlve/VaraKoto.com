using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging.Abstractions;
using VaraKoto.Api.Middleware;
using VaraKoto.Core.Common;
using Xunit;

namespace VaraKoto.Api.Tests;

public class SecurityAndMiddlewareTests
{
    [Theory]
    [InlineData("<script>alert('xss')</script>মিরপুর ১০", "মিরপুর ১০")]
    [InlineData("ধানমন্ডি<iframe src='malicious.com'></iframe>", "ধানমন্ডি")]
    [InlineData("javascript:alert(1)", "alert(1)")]
    [InlineData("<svg onload=alert(1)>ফার্মগেট", "ফার্মগেট")]
    public void InputSanitizer_StripsMaliciousHtmlAndKeywords(string input, string expected)
    {
        var sanitized = InputSanitizer.Sanitize(input);
        Assert.Equal(expected, sanitized);
    }

    [Fact]
    public void InputSanitizer_HandlesNullAndWhitespaceGracefully()
    {
        Assert.Equal(string.Empty, InputSanitizer.Sanitize(null));
        Assert.Equal(string.Empty, InputSanitizer.Sanitize("   "));
    }

    [Fact]
    public void InputSanitizer_TruncatesExcessiveLength()
    {
        var longString = new string('A', 500);
        var sanitized = InputSanitizer.Sanitize(longString, maxLength: 50);

        Assert.Equal(50, sanitized.Length);
    }

    [Fact]
    public async Task ExceptionHandlingMiddleware_CatchesArgumentException_Returns400WithBengaliMessage()
    {
        var middleware = new ExceptionHandlingMiddleware(
            _ => throw new ArgumentException("যাত্রার স্থান এবং গন্তব্য ভিন্ন হতে হবে।"),
            NullLogger<ExceptionHandlingMiddleware>.Instance);

        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        await middleware.InvokeAsync(context);

        Assert.Equal((int)HttpStatusCode.BadRequest, context.Response.StatusCode);

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        using var reader = new StreamReader(context.Response.Body);
        var json = await reader.ReadToEndAsync();
        using var doc = JsonDocument.Parse(json);

        Assert.Equal(400, doc.RootElement.GetProperty("statusCode").GetInt32());
        Assert.Contains("যাত্রার স্থান", doc.RootElement.GetProperty("messageBn").GetString());
    }

    [Fact]
    public async Task ExceptionHandlingMiddleware_CatchesKeyNotFoundException_Returns404()
    {
        var middleware = new ExceptionHandlingMiddleware(
            _ => throw new KeyNotFoundException("লোকেশন পাওয়া যায়নি"),
            NullLogger<ExceptionHandlingMiddleware>.Instance);

        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        await middleware.InvokeAsync(context);

        Assert.Equal((int)HttpStatusCode.NotFound, context.Response.StatusCode);
    }

    [Fact]
    public async Task ExceptionHandlingMiddleware_CatchesGenericException_Returns500WithoutLeakingInternals()
    {
        var middleware = new ExceptionHandlingMiddleware(
            _ => throw new NullReferenceException("Sensitive internal database connection failed at line 42"),
            NullLogger<ExceptionHandlingMiddleware>.Instance);

        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        await middleware.InvokeAsync(context);

        Assert.Equal((int)HttpStatusCode.InternalServerError, context.Response.StatusCode);

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        using var reader = new StreamReader(context.Response.Body);
        var json = await reader.ReadToEndAsync();
        using var doc = JsonDocument.Parse(json);

        var messageBn = doc.RootElement.GetProperty("messageBn").GetString();
        Assert.Contains("সার্ভারে একটি অপ্রত্যাশিত সমস্যা হয়েছে", messageBn);
        Assert.DoesNotContain("Sensitive internal", json);
    }
}
