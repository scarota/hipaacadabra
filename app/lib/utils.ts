import { Revenue } from './definitions';

/**
 * Formats a date string to a localized format
 * @param dateStr The date string to format
 * @param locale The locale to use for formatting (defaults to 'en-US')
 * @returns A formatted date string in the specified locale
 */
export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

/**
 * Formats a number as currency
 * @param amount The amount to format as currency
 * @returns A formatted currency string in USD
 */
export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

/**
 * Generates Y-axis values for a revenue chart
 * @param revenue Array of revenue data points
 * @returns An array of Y-axis values for the chart
 */
export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

/**
 * Creates authentication headers for API requests based on the API configuration
 * @param apiKey The API key to use for authentication
 * @param authType The authentication type ('bearer' or 'x-auth-key')
 * @returns An object containing the appropriate authentication headers
 */
export function createAuthHeaders(
  apiKey: string,
  authType: string,
): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add authentication header based on selected type
  if (authType === 'bearer') {
    headers['Authorization'] = `Bearer ${apiKey}`;
  } else if (authType === 'x-auth-key') {
    headers['X-Auth-Key'] = apiKey;
  }
  // Add other auth types as needed

  return headers;
}
