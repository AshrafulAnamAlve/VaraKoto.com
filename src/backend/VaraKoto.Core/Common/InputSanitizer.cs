using System.Text.RegularExpressions;

namespace VaraKoto.Core.Common;

public static class InputSanitizer
{
    private static readonly Regex ScriptBlockRegex = new(@"<script[^>]*>[\s\S]*?</script>", RegexOptions.IgnoreCase | RegexOptions.Compiled);
    private static readonly Regex IframeBlockRegex = new(@"<iframe[^>]*>[\s\S]*?</iframe>", RegexOptions.IgnoreCase | RegexOptions.Compiled);
    private static readonly Regex StyleBlockRegex = new(@"<style[^>]*>[\s\S]*?</style>", RegexOptions.IgnoreCase | RegexOptions.Compiled);
    private static readonly Regex HtmlTagRegex = new(@"<[^>]*>", RegexOptions.Compiled);

    public static string Sanitize(string? input, int maxLength = 200)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return string.Empty;
        }

        // 1. Trim and truncate
        var clean = input.Trim();
        if (clean.Length > maxLength)
        {
            clean = clean[..maxLength];
        }

        // 2. Remove entire script, iframe, and style blocks
        clean = ScriptBlockRegex.Replace(clean, string.Empty);
        clean = IframeBlockRegex.Replace(clean, string.Empty);
        clean = StyleBlockRegex.Replace(clean, string.Empty);

        // 3. Strip any remaining HTML tags
        clean = HtmlTagRegex.Replace(clean, string.Empty);

        // 4. Remove inline script execution keywords
        clean = Regex.Replace(clean, @"(?i)(javascript:|vbscript:|onload=|onerror=|onclick=|eval\()", string.Empty);

        return clean.Trim();
    }
}
