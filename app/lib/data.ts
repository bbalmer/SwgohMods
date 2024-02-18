import { sql } from '@vercel/postgres';

import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
  Character,
  Swgoh,
  StringType,
  CharacterWithAbility,
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';
import { parse } from 'node-html-parser';

const ITEMS_PER_PAGE = 10;

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).

  //noStore();

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    //noStore();
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  //noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  //noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchFilteredCharacters(
  query: string,
  currentPage: number,
) {
  //noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const characters = await sql<Character>`
      SELECT
        id,
        name,
        nickname,
        type,
        recommended_set,
        recommended_speed,
        receiver_primary,
        	receiver_secondary,
        	holo_primary,
        	holo_secondary,
        	multiplexer_primary,
        	multiplexer_secondary,
        	databus_primary,
        	databus_secondary,
        	transmitter_primary,
        	transmitter_secondary,
        	processor_primary,
        	processor_secondary,
        	notes,
          image
      FROM characters
      WHERE
        name ILIKE ${`%${query}%`} OR
        type ILIKE ${`%${query}%`} OR
        nickname ILIKE ${`%${query}%`}
      ORDER BY name
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return characters.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch characters.');
  }
}

export async function fetchCharacterPages(query: string) {
  try {
    //noStore();
    const count = await sql`SELECT COUNT(*)
    FROM characters
    WHERE name ILIKE ${`%${query}%`} OR type ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of characters.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    //noStore();
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    //noStore();
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCharacterById(id: string) {
  try {
    //noStore();
    const data = await sql<Character>`
      SELECT
        id,
        swgoh_id,
        name,
        nickname,
        type,
        recommended_set,
        recommended_speed,
        receiver_primary,
        	receiver_secondary,
        	holo_primary,
        	holo_secondary,
        	multiplexer_primary,
        	multiplexer_secondary,
        	databus_primary,
        	databus_secondary,
        	transmitter_primary,
        	transmitter_secondary,
        	processor_primary,
        	processor_secondary,
        	notes,
          image
      FROM characters
      WHERE id = ${id};
    `;

    const chars = data.rows.map((chars) => ({
      ...chars,
    }));

    return chars[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch character.');
  }
}

export async function fetchAbilitiesById(id: string) {
  try {
    //noStore();
    const data = await sql<Swgoh>`
      SELECT
        id,
        abilities
      FROM swgoh
      WHERE id = ${id};
    `;

    const chars = data.rows.map((chars) => ({
      ...chars,
    }));

    return chars[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch abilities.');
  }
}

export async function fetchCustomers() {
  try {
    //noStore();
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    //noStore();
    const data = await sql<CustomersTableType>`
		SELECT
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
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function getUser(email: string) {
  try {
    //noStore();
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getSwoghCharacter(name: string) {
  const cleanName = name.replace(/\s+/g, '-').toLowerCase();
  let url = 'https://swgoh.gg/characters/' + cleanName + '/';
  let data = await fetch(url)
    .then(function (response) {
      // The API call was successful!
      return response.text();
    })
    .then(function (html) {
      // Convert the HTML string into a document object

      var doc = parse(html);

      // Get the image file
      var img = doc.querySelector('.panel-profile-img')?.getAttribute('src');

      // var anchors = doc.querySelectorAll('a');
      // let affiliations = [];
      // for (var i = 0; i < anchors.length; i++) {
      //   const anchor = anchors[i];
      //   let href = anchor.getAttribute('href');
      //   if (href?.startsWith('/characters/f/')) {
      //     affiliations.push(anchor.text);
      //   }
      // }

      // console.dir(img);
      return {
        imgUrl: img,
      };
    })
    .catch(function (err) {
      // There was an error
      console.warn('Something went wrong.', err);
    });

  return data;
}

export async function fetchCharacters() {
  try {
    //noStore();
    const data = await sql<Character>`
      SELECT *
      FROM characters
      ORDER BY name ASC
    `;

    const characters = data.rows;
    return characters;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all characters.');
  }
}

export async function refreshSwgohCharacters() {
  const characters = await fetchCharacters();

  //truncate the table
  // sql`TRUNCATE swgoh;`;

  for (var i = 0; i < characters.length; i++) {
    const character = characters[i] as Character;

    let url = 'https://swgoh.gg/characters/' + character.swgoh_id + '/';

    console.log('Checking ' + character.name + ' (' + character.swgoh_id + ')');
    let data = await fetch(url)
      .then(function (response) {
        // The API call was successful!
        return response.text();
      })
      .then(function (html) {
        // Convert the HTML string into a document object
        var doc = parse(html);

        // Get the image file
        var nodes = doc.querySelectorAll('.panel-body');

        for (let idx = 0; idx < nodes.length; idx++) {
          const panelBody = nodes[idx];

          let roles: any = [];
          let abilities: any = [];
          if (getPanelBodyType(panelBody, 'Role')) {
            var anchors = panelBody?.getElementsByTagName('a');

            for (var i = 0; i < anchors?.length; i++) {
              let anchor = anchors[i];
              let href = anchor.getAttribute('href');
              let text = anchor.text;
              if (href?.includes('/characters/f/')) {
                roles.push(text);
              }
            }
            console.log('Adding ' + roles.length + ' roles');
          }

          if (getPanelBodyType(panelBody, 'Ability')) {
            var anchors = panelBody?.getElementsByTagName('a');

            for (var i = 0; i < anchors?.length; i++) {
              let anchor = anchors[i];
              let href = anchor.getAttribute('href');
              let text = anchor.text;
              if (href?.includes('/characters/f/')) {
                abilities.push(text);
              }
            }

            console.log('Adding ' + abilities.length + ' abilities');
          }

          sql`
              INSERT INTO swgoh (swgoh_id, roles, abilities)
              VALUES (${character.swgoh_id}, ${roles}, ${abilities})
              ON CONFLICT (id) DO NOTHING;
            `;
        }
      })
      .catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
      });
  }

  return null;
}

function getPanelBodyType(node: any, name: string) {
  var h5 = node.getElementsByTagName('h5')[0];
  if (h5) {
    return h5.innerText.includes(name);
  } else {
    return false;
  }
}

export async function fetchCharactersByAbility(ability: string) {
  try {
    const data = await sql<CharacterWithAbility>`
      SELECT characters.id, characters.swgoh_id, characters.name, characters.image, characters.type, swgoh.abilities
      FROM characters
      JOIN swgoh ON characters.swgoh_id = swgoh.swgoh_id
      WHERE ${ability} = ANY(swgoh.abilities)
      ORDER BY characters.name
    `;

    const characters = data.rows;
    return characters;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all characters.');
  }
}

export async function fetchAbilities() {
  try {
    const data = await sql<StringType>`
    SELECT distinct unnest(abilities) as type from swgoh ORDER BY type`;
    const abilities = data.rows;
    return abilities;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all abilities.');
  }
}
