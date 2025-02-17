//mysql2
const config = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'testbeer',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 3306,
    dateStrings : true,
  };

module.exports = config;
