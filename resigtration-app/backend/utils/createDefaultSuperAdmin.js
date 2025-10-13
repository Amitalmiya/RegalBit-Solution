const bcrypt = require("bcrypt");
const { pool, poolPhone, poolEmail } = require("../config/db");

async function createDefaultSuperAdmin() {
  const superadminData = {
    userName: "superadmin",
    email: "superadmin@gmail.com",
    phone: 7535851403,
    password_hash: await bcrypt.hash("Super@2003", 10),
    role: "superadmin",
    password: "Super@2003"

  };

  const dbs = [
    { db: pool, name: "Main" },
    { db: poolPhone, name: "Phone" },
    { db: poolEmail, name: "Email" },
  ];

  for (const { db, name } of dbs) {
    try {
      const [rows] = await db.query("SELECT id FROM users WHERE role = 'superadmin' LIMIT 1");
      if (rows.length === 0) {

        const [columns] = await db.query("SHOW COLUMNS FROM users");
        const columnNames = columns.map((col) => col.Field);

        const validColumns = Object.keys(superadminData).filter(col => columnNames.includes(col));
        const placeholders = validColumns.map(() => "?").join(", ");
        const values = validColumns.map(col => superadminData[col]);

        await db.query(
          `INSERT INTO users (${validColumns.join(", ")}) VALUES (${placeholders})`,
          values
        );

        console.log(`SuperAdmin created in ${name} DB`);
      } else {
        console.log(`SuperAdmin already exists in ${name} DB`);
      }
    } catch (err) {
      console.error(`Error creating SuperAdmin in ${name} DB:`, err);
    }
  }
}

module.exports = createDefaultSuperAdmin;
