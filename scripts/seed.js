const { db } = require('@vercel/postgres');
const {
  invoices,
  customers,
  revenue,
  users,
  characters,
} = require('../app/lib/placeholder-data.js');


const bcrypt = require('bcrypt');
const { default: parse } = require("node-html-parser");

const {
  PrismaClient
} = require('@prisma/client');
const prisma = new PrismaClient();

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedInvoices(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "invoices" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL,
    amount INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    date DATE NOT NULL
  );
`;

    console.log(`Created "invoices" table`);

    // Insert data into the "invoices" table
    const insertedInvoices = await Promise.all(
      invoices.map(
        (invoice) => client.sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      createTable,
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedCustomers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "customers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "customers" table`);

    // Insert data into the "customers" table
    const insertedCustomers = await Promise.all(
      customers.map(
        (customer) => client.sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      createTable,
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedRevenue(client) {
  try {
    // Create the "revenue" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `;

    console.log(`Created "revenue" table`);

    // Insert data into the "revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}



async function seedCharacters(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "mods" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS characters (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        swgoh_id VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL,
        recommended_set VARCHAR(255) NOT NULL,
        recommended_speed VARCHAR(255) NOT NULL,
        receiver_primary VARCHAR(255) ,
        	receiver_secondary VARCHAR(255) ,
        	holo_primary VARCHAR(255) ,
        	holo_secondary VARCHAR(255) ,
        	multiplexer_primary VARCHAR(255) ,
        	multiplexer_secondary VARCHAR(255) ,
        	databus_primary VARCHAR(255) ,
        	databus_secondary VARCHAR(255) ,
        	transmitter_primary VARCHAR(255) ,
        	transmitter_secondary VARCHAR(255) ,
        	processor_primary VARCHAR(255) ,
        	processor_secondary VARCHAR(255) ,
        	notes VARCHAR(255),
          image VARCHAR(255)
      );
    `;

    console.log(`Created "characters" table`);

    // Insert data into the "customers" table
    const insertedMods = await Promise.all(
      characters.map(async (mod) => {

        let swgohId = mod.name.replace(/\s+/g, '-').toLowerCase();
        let url = 'https://swgoh.gg/characters/' + swgohId + '/';

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
            return {
              imgUrl: img,
            };
          })
          .catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
          });

        let img = data?.imgUrl;
        if (!img) {
          swgohId = '';
          img = '';
        }

        client.sql`
        INSERT INTO characters (id, swgoh_id, name, type, recommended_set, recommended_speed, receiver_primary, receiver_secondary, holo_primary, holo_secondary, multiplexer_primary, multiplexer_secondary, databus_primary, databus_secondary, transmitter_primary, transmitter_secondary, processor_primary, processor_secondary, notes, image)
        VALUES (${mod.id}, ${swgohId}, ${mod.name}, ${mod.type}, ${mod.recommended_set}, ${mod.recommended_speed}, ${mod.receiver_primary}, ${mod.receiver_secondary}, ${mod.halo_primary}, ${mod.halo_secondary}, ${mod.multiplexer_primary}, ${mod.multiplexer_secondary}, ${mod.databus_primary}, ${mod.databus_secondary}, ${mod.transmitter_primary}, ${mod.transmitter_secondary}, ${mod.processor_primary}, ${mod.processor_secondary}, ${mod.notes}, ${img})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedMods.length} mods`);

    return {
      createTable,
      mods: insertedMods,
    };
  } catch (error) {
    console.error('Error seeding mods:', error);
    throw error;
  }
}



async function refreshSwgohCharacters() {

  const characters = await fetchCharacters();

  for (var i = 0; i < characters.length; i++) {
    const character = characters[i];

    let url = 'https://swgoh.gg/characters/' + character.swgoh_id + '/';

    console.log(
      'Checking ' +
      (i + 1) +
      ' ' +
      character.name +
      ' (' +
      character.swgoh_id +
      ')',
    );
    let response = await fetch(url);

    if (!response.ok) {
      throw new Error('Bad requet');
    }

    const html = await response.text();

    // Convert the HTML string into a document object
    var doc = parse(html);

    // Get the image file
    var nodes = doc.querySelectorAll('.panel-body');

    for (let idx = 0; idx < nodes.length; idx++) {
      const panelBody = nodes[idx];

      let roles = [];
      let abilities = [];
      if (getPanelBodyType(panelBody, 'Role')) {
        var anchors = panelBody?.getElementsByTagName('a');

        for (var i = 0; i < anchors?.length; i++) {
          let anchor = anchors[i];
          let href = anchor.getAttribute('href');
          let text = anchor.text;
          if (href?.includes('/characters/f/')) {
            console.log('   --> Adding role of ' + text);
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
            console.log('   --> Adding ability of ' + text);
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

      if (character.swgoh_id) {
        console.log(
          'Looking to create new swgoh record for ' + character.swgoh_id,
        );
        console.log(roles);
        console.log(abilities);
        // const newSwgoh = await prisma.swgoh.create({
        //   data: {
        //     swgoh_id: character.swgoh_id,
        //     roles: roles,
        //     abilities: abilities,
        //   },
        // });
        // console.log('Adding swgoh data for ' + character.name);
        // console.dir(newSwgoh);
      }
    }
  }

  return null;
}


async function main() {
  const client = await db.connect();

  // await seedUsers(client);
  // await seedCustomers(client);
  // await seedInvoices(client);
  // await seedRevenue(client);
  // await seedCharacters(client);
  await refreshSwgohCharacters();

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
