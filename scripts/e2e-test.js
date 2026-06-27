/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
const anonMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

if (!urlMatch || !keyMatch || !anonMatch) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim().replace(/['"]/g, '');
const supabaseKey = keyMatch[1].trim().replace(/['"]/g, '');
const anonKey = anonMatch[1].trim().replace(/['"]/g, '');

// 1. Admin Client
const admin = createClient(supabaseUrl, supabaseKey);

// Public Client
const pub = createClient(supabaseUrl, anonKey);

async function run() {
  console.log("=== STARTING E2E VERIFICATION ===");
  const testEmail = `e2e-${Date.now()}@test.com`;
  const testPass = 'E2eTestPass123!';
  
  try {
    // 1. Admin creates company
    console.log("1. Admin creating company...");
    const { data: comp, error: compErr } = await admin
      .from('companies')
      .insert({ name: 'E2E Trekking Co', slug: `e2e-${Date.now()}`, status: 'active', verification_status: 'verified' })
      .select().single();
    if (compErr) throw compErr;
    console.log("   -> Created company ID:", comp.id);

    // 2. Admin provisions login
    console.log("2. Admin provisioning user...");
    const { data: user, error: userErr } = await admin.auth.admin.createUser({
      email: testEmail,
      password: testPass,
      email_confirm: true
    });
    if (userErr) throw userErr;
    console.log("   -> Created auth user ID:", user.user.id);

    // Link user to company
    const { error: linkErr } = await admin
      .from('companies')
      .update({ owner_id: user.user.id })
      .eq('id', comp.id);
    if (linkErr) throw linkErr;
    
    // 3. Company logs in
    console.log("3. Company logging in...");
    const { data: authSession, error: authErr } = await pub.auth.signInWithPassword({
      email: testEmail,
      password: testPass
    });
    if (authErr) throw authErr;
    
    // Create authenticated company client
    const companyClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${authSession.session.access_token}` } }
    });

    // 4. Company creates trek
    console.log("4. Company creating trek...");
    const { data: trek, error: trekErr } = await companyClient
      .from('treks')
      .insert({
        company_id: comp.id,
        title: 'E2E Kedarkantha',
        description: 'E2E test description for the trek.',
        region: 'Uttarakhand',
        slug: `e2e-kedar-${Date.now()}`,
        status: 'active',
        price_per_person: 10000,
        duration_days: 5,
        difficulty: 'moderate'
      })
      .select().single();
    if (trekErr) throw trekErr;
    console.log("   -> Created trek ID:", trek.id);

    // 5. Company creates departure
    console.log("5. Company creating departure...");
    const depDate = new Date();
    depDate.setDate(depDate.getDate() + 10);
    const retDate = new Date(depDate);
    retDate.setDate(retDate.getDate() + 5);

    const { data: dep, error: depErr } = await companyClient
      .from('departures')
      .insert({
        trek_id: trek.id,
        departure_date: depDate.toISOString().split('T')[0],
        return_date: retDate.toISOString().split('T')[0],
        total_seats: 10,
        base_price: 10000,
        offer_price: 9000,
        status: 'Upcoming',
        is_active: true
      })
      .select().single();
    if (depErr) throw depErr;
    console.log("   -> Created departure ID:", dep.id);

    // 6. Public books departure (RPC)
    console.log("6. Public booking 2 seats...");
    const { data: bookRef, error: bookErr } = await admin.rpc('create_booking', {
      p_departure_id: dep.id,
      p_travellers: 2,
      p_name: 'E2E Customer',
      p_email: 'customer@e2e.com',
      p_phone: '1234567890',
      p_notes: 'E2E Test Note'
    });
    if (bookErr) throw bookErr;
    console.log("   -> Booking created successfully:", bookRef);

    // 7. Verify seats decremented
    console.log("7. Verifying departure seats...");
    const { data: depCheck } = await admin.from('departures').select('booked_seats').eq('id', dep.id).single();
    if (depCheck.booked_seats !== 2) throw new Error(`Expected 2 booked seats, got ${depCheck.booked_seats}`);
    console.log("   -> Seats successfully decremented (booked_seats = 2)");

    // 8. Find the booking record
    const { data: booking } = await admin.from('bookings').select('id, status').eq('departure_id', dep.id).single();
    console.log("   -> Booking ID:", booking.id, "Status:", booking.status);

    // 9. Verify Immutability (Company tries to change total_amount)
    console.log("8. Verifying Immutability trigger...");
    const { error: hackErr } = await companyClient
      .from('bookings')
      .update({ total_amount: 1 })
      .eq('id', booking.id);
    
    if (!hackErr) {
      throw new Error("Immutability trigger failed! Company was able to change total_amount.");
    }
    console.log("   -> Trigger worked! Caught error:", hackErr.message);

    // 10. Verify Status update (Company changes status to Confirmed)
    console.log("9. Verifying valid status update...");
    const { data: updBooking, error: updErr } = await companyClient
      .from('bookings')
      .update({ status: 'Confirmed' })
      .eq('id', booking.id)
      .select().single();
    
    if (updErr) throw updErr;
    if (updBooking.status !== 'Confirmed') throw new Error("Status did not update.");
    console.log("   -> Status successfully updated to 'Confirmed'");

    console.log("=== END-TO-END VERIFICATION SUCCESSFUL ===");

  } catch (err) {
    console.error("\n❌ E2E TEST FAILED:", err);
  } finally {
    // Cleanup
    console.log("\nCleaning up...");
    if (testEmail) {
      const { data: users } = await admin.auth.admin.listUsers();
      const user = users.users.find(u => u.email === testEmail);
      if (user) {
        await admin.auth.admin.deleteUser(user.id);
        console.log("   -> Deleted test user");
      }
    }
    await admin.from('companies').delete().like('slug', 'e2e-%');
    console.log("   -> Deleted test company (cascades to treks/departures/bookings)");
  }
}

run();
