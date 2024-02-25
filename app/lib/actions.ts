'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
const { default: parse } = require('node-html-parser');

const FormSchema = z.object({
  id: z.string(),
  // customerId: z.string({
  //   invalid_type_error: 'Please select a customer.',
  // }),
  // amount: z.coerce
  //   .number()
  //   .gt(0, { message: 'Please enter an amount greater than $0.' }),
  // status: z.enum(['pending', 'paid'], {
  //   invalid_type_error: 'Please select an invoice status.',
  // }),
  swgoh_id: z.string(),
  name: z.string(),
  nickname: z.string(),
  type: z.string(),
  recommended_set: z.string(),
  recommended_speed: z.string(),
  receiver_primary: z.string(),
  receiver_secondary: z.string(),
  holo_primary: z.string(),
  holo_secondary: z.string(),
  multiplexer_primary: z.string(),
  multiplexer_secondary: z.string(),
  databus_primary: z.string(),
  databus_secondary: z.string(),
  transmitter_primary: z.string(),
  transmitter_secondary: z.string(),
  processor_primary: z.string(),
  processor_secondary: z.string(),
  notes: z.string(),
  image: z.string(),
});

const CreateMod = FormSchema.omit({ id: true, date: true });
const UpdateCharacter = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    id?: string[];
    name?: string[];
    nickname?: string[];
    type?: string[];
    recommended_set?: string[];
    recommended_speed?: string[];
    receiver_primary?: string[];
    receiver_secondary?: string[];
    holo_primary?: string[];
    holo_secondary?: string[];
    multiplexer_primary?: string[];
    multiplexer_secondary?: string[];
    databus_primary?: string[];
    databus_secondary?: string[];
    transmitter_primary?: string[];
    transmitter_secondary?: string[];
    processor_primary?: string[];
    processor_secondary?: string[];
    notes?: string[];
    image?: string[];
  };
  message?: string | null;
};
/*
export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice');

  // Unreachable code block
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice' };
  }
}
*/
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function updateCharacter(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateCharacter.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    nickname: formData.get('nickname'),
    swgoh_id: formData.get('swgoh_id'),
    type: formData.get('type'),
    recommended_set: formData.get('recommended_set'),
    recommended_speed: formData.get('recommended_speed'),
    receiver_primary: formData.get('receiver_primary'),
    receiver_secondary: formData.get('receiver_secondary'),
    holo_primary: formData.get('holo_primary'),
    holo_secondary: formData.get('holo_secondary'),
    multiplexer_primary: formData.get('multiplexer_primary'),
    multiplexer_secondary: formData.get('multiplexer_secondary'),
    databus_primary: formData.get('databus_primary'),
    databus_secondary: formData.get('databus_secondary'),
    transmitter_primary: formData.get('transmitter_primary'),
    transmitter_secondary: formData.get('transmitter_secondary'),
    processor_primary: formData.get('processor_primary'),
    processor_secondary: formData.get('processor_secondary'),
    image: formData.get('image'),
    notes: formData.get('notes'),
  });

  if (!validatedFields.success) {
    console.log('NOT successful');
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Mods.',
    };
  }

  // if we dont have an image but DO have a swgoh_id, try to pull the image
  if (!validatedFields.data.image && validatedFields.data.swgoh_id) {
    console.log(
      'Do not have an image but DO have a SWGOH ID.  Looking for image.',
    );
    let url =
      'https://swgoh.gg/characters/' + validatedFields.data.swgoh_id + '/';

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
    if (img) {
      console.log('Found image: ' + img);
      validatedFields.data.image = img;
    }
  }

  const {
    name,
    nickname,
    swgoh_id,
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
    image,
  } = validatedFields.data;

  try {
    await sql`
      UPDATE characters
      SET name = ${name}, 
      nickname = ${nickname},
      type = ${type},
      swgoh_id = ${swgoh_id}, 
      recommended_set = ${recommended_set}, 
      recommended_speed = ${recommended_speed},
      receiver_primary = ${receiver_primary}, 
      receiver_secondary = ${receiver_secondary}, 
      holo_primary = ${holo_primary}, 
      holo_secondary = ${holo_secondary},
      multiplexer_primary = ${multiplexer_primary}, 
      multiplexer_secondary = ${multiplexer_secondary}, 
      databus_primary = ${databus_primary}, 
      databus_secondary = ${databus_secondary},
      transmitter_primary = ${transmitter_primary}, 
      transmitter_secondary = ${transmitter_secondary}, 
      processor_primary = ${processor_primary}, 
      processor_secondary = ${processor_secondary},
      notes = ${notes}, 
      image = ${image}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.log('ERROR: ' + error);
    return { message: 'Database Error: Failed to Mods Invoice.' };
  }

  console.log('Saved character');
  revalidatePath('/dashboard/characters');
  redirect('/dashboard/characters');
}
