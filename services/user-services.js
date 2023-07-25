// const Expenses = require("../models/expenses");

exports.getUserExpenses = async (req, where) => {
    try {
        return await req.user.getExpenses(req, where);
    } catch (err) {
        return err;
    }
};