using System.Globalization;
using System.Text;

namespace VaraKoto.Core.Common;

public static class BengaliNumberHelper
{
    private static readonly char[] BengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

    public static string ToBengaliDigits(int number)
    {
        return ToBengaliDigits(number.ToString(CultureInfo.InvariantCulture));
    }

    public static string ToBengaliDigits(decimal number, int decimalPlaces = 0)
    {
        var format = decimalPlaces > 0 ? $"F{decimalPlaces}" : "0";
        return ToBengaliDigits(number.ToString(format, CultureInfo.InvariantCulture));
    }

    public static string ToBengaliDigits(string input)
    {
        if (string.IsNullOrEmpty(input))
        {
            return string.Empty;
        }

        var sb = new StringBuilder(input.Length);
        foreach (var ch in input)
        {
            if (ch >= '0' && ch <= '9')
            {
                sb.Append(BengaliDigits[ch - '0']);
            }
            else
            {
                sb.Append(ch);
            }
        }

        return sb.ToString();
    }
}
