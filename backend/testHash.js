const bcrypt = require('bcryptjs');

const testPassword = async () => {
  // Generate a fresh hash
  const hash = await bcrypt.hash('admin123', 12);
  console.log('Fresh hash:', hash);

  // Test comparison
  const match = await bcrypt.compare('admin123', hash);
  console.log('Password match:', match);
};

testPassword();
