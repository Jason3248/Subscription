const bcrypt = require('bcrypt');

(async () => {
  const plainPassword = "12345678";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  console.log("Plain:", plainPassword);
  console.log("Hashed:", hashedPassword);

  const match = await bcrypt.compare(plainPassword, hashedPassword);
  console.log("Match result:", match);
})();
