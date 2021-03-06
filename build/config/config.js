"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.default = {
    port: process.env.PORT || 3000,
    dbuser: process.env.DB_USER || '',
    dbpw: process.env.DB_PW || '',
    dbserver: process.env.DB_SERVER || '',
    dbdatabase: process.env.DB_DATABASE || '',
    q1: process.env.Q1,
    q2: process.env.Q2,
    //q3: process.env.Q3,
    q4: process.env.Q4,
    q5: process.env.Q5,
    q6: process.env.Q6,
    q7: process.env.Q7,
    q8: process.env.Q8,
    q9: process.env.Q9,
    q10: process.env.Q10,
    q11: process.env.Q11,
    q12: process.env.Q12,
    q13: process.env.Q13,
    secrettoken: process.env.SECRET_TOKEN
};
