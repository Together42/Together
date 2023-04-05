import { db } from "../db/database.js";

export async function getEventList() {
  return db
    .execute(
      "SELECT ev.id, ev.title, ev.description, ev.createdId, us.intraId, ev.isMatching, ev.categoryId FROM event_info as ev JOIN users as us ON ev.createdId=us.id",
    )
    .then((result) => result[0]);
}

export async function getNotMatchedEventByCategory(categoryId) {
  return db
    .execute("SELECT * FROM event_info WHERE categoryId=? AND isMatching=0", [
      categoryId,
    ])
    .then((result) => result[0][0])
    .catch(() => undefined);
}

export async function findByEventId(id) {
  return (
    db
      //.execute('SELECT * FROM event_info WHERE id=?',[id])
      .execute(
        "SELECT ev.id, ev.title, ev.description, ev.createdId, us.intraId, ev.isMatching FROM event_info as ev JOIN users as us ON ev.createdId=us.id WHERE ev.id=?",
        [id],
      )
      .then((result) => result[0][0])
  );
}

export async function getByEventTitle(id) {
  return db
    .execute("SELECT title FROM event_info WHERE id=?", [id])
    .then((result) => result[0][0]);
}

export async function deleteEvent(id) {
  return db.execute("DELETE FROM event_info WHERE id=?", [id]);
}

export async function createEvent(event) {
  const { title, description, createdId, categoryId } = event;
  return db
    .execute(
      "INSERT INTO event_info (title, description, createdId, categoryId) VALUES (?,?,?,?)",
      [title, description, createdId, categoryId],
    )
    .then((result) => result[0].insertId);
}

export async function register(user, eventId) {
  return db
    .execute("INSERT INTO attendance_info (userId, eventId) VALUES (?,?)", [
      user,
      eventId,
    ])
    .then((result) => result[0].insertId);
}

export async function unregister(user, eventId) {
  return db.execute("DELETE FROM attendance_info WHERE userId=? && eventId=?", [
    user,
    eventId,
  ]);
}

export async function findByAttend(user, eventId) {
  return db
    .execute("SELECT * FROM attendance_info WHERE userId=? && eventId=?", [
      user,
      eventId,
    ])
    .then((result) => result[0][0]);
}

export async function findAttendByEventId(eventId) {
  return db
    .execute("SELECT * FROM attendance_info WHERE eventId=?", [eventId])
    .then((result) => result[0]);
}

export async function changeEvent(eventId) {
  return db.execute("UPDATE event_info SET isMatching=1 WHERE id=?", [eventId]);
}

export async function getMatchingList(id) {
  return db
    .execute(
      "SELECT us.intraId, us.profile, at.teamId from attendance_info as at JOIN users as us ON at.userId=us.id WHERE at.eventId=? ORDER BY at.teamId",
      [id],
    )
    .then((result) => result[0]);
}

export async function findCreateUser(eventId) {
  return db
    .execute("SELECT * FROM event_info WHERE id=?", [eventId])
    .then((result) => result[0][0]);
}

export async function getByAttendId(id) {
  return db
    .execute("SELECT * FROM attendance_info WHERE id=?", [id])
    .then((result) => result[0][0]);
}

export async function createTeam(teamId, id) {
  return db
    .execute("UPDATE attendance_info SET teamId=? WHERE id=?", [teamId, id])
    .then(() => getByAttendId(id));
}

export async function getAttendingPoint() {
  return db
    .execute(
      `SELECT at.userId, us.intraId, us.profile, COUNT(at.userId) as totalPoint, 
      COUNT(case when  ev.categoryId = 1 then 1 end) as meetingPoint,
      COUNT(case when  ev.categoryId = 2 then 1 end) as eventPoint
      FROM attendance_info  as at 
      JOIN users as us ON at.userId=us.id 
      JOIN event_info as ev ON at.eventId=ev.id
      WHERE ev.isMatching=1
      GROUP BY at.userId
      ORDER BY totalPoint DESC;
      `,
    )
    .then((result) => result[0]);
}
