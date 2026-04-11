exports.handler = async (event) => {
  let email;
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    email = body.email ? body.email.toLowerCase() : '';
  } catch (err) {
    email = '';
  }

  const staffList = (process.env.UPHIRE_STAFF_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  const isStaff = staffList.includes(email);
  return { statusCode: 200, body: JSON.stringify({ isStaff }) };
};

