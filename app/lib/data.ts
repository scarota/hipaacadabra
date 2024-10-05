import { PrismaClient } from '@prisma/client';
import { CustomersTableType, InvoicesTable } from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';
import { getOrganization } from '@/app/lib/auth';
import { getRevenue } from '@prisma/client/sql';

export async function fetchRevenue() {
  noStore();
  const prisma = new PrismaClient();
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000))
    const revenue = await prisma.$queryRawTyped(getRevenue());
    // console.log('Data fetch completed after 3 seconds.');

    console.log(revenue);

    return revenue;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  } finally {
    await prisma.$disconnect();
  }
}

export async function fetchLatestInvoices() {
  noStore();
  const prisma = new PrismaClient();
  const org = await getOrganization();

  try {
    const data = await prisma.invoices.findMany({
      relationLoadStrategy: 'join',
      take: 5,
      select: {
        amount: true,
        id: true,
        customers: {
          select: {
            name: true,
            imageUrl: true,
            email: true,
          },
        },
      },
      where: {
        customers: {
          org_code: org,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));

    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  } finally {
    await prisma.$disconnect();
  }
}

export async function fetchCardData() {
  noStore();
  const prisma = new PrismaClient();
  const org = await getOrganization();

  try {
    const invoiceCountPromise = prisma.invoices.count({
      where: {
        customers: {
          org_code: org,
        },
      },
    });

    const customerCountPromise = prisma.customers.count({
      where: {
        org_code: org,
      },
    });

    const invoiceStatusPromise = prisma.invoices.groupBy({
      by: ['status'],
      where: {
        customers: {
          org_code: org,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // await new Promise((resolve) => setTimeout(resolve, 5000));

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    // console.log('Data fetch completed after 3 seconds.');

    const numberOfInvoices = data[0];
    const numberOfCustomers = data[1];
    const totalPaidInvoices = formatCurrency(
      Number(
        data[2][0].status == 'paid'
          ? data[2][0]._sum.amount
          : data[2][1]._sum.amount,
      ),
    );
    const totalPendingInvoices = formatCurrency(
      Number(
        data[2][1].status == 'pending'
          ? data[2][1]._sum.amount
          : data[2][0]._sum.amount,
      ),
    );

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  } finally {
    await prisma.$disconnect();
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  const prisma = new PrismaClient();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const wildcardquery = `%${query}%`;
  const org = await getOrganization();

  try {
    const data = await prisma.$queryRaw<InvoicesTable[]>`SELECT
    invoices.id,
    invoices.amount,
    invoices.date,
    invoices.status,
    customers.name,
    customers.email,
    customers.image_url
  FROM invoices
  JOIN customers ON invoices.customer_id = customers.id
      WHERE customers.org_code = ${org} AND
      (lower(customers.name) LIKE lower(${wildcardquery}) OR
      lower(customers.email) LIKE lower(${wildcardquery}) OR
      lower(invoices.amount::text) LIKE lower(${wildcardquery}) OR
      lower(invoices.date::text) LIKE lower(${wildcardquery})  OR
      lower(invoices.status) LIKE lower(${wildcardquery}))
      ORDER BY invoices.date DESC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  } finally {
    await prisma.$disconnect();
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  const prisma = new PrismaClient();
  const wildcardquery = `%${query}%`;
  const org = await getOrganization();

  try {
    const data = await prisma.$queryRaw<string[]>`SELECT count(*)
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE customers.org_code = ${org} AND
      (lower(customers.name) LIKE lower(${wildcardquery}) OR
      lower(customers.email) LIKE lower(${wildcardquery}) OR
      lower(invoices.amount::text) LIKE lower(${wildcardquery}) OR
      lower(invoices.date::text) LIKE lower(${wildcardquery})  OR
      lower(invoices.status) LIKE lower(${wildcardquery}))
      `;

    const totalPages = Math.ceil(Number(eval(data[0]).count) / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  } finally {
    await prisma.$disconnect();
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();
  const prisma = new PrismaClient();
  try {
    const data = await prisma.invoices.findUnique({
      select: {
        id: true,
        customerId: true,
        amount: true,
        status: true,
      },
      where: {
        id: id,
      },
    });

    const invoice = JSON.parse(JSON.stringify(data)) as typeof data;
    invoice!.amount = data!.amount / 100;

    return invoice;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  } finally {
    await prisma.$disconnect();
  }
}

export async function fetchCustomers() {
  const prisma = new PrismaClient();
  try {
    const customers = await prisma.customers.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  } finally {
    await prisma.$disconnect();
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();
  const prisma = new PrismaClient();
  const wildcardquery = `%${query}%`;
  const org = await getOrganization();

  try {
    const data = await prisma.$queryRaw<CustomersTableType[]>`SELECT
    customers.id,
    customers.name,
    customers.email,
    customers.image_url,
    COUNT(invoices.id) AS total_invoices,
    SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
    SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
  FROM customers
  LEFT JOIN invoices ON customers.id = invoices.customer_id
  WHERE
    customers.org_code = ${org} AND
    (lower(customers.name) LIKE lower(${wildcardquery}) OR
      lower(customers.email) LIKE lower(${wildcardquery}))
  GROUP BY customers.id, customers.name, customers.email, customers.image_url
  ORDER BY customers.name ASC
      `;

    const customers = data.map((customer) => ({
      ...customer,
      total_invoices: Number(customer.total_invoices),
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  } finally {
    await prisma.$disconnect();
  }
}

export async function getUser(email: string) {
  const prisma = new PrismaClient();
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  } finally {
    await prisma.$disconnect();
  }
}
