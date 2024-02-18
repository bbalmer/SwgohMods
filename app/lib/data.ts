import { sql } from '@vercel/postgres';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

  var count = 0;
  for (var i = 0; i < characters.length; i++) {
    const character = characters[i] as Character;

    let roles: any = [];
    let abilities: any = [];

    if (!character.swgoh_id) {
      continue;
    }

    count++;
    let url = 'https://swgoh.gg/characters/' + character.swgoh_id + '/';

    console.log(
      'Checking ' +
        count +
        ' ' +
        character.name +
        ' (' +
        character.swgoh_id +
        ')',
    );

    let response = await fetch(url);

    // if (!response.ok) {
    //   throw new Error('Bad requet');
    // }

    const html = await response.text();
    // console.log('DONE with ' + count);

    // // Convert the HTML string into a document object
    var doc = parse(html);

    // // Get the image file
    var nodes = doc.querySelectorAll('.panel-body');

    for (let idx = 0; idx < nodes.length; idx++) {
      const panelBody = nodes[idx];

      if (getPanelBodyType(panelBody, 'Role')) {
        // console.log('Found Role');
        var anchors = panelBody?.getElementsByTagName('a');
        // console.log('Found ' + anchors.length + ' anchors in panel-body');

        for (var r = 0; r < anchors?.length; r++) {
          let anchor = anchors[r];
          let href = anchor.getAttribute('href');
          let text = anchor.text;
          if (href?.includes('/characters/f/')) {
            // console.log('   --> Adding role of ' + text);
            roles.push(text);
          }
        }
        console.log('Adding ' + roles.length + ' roles');
      }

      if (getPanelBodyType(panelBody, 'Ability')) {
        // console.log('Found Ability');
        var anchors = panelBody?.getElementsByTagName('a');

        for (var a = 0; a < anchors?.length; a++) {
          let anchor = anchors[a];
          let href = anchor.getAttribute('href');
          let text = anchor.text;
          if (href?.includes('/characters/f/')) {
            // console.log('   --> Adding ability of ' + text);
            abilities.push(text);
          }
        }

        console.log('Adding ' + abilities.length + ' abilities');
      }

      // sql`
      //     INSERT INTO swgoh (swgoh_id, roles, abilities)
      //     VALUES (${character.swgoh_id}, ${roles}, ${abilities})
      //     ON CONFLICT (id) DO NOTHING;
      //   `;
    }
    if (character.swgoh_id) {
      console.log(
        'Looking to create new swgoh record for ' + character.swgoh_id,
      );
      console.log(roles);
      console.log(abilities);
      try {
        const newSwgoh = await prisma.swgoh.create({
          data: {
            swgoh_id: character.swgoh_id,
            roles: roles,
            abilities: abilities,
          },
        });
      } catch (err) {
        console.error('Failed to insert');
      }
      // console.log('Adding swgoh data for ' + character.name);
      // console.dir(newSwgoh);
    }
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

export async function fetchSwgohById(id: string) {
  const data = await prisma.swgoh.findUnique({
    where: {
      swgoh_id: id,
    },
  });

  return data;
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

export async function fetchCharactersByRole(role: string) {
  try {
    const data = await sql<CharacterWithAbility>`
      SELECT characters.id, characters.swgoh_id, characters.name, characters.image, characters.type, swgoh.roles
      FROM characters
      JOIN swgoh ON characters.swgoh_id = swgoh.swgoh_id
      WHERE ${role} = ANY(swgoh.roles)
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

export async function fetchRoles() {
  try {
    const data = await sql<StringType>`
    SELECT distinct unnest(roles) as type from swgoh ORDER BY type`;
    const roles = data.rows;
    return roles;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all roles.');
  }
}
