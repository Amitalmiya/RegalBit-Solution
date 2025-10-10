const bcrypt = require('bcrypt');

async function createDefaultSuperAdmin(pool, poolPhone, poolEmail) {
    await createIn(pool, "Main"),
    await createIn(poolPhone, "Phone"),
    await createIn(poolEmail, "Email");
}

async function createIn(db, name) {
    try{
        const [rows] = await db.query("SELECT id FROM users WHERE role='superadmin' LIMIT 1");
        if (rows.length === 0) {
        
            const hased = await bcrypt.hash("Super@2003", 10);

            await db.query(
            `INSERT INTO users (userName, email, password, role, status, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())`,
            ["superadmin", "superadmin@gmail.com", hased, "superadmin", "active"]
            );

            console.log(`SuperAdmin added to ${name} DB`);
        } else {
            console.log(`SuperAdmin already exists in ${name} DB`);
        } 
    }catch (error){
        console.error(`Error creating SuperAdmin in ${name} DB:`, error);
    }
}

module.exports = createDefaultSuperAdmin;