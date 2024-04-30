class CalielDb {
  table = "_calieltb";
  log_table = "_calielogs";
  constructor(mysqlPool) {
    this.mysqlPool = mysqlPool;
  }
  NO_ENTRY = new Error("No entry for this user");

  async #query(str, params) {
    const sql = this.mysqlPool.format(str, params);
    const [rows] = await this.mysqlPool.query(sql);
    return rows;
  }

  async setupDatabase() {
    await this.#query(`
            CREATE TABLE IF NOT EXISTS ${this.table} (
              id VARCHAR(36) NOT NULL PRIMARY KEY,
              cookie VARCHAR(255) NOT NULL UNIQUE,
              mon TINYINT(1) NOT NULL,
              tue TINYINT(1) NOT NULL,
              wed TINYINT(1) NOT NULL,
              thu TINYINT(1) NOT NULL,
              fri TINYINT(1) NOT NULL,
              lastmail VARCHAR(255),
              val_cookie TINYINT NOT NULL DEFAULT '0'
            );
          `);
    await this.#query(`
    CREATE TABLE IF NOT EXISTS ${this.log_table} (
      nbr INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      id VARCHAR(36) NOT NULL ,
      log VARCHAR(255) NOT NULL,
      timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  }

  async new_logger(id, days, cookie) {
    const dayValues = this.daysToBool(days);
    const query = `INSERT INTO ${this.table}(id,cookie,mon,tue,wed,thu,fri) VALUES(?,?,?,?,?,?,?);`;
    const rows = await this.#query(query, [
      id,
      cookie,
      dayValues.Mon,
      dayValues.Tue,
      dayValues.Wed,
      dayValues.Thu,
      dayValues.Fri,
    ]);
  }

  async get_logger(id) {
    const query = `SELECT id,cookie, mon, tue, wed, thu, fri,val_cookie FROM ${this.table} WHERE id = ?`;
    let rows = await this.#query(query, [id]);
    if (rows.length === 0) {
      await this.new_logger(id, [], "");
      rows = await this.#query(query, [id]);
    }
    return this.sql2obj(rows[0]);
  }

  async get_all_logger() {
    const query = `SELECT id,cookie, mon, tue, wed, thu, fri,val_cookie FROM ${this.table}`;
    let rows = await this.#query(query);
    let resp=[]
    rows.forEach((row) => {
      resp.push(this.sql2obj(row));
    });
    return resp;
  }

  async update_logger(id, days, cookie = false) {
    const dayValues = this.daysToBool(days);
    if (cookie == false) {
      const query = `UPDATE ${this.table} SET mon= ?, tue= ?,wed= ?,thu= ?,fri= ? WHERE id = ? ;`;
      const rows = await this.#query(query, [
        dayValues.Mon,
        dayValues.Tue,
        dayValues.Wed,
        dayValues.Thu,
        dayValues.Fri,
        id,
      ]);
      this.log(id, "User updated his days : " + days);
    } else {
      const query = `UPDATE ${this.table} SET cookie=?,mon= ?, tue= ?,wed= ?,thu= ?,fri= ?,val_cookie=0 WHERE id = ? ;`;
      const rows = await this.#query(query, [
        cookie,
        dayValues.Mon,
        dayValues.Tue,
        dayValues.Wed,
        dayValues.Thu,
        dayValues.Fri,
        id,
      ]);
      this.log(id, "User updated his days & cookies :" + days);
    }
  }

  async set_lastmail(id, lastmail) {
    const query = `UPDATE ${this.table} SET lastmail=? WHERE id = ? ;`;
    const rows = await this.#query(query, [lastmail, id]);
  }

  async log(id, log) {
    const query = `INSERT INTO ${this.log_table} (id,log) VALUES(?,?);`;
    const rows = await this.#query(query, [id, log]);
  }

  async get_logs(id) {
    const query = `SELECT nbr, timestamp,log FROM ${this.log_table} WHERE id = ? ORDER BY nbr DESC LIMIT 10`;
    return await this.#query(query, [id]);
  }

  async get_all_logs() {
    const query = `SELECT nbr,id, timestamp,log FROM ${this.log_table} ORDER BY nbr DESC LIMIT 20`;
    return await this.#query(query);
  }

  async today_loggers() {
    var currentDate = new Date();
    var dayOfWeek = currentDate.getDay();
    if (dayOfWeek != 0 && dayOfWeek != 6) {
      let day = this.today(dayOfWeek - 1);
      const query = `SELECT id,cookie,lastmail FROM ${this.table} WHERE ${day} = 1`;
      let rows = await this.#query(query);
      return rows;
    } else {
      return [];
    }
  }

  async validate_cookie(id) {
    this.log(id, "Cookie is Valid");
    const query = `UPDATE ${this.table} SET val_cookie = 1 WHERE id = ? ;`;
    const rows = await this.#query(query, [id]);
  }

  async delete_logger(id) {
    const query = `DELETE FROM ${this.table} WHERE id = ?`;
    const params = [id];
  }
  daysToBool(days) {
    const dayValues = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
    };
    for (const day of days) {
      dayValues[day] = 1;
    }
    return dayValues;
  }
  today(int) {
    const days = ["mon", "tue", "wed", "thu", "fri"];
    return days[int];
  }
  sql2obj(row) {
    const days = [];
    if (row.mon) days.push("Mon");
    if (row.tue) days.push("Tue");
    if (row.wed) days.push("Wed");
    if (row.thu) days.push("Thu");
    if (row.fri) days.push("Fri");
    return {
      days,
      cookie: row.cookie,
      caliel_id: row.id,
      val_cookie: row.val_cookie,
    };
  }
}
export default CalielDb;
