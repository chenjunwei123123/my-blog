export const ironOption = {
  // cookieName:'sid',
  // password:'HrjqhB79H9RVxLE3qNR5UFtO8QvHJVJO',
  cookieName:process.env.SESSION_COOKIE_NAME as string,
  password:process.env.SESSION_PASSWORD as string,
  cookieOptions:{
    maxAge:24*60*60*1000,
    secure:process.env.NODE_ENV === "production"
  }
}