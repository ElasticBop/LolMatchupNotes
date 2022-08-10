const asyncHandler = require('express-async-handler');
const Schedule = require("../models/scheduleModel");
const User = require("../models/userModel");

/**
 * Retrieve Schedules from Mongoose DB
 * @param {*} req 
 * @param {*} res 
 */

//in the authMiddleware, we are checking the token and assigning the current req.user (alias for req.session.user) to the object that is returned using the deencoded token
const getSchedules = asyncHandler(async (req, res) => {
    const schedules = await Schedule.find({user: req.user.id});
    res.status(200)
    res.json(schedules);
})

//async handler is related to errorsthrown by async functions
const createSchedule = asyncHandler(async (req, res) => {
    if (!req.body.text){
        res.status(400);
        throw new Error("Add a text field");
    }

    const schedule = await Schedule.create({
        text : req.body.text,
        user: req.user.id
    })
    res.status(200)
    res.json(schedule);
})

const updateSchedule = asyncHandler(async (req, res) => {
    const schedule = await Schedule.findById(req.params.id);
    if(!schedule){
        res.status(400);
        throw new Error("Goal not Found");
    }

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    if(schedule.user.toString() !== req.user.id){
        res.status(401);
        throw new Error("User not authorized");
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
    })
    res.status(200)
    res.json(updatedSchedule);
})

const deleteSchedule = asyncHandler(async (req, res) => {
    const schedule = await Schedule.findById(req.params.id);
    if(!schedule){
        res.status(400);
        throw new Error("Schedule not Found");
    }

    //user.id is extracte from token I believe

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    if(schedule.user.toString() !== req.user.id){
        res.status(401);
        throw new Error("User not authorized");
    }

    await schedule.remove();
    res.status(200)
    res.json({id: req.params.id});
})

module.exports= {
    getSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule
}